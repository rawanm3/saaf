import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '@core/services/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-information',
  standalone: true,
  imports: [SelectFormInputDirective, ReactiveFormsModule, CommonModule],
  templateUrl: './add-information.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddInformationComponent implements OnInit {
  infoForm!: FormGroup;
  submitting = false;
  createdProperty: any; // هنا هيتخزن الناتج بعد الإضافة

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['residential', Validators.required],
      square: [null],
      numberOfRooms: [null],
      numberOfBathrooms: [null],
      propertyNumber: [''],

      totalValue: [null, Validators.required],
      minInvestment: [500],
      expectedNetYield: [null],
      expectedAnnualReturn: [null],
      holdingPeriodMonths: [60],

      sharePrice: [1],
      totalShares: [null, Validators.required],
      remainingShares: [null],
      investedAmount: [0],
      investorCount: [0],

      isRented: [false],
      currentRent: [0],
      rentDistributionFrequency: ['quarterly'],
      lastDividendDate: [null],

      previousValue: [null],
      newValue: [null],
      changePercent: [null],
      valuationDate: [new Date()],
      source: [''],

      acquisitionFeePercent: [1.5],
      annualAdminFeePercent: [0.5],
      exitFeePercent: [2.5],
      performanceFeePercent: [7.0],

      description: [''],
      features: this.fb.array([]),
      images: this.fb.array([]),

      coordinates: this.fb.group({ latitude: [null], longitude: [null] }),
      countryCode: ['SA'],

      tenantInfo: this.fb.group({
        name: [''],
        leaseStartDate: [null],
        leaseEndDate: [null],
        monthlyRent: [null]
      }),

      viewCount: [0],
      status: ['available'],

      metaTags: this.fb.group({
        title: [''],
        description: [''],
        keywords: this.fb.array([])
      })
    });
  }

  get features() { return this.infoForm.get('features') as FormArray; }
  get images() { return this.infoForm.get('images') as FormArray; }
  get keywords() { return (this.infoForm.get('metaTags')?.get('keywords')) as FormArray; }

  addFeature() { this.features.push(this.fb.control('')); }
  addKeyword() { this.keywords.push(this.fb.control('')); }

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.images.push(this.fb.control(files[i]));
    }
  }

  removeImage(index: number) { this.images.removeAt(index); }

  onSubmit() {
    if (this.infoForm.invalid) return;
  
    this.submitting = true;
    const formData = new FormData();
  
    // ارسال الحقول الأساسية كـ string
    const keys = [
      'name','location','type','totalValue','totalShares','square',
      'numberOfRooms','numberOfBathrooms','propertyNumber','minInvestment',
      'expectedNetYield','expectedAnnualReturn','holdingPeriodMonths',
      'sharePrice','remainingShares','investedAmount','investorCount',
      'isRented','currentRent','rentDistributionFrequency','lastDividendDate',
      'previousValue','newValue','changePercent','valuationDate','source',
      'acquisitionFeePercent','annualAdminFeePercent','exitFeePercent','performanceFeePercent',
      'description','viewCount','status','countryCode'
    ];
  
    keys.forEach(key => {
      const value = this.infoForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString()); // مهم جداً
      }
    });
  
    // ارسال الـ nested objects كـ JSON
    formData.append('coordinates', JSON.stringify(this.infoForm.get('coordinates')?.value));
    formData.append('tenantInfo', JSON.stringify(this.infoForm.get('tenantInfo')?.value));
    formData.append('metaTags', JSON.stringify(this.infoForm.get('metaTags')?.value));
  
    // ارسال الـ arrays
    this.features.controls.forEach(ctrl => formData.append('features', ctrl.value));
    this.images.controls.forEach(ctrl => formData.append('images', ctrl.value));
  
    this.propertyService.addProperty(formData).subscribe({
      next: res => {
        this.createdProperty = res;
        this.infoForm.reset();
        this.features.clear();
        this.images.clear();
        this.keywords.clear();
        this.submitting = false;
      },
      error: err => { console.error(err); this.submitting = false; }
    });
  }
}