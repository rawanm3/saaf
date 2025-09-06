import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { CustomersService } from '@core/services/customers.service';

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
  createdCustomer: any = null;

  customerData: any = {
    // Customer Information
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
    status: '',
    
    // Property Information
    location: '',
    type: 'residential',
    totalValue: '',
    expectedNetYield: '',
    expectedAnnualReturn: '',
    totalShares: '',
    description: ''
  };

  constructor(private customerService: CustomersService) {}

  // استقبال الصور من FileUploader
  onImagesSelected(files: File[]) {
    this.selectedImages = files;
  }

  // استقبال البيانات من CustomerInfoComponent
  onCustomerInfoChange(updatedData: any) {
    this.customerData = { ...updatedData };
  }

  // إنشاء العقار
  createCustomer() {    
    const formData = new FormData();

    Object.keys(this.customerData).forEach(key => {
      if (this.customerData[key] !== '') {
        formData.append(key, this.customerData[key]);
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

    this.customerService.addCustomer(formData).subscribe({
      next: res => {
        console.log(res);
        this.createdCustomer = res;
        alert('✅ تم إضافة العقار بنجاح');  
      },
      error: err => {
        console.error(err);
        alert(err.message || '❌ حصل خطأ في إضافة العقار');
      }
    });
  }
}

