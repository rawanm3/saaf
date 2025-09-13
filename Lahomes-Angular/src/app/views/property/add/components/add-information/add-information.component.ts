import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '@core/services/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-information',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './add-information.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddInformationComponent implements OnInit {
  @Output() infoChange = new EventEmitter<any>();
  infoForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['residential', Validators.required],
      totalValue: [null, Validators.required],
      totalShares: [null, Validators.required],
      expectedNetYield: [null, Validators.required],
      expectedAnnualReturn: [null, Validators.required],
      description: [''],
      features: this.fb.array([]),
      metaTags: this.fb.group({
        title: [''],
        description: [''],
        keywords: this.fb.array([])
      })
    });

    // Emit changes to parent
    this.infoForm.valueChanges.subscribe(val => this.infoChange.emit(val));
  }

  // === Features ===
  get features(): FormArray {
    return this.infoForm.get('features') as FormArray;
  }
  addFeature(): void {
    this.features.push(this.fb.control(''));
  }

  // === Keywords ===
  get keywords(): FormArray {
    return (this.infoForm.get('metaTags')?.get('keywords') as FormArray);
  }
  addKeyword(): void {
    this.keywords.push(this.fb.control(''));
  }

  // === Submit ===
  submitForm(): void {
    if (this.infoForm.invalid) {
      console.log('Form Invalid ❌');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.infoForm.value.name,
      location: this.infoForm.value.location,
      type: this.infoForm.value.type,
      totalValue: Number(this.infoForm.value.totalValue),
      totalShares: Number(this.infoForm.value.totalShares),
      expectedNetYield: Number(this.infoForm.value.expectedNetYield),
      expectedAnnualReturn: Number(this.infoForm.value.expectedAnnualReturn),
      description: this.infoForm.value.description,
      features: this.infoForm.value.features || [],
      metaTags: {
        title: this.infoForm.value.metaTags.title,
        description: this.infoForm.value.metaTags.description,
        keywords: this.infoForm.value.metaTags.keywords || []
      }
    };

    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('location', payload.location);
    formData.append('type', payload.type);
    formData.append('totalValue', payload.totalValue.toString());
    formData.append('totalShares', payload.totalShares.toString());
    formData.append('expectedNetYield', payload.expectedNetYield.toString());
    formData.append('expectedAnnualReturn', payload.expectedAnnualReturn.toString());
    formData.append('description', payload.description);

    payload.features.forEach((feature: string, index: number) => {
      formData.append(`features[${index}]`, feature);
    });

    formData.append('metaTags[title]', payload.metaTags.title);
    formData.append('metaTags[description]', payload.metaTags.description);
    payload.metaTags.keywords.forEach((keyword: string, index: number) => {
      formData.append(`metaTags[keywords][${index}]`, keyword);
    });

    this.propertyService.addProperty(formData).subscribe({
      next: (res) => {
        console.log('✅ Property added successfully:', res);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('❌ Error adding property:', err);
        this.isSubmitting = false;
      }
    });
  }

  // === Reset Form بعد إضافة العقار ===
  resetForm(): void {
    this.infoForm.reset({
      name: '',
      location: '',
      type: 'residential',
      totalValue: null,
      totalShares: null,
      expectedNetYield: null,
      expectedAnnualReturn: null,
      description: '',
      features: [],
      metaTags: {
        title: '',
        description: '',
        keywords: []
      }
    });
  }
}