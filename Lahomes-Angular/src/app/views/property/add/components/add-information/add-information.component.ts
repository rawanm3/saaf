import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      // === بيانات أساسية ===
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['residential', Validators.required],
      square: [null],
      numberOfRooms: [null],
      numberOfBathrooms: [null],
      propertyNumber: [''],

      // === القيم المالية ===
      totalValue: [null, Validators.required],
      minInvestment: [500],
      expectedNetYield: [null, Validators.required],
      expectedAnnualReturn: [null, Validators.required],
      holdingPeriodMonths: [60],

      // === الأسهم ===
      sharePrice: [1],
      totalShares: [null, Validators.required],
      remainingShares: [null],
      investedAmount: [0],
      investorCount: [0],

      // === الإيجارات ===
      isRented: [false],
      currentRent: [0],
      rentDistributionFrequency: ['quarterly'],
      lastDividendDate: [null],

      // === التقييم ===
      previousValue: [null, Validators.required],
      newValue: [null, Validators.required],
      changePercent: [null],
      valuationDate: [new Date()],
      source: [''],

      // === التمويل ===
      fundingDeadline: [null],

      // === الرسوم ===
      acquisitionFeePercent: [1.5],
      annualAdminFeePercent: [0.5],
      exitFeePercent: [2.5],
      performanceFeePercent: [7.0],

      // === بيانات إضافية ===
      description: [''],
      images: this.fb.array([]),
      features: this.fb.array([]),
      isShariahCompliant: [true],

      // === Meta + ترجمات ===
      metaTags: this.fb.group({
        title: [''],
        description: [''],
        keywords: this.fb.array([])
      }),
      translations: this.fb.group({
        name: this.fb.group({ en: [''], ar: [''] }),
        description: this.fb.group({ en: [''], ar: [''] })
      }),

      // === الموقع ===
      coordinates: this.fb.group({
        latitude: [null],
        longitude: [null]
      }),
      countryCode: ['SA'],

      // === المستأجر ===
      tenantInfo: this.fb.group({
        name: [''],
        leaseStartDate: [null],
        leaseEndDate: [null],
        monthlyRent: [null]
      }),

      // === متابعة ===
      viewCount: [0],
      status: ['available']
    });
  }

  // Getters
  get features() {
    return this.infoForm.get('features') as FormArray;
  }
  get keywords() {
    return (this.infoForm.get('metaTags') as FormGroup).get('keywords') as FormArray;
  }
  get images() {
    return this.infoForm.get('images') as FormArray;
  }

  // === Add Methods ===
  addFeature() {
    this.features.push(this.fb.control(''));
  }
  addKeyword() {
    this.keywords.push(this.fb.control(''));
  }

  // === رفع الصور ===
  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.images.push(this.fb.control(files[i]));
    }
  }
  removeImage(index: number) {
    this.images.removeAt(index);
  }

  // === Submit ===
  onSubmit() {
    if (this.infoForm.invalid) {
      console.log("❌ الفورم مش مظبوط");
      return;
    }

    const formData = new FormData();

    // 🟢 البيانات الأساسية
    Object.keys(this.infoForm.value).forEach((key) => {
      if (key !== 'images' && key !== 'features' && key !== 'metaTags' && key !== 'translations') {
        formData.append(key, this.infoForm.value[key]);
      }
    });

    // 🟢 الصور
    this.images.controls.forEach((control) => {
      formData.append("images", control.value); // مهم: images
    });

    // 🟢 features
    this.features.controls.forEach((control, index) => {
      formData.append(`features[${index}]`, control.value);
    });

    // 🟢 metaTags
    const metaTags = this.infoForm.get('metaTags')?.value;
    if (metaTags) {
      formData.append('metaTags[title]', metaTags.title);
      formData.append('metaTags[description]', metaTags.description);
      metaTags.keywords.forEach((kw: string, index: number) => {
        formData.append(`metaTags[keywords][${index}]`, kw);
      });
    }

    // 🟢 translations
    const translations = this.infoForm.get('translations')?.value;
    if (translations) {
      formData.append('translations[name][en]', translations.name.en);
      formData.append('translations[name][ar]', translations.name.ar);
      formData.append('translations[description][en]', translations.description.en);
      formData.append('translations[description][ar]', translations.description.ar);
    }

    console.log("✅ Data ready to send:", formData);

    // إرسال للباك
    this.propertyService.addProperty(formData).subscribe({
      next: (res) => {
        console.log("تم إضافة العقار ✔", res);
      },
      error: (err) => {
        console.error("❌ Error:", err);
      },
    });
  }
}
