import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from '@core/services/user.service';

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './customer-info.component.html',
  styles: [``],
})
export class CustomerInfoComponent {
  customerForm: FormGroup;

  private readonly requiredFields = [
    'name.ar',
    'nationalId',
    'country',
    'password', // لغير السعوديين فقط
    'phone',
    'email',
    'nationalIdImageUrl',
    'ibanImageUrl',
  ];

  debugPayload: any = {};
  missingFields: string[] = [];

  constructor(private fb: FormBuilder, private customersService: CustomersService) {
    this.customerForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: [''],
      nationalId: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''], // required لو مش SA
      nafathSub: [''], // required لو SA
      iban: [''],
      nationalIdImageUrl: ['', Validators.required], // لينك
      ibanImageUrl: ['', Validators.required],       // لينك
      status: ['pending'],
      role: ['user'],
    });
  }
selectedFiles: { [key: string]: File } = {};

onFileSelected(event: Event, field: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFiles[field] = input.files[0];
  }
}

  ngOnInit(): void {
    this.customerForm.get('country')?.valueChanges.subscribe((value) => {
      const v = (value || '').toString().toLowerCase();
      if (v === 'sa' || v === 'saudi arabia') {
        this.customerForm.get('nafathSub')?.setValidators([Validators.required]);
        this.customerForm.get('password')?.clearValidators();
      } else {
        this.customerForm.get('password')?.setValidators([Validators.required]);
        this.customerForm.get('nafathSub')?.clearValidators();
      }
      this.customerForm.get('password')?.updateValueAndValidity({ emitEvent: false });
      this.customerForm.get('nafathSub')?.updateValueAndValidity({ emitEvent: false });
      this.refreshDebug();
    });

    this.customerForm.valueChanges.subscribe(() => this.refreshDebug());

    this.refreshDebug();
  }

  private buildPayload() {
    const fv = this.customerForm.value;

    return {
      name: {
        ar: (fv.nameAr || '').toString().trim(),
        en: (fv.nameEn || '').toString().trim(),
      },
      nationalId: (fv.nationalId || '').toString().trim(),
      country: (fv.country || '').toString().trim(),
      email: (fv.email || '').toString().trim(),
      phone: (fv.phone || '').toString().trim(),
      password: (fv.password || '').toString(),
      nafathSub: (fv.nafathSub || '').toString(),
      iban: (fv.iban || '').toString().trim(),
      nationalIdImageUrl: (fv.nationalIdImageUrl || '').toString().trim(),
      ibanImageUrl: (fv.ibanImageUrl || '').toString().trim(),
      status: fv.status || 'pending',
      role: fv.role || 'user',
    };
  }

  private getByPath(obj: any, path: string) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  private computeMissingFields(payload: any): string[] {
    const isSaudi =
      (payload.country || '').toLowerCase() === 'sa' ||
      (payload.country || '').toLowerCase() === 'saudi arabia';

    return this.requiredFields.filter((f) => {
      if (f === 'password' && isSaudi) return false;
      const val = this.getByPath(payload, f);
      return val === undefined || val === null || String(val).trim() === '';
    });
  }

  private refreshDebug() {
    this.debugPayload = this.buildPayload();
    this.missingFields = this.computeMissingFields(this.debugPayload);

    console.log('🧩 Form value:', this.customerForm.value);
    console.log('📦 Payload preview (JSON):', JSON.stringify(this.debugPayload, null, 2));
    console.log('🛑 Missing (client-check):', this.missingFields);
  }

//   onSubmit() {
//   this.refreshDebug();

//   if (this.missingFields.length) {
//     alert(`Please fill required fields: ${this.missingFields.join(', ')}`);
//     return;
//   }

//   const fv = this.customerForm.value;
//   const formData = new FormData();

//   formData.append('nameAr', fv.nameAr);
//   formData.append('nameEn', fv.nameEn);
//   formData.append('nationalId', fv.nationalId);
//   formData.append('country', fv.country);
//   formData.append('email', fv.email);
//   formData.append('phone', fv.phone);
//   formData.append('password', fv.password);
//   formData.append('nafathSub', fv.nafathSub);
//   formData.append('iban', fv.iban);
//   formData.append('status', fv.status);
//   formData.append('role', fv.role);

//   if (this.selectedFiles['nationalIdImage']) {
//     formData.append('nationalIdImage', this.selectedFiles['nationalIdImage']);
//   }
//   if (this.selectedFiles['ibanImage']) {
//     formData.append('ibanImage', this.selectedFiles['ibanImage']);
//   }

//   this.customersService.addCustomer(formData).subscribe({
//     next: (res) => {
//       console.log('✅ Created:', res);
//       alert('User Created Successfully!');
//       this.customerForm.reset();
//       this.refreshDebug();
//     },
//     error: (err) => {
//       console.error('❌ Backend error:', err);
//       const msg = err?.error?.message || 'Failed to create user';
//       alert(msg);
//     },
//   });
// }
onSubmit() {
  this.refreshDebug();

  if (this.missingFields.length) {
    alert(`Please fill required fields: ${this.missingFields.join(', ')}`);
    return;
  }

  const payload = this.buildPayload();

  this.customersService.addCustomer(payload).subscribe({
    next: (res) => {
      console.log('✅ Created:', res);
      alert('User Created Successfully!');
      this.customerForm.reset();
      this.refreshDebug();
    },
    error: (err) => {
      console.error('❌ Backend error:', err);
      const msg = err?.error?.message || 'Failed to create user';
      alert(msg);
    },
  });
}

}