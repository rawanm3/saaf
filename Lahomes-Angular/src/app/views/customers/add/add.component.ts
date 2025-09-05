import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { PropertyService } from '@core/services/property.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PageTitleComponent,
    FileUploaderComponent,
    CustomerInfoComponent
  ],
  templateUrl: './add.component.html',
  styles: [``],
})
export class AddComponent {
  selectedImages: File[] = [];
  createdProperty: any = null;

  customerData: any = {
    name: '',
    email: '',
    phone: '',
    viewProperties: '',
    ownProperties: '',
    investProperty: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    facebook: '',
    instagram: '',
    twitter: '',
    status: ''
  };

  propertyData: any = {
    name: '',
    location: '',
    type: 'residential',
    totalValue: '',
    expectedNetYield: '',
    expectedAnnualReturn: '',
    totalShares: '',
    description: '',
  };

  constructor(private propertyService: PropertyService) {}

  // استقبال الصور من FileUploader
  onImagesSelected(files: File[]) {
    this.selectedImages = files;
  }

  // استقبال البيانات من CustomerInfoComponent
  onCustomerInfoChange(updatedData: any) {
    this.customerData = { ...updatedData };
  }

  // إنشاء العقار
  createProperty() {
    const formData = new FormData();

    Object.keys(this.propertyData).forEach(key => {
      if (this.propertyData[key] !== '') {
        formData.append(key, this.propertyData[key]);
      }
    });

    this.selectedImages.forEach(file => {
      formData.append('images', file);
    });

    // إضافة بيانات العميل
    Object.keys(this.customerData).forEach(key => {
      if (this.customerData[key] !== '') {
        formData.append(key, this.customerData[key]);
      }
    });

    this.propertyService.addProperty(formData).subscribe({
      next: res => {
        console.log(res);
        this.createdProperty = res;
        alert('✅ تم إضافة العقار بنجاح');
      },
      error: err => {
        console.error(err);
        alert(err.message || '❌ حصل خطأ في إضافة العقار');
      }
    });
  }
}

