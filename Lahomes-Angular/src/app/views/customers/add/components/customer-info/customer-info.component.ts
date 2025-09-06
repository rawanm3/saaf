import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [SelectFormInputDirective, ReactiveFormsModule],
  templateUrl: './customer-info.component.html',
  styles: [``],
})
export class CustomerInfoComponent {
  customerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: [''],
      nationalId: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      password: [''],
      nafathSub: [''],
      iban: [''],
      status: ['pending'],
      role: ['user'],
    });

    // ✅ نراقب تغيير الدولة هنا
    this.customerForm.get('country')?.valueChanges.subscribe((value) => {
      if (value?.toLowerCase() === 'sa') {
        // سعودي → يطلب nafathSub ويشيل شرط الباسورد
        this.customerForm.get('nafathSub')?.setValidators([Validators.required]);
        this.customerForm.get('password')?.clearValidators();
      } else {
        // غير سعودي → يطلب الباسورد ويشيل شرط nafathSub
        this.customerForm.get('password')?.setValidators([Validators.required]);
        this.customerForm.get('nafathSub')?.clearValidators();
      }

      this.customerForm.get('password')?.updateValueAndValidity();
      this.customerForm.get('nafathSub')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      console.log('Customer Data:', this.customerForm.value);
      // هنا تبعتي الداتا للـ API
    } else {
      console.error('Form is invalid');
    }
  }
}

