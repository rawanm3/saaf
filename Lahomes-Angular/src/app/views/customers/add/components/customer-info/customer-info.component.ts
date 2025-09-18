import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '@core/services/customers.service';

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './customer-info.component.html',
  styles: [``],
})
export class CustomerInfoComponent {
  customerForm: FormGroup;
  selectedFiles: { [key: string]: File } = {};

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: [''],
      nationalId: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      nafathSub: [''],
      iban: [''],
      status: ['pending'],
      role: ['user'],
    });

    this.customerForm.get('country')?.valueChanges.subscribe(value => {
      const isSaudi = value.toLowerCase() === 'sa' || value.toLowerCase() === 'saudi arabia';
      if (isSaudi) {
        this.customerForm.get('nafathSub')?.setValidators([Validators.required]);
        this.customerForm.get('password')?.clearValidators();
      } else {
        this.customerForm.get('password')?.setValidators([Validators.required]);
        this.customerForm.get('nafathSub')?.clearValidators();
      }
      this.customerForm.get('password')?.updateValueAndValidity();
      this.customerForm.get('nafathSub')?.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[field] = input.files[0];
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
  
    const fv = this.customerForm.value;
    const formData = new FormData();
  
    // الاسم كـ JSON string (المهم للbackend)
    // formData.append('name', JSON.stringify({
    //   ar: fv.nameAr,
    //   en: fv.nameEn
    
    formData.append('name.ar', fv.nameAr);
    formData.append('name.en', fv.nameEn);
    
    formData.append('nationalId', fv.nationalId);
    formData.append('country', fv.country);
    formData.append('email', fv.email);
    formData.append('phone', fv.phone);
    formData.append('iban', fv.iban);
    formData.append('status', fv.status);
    formData.append('role', fv.role);
  
    const isSaudi = fv.country.toLowerCase() === 'sa' || fv.country.toLowerCase() === 'saudi arabia';
    if (isSaudi) formData.append('nafathSub', fv.nafathSub);
    else formData.append('password', fv.password);
  
    // الملفات
    if (this.selectedFiles['nationalIdImageUrl']) {
      formData.append('nationalIdImageUrl', this.selectedFiles['nationalIdImageUrl']);
    }
    if (this.selectedFiles['ibanImageUrl']) {
      formData.append('ibanImageUrl', this.selectedFiles['ibanImageUrl']);
    }
    if (this.selectedFiles['profileImage']) {
      formData.append('profileImage', this.selectedFiles['profileImage']);
    }
  
    this.customerService.addCustomer(formData).subscribe({
      next: res => {
        alert('User Created Successfully!');
        this.customerForm.reset();
        this.selectedFiles = {};
      },
      error: err => {
        alert(err?.error?.message || 'Failed to create user');
      }
    });
  }}

  