import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '@core/services/property.service';

@Component({
  selector: 'add-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddCardComponent {
  propertyForm: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
      price: ['', Validators.required],
      beds: ['', Validators.required],
      baths: ['', Validators.required],
      area: ['', Validators.required],
      floors: ['', Validators.required],
    });
  }

  // رفع الصورة وعرضها preview
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.previewImage = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // إرسال الفورم للباك
  onSubmit() {
    if (this.propertyForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.propertyForm.get('title')?.value);
    formData.append('type', this.propertyForm.get('type')?.value);
    formData.append('address', this.propertyForm.get('address')?.value);
    formData.append('price', this.propertyForm.get('price')?.value);
    formData.append('beds', this.propertyForm.get('beds')?.value);
    formData.append('baths', this.propertyForm.get('baths')?.value);
    formData.append('area', this.propertyForm.get('area')?.value);
    formData.append('floors', this.propertyForm.get('floors')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    try {
      this.propertyService.addProperty(formData).subscribe({
        next: (res) => {
          console.log('Property Added ✅', res);
          alert('Property added successfully!');
          this.propertyForm.reset();
          this.previewImage = null;
        },
        error: (err) => {
          console.error('Error adding property ❌', err);
          alert('Failed to add property. Please try again.');
        }
      });
    } catch (err: any) {
      alert(err.message); // يظهر رسالة لو التوكن مش موجود
    }
  }
}
