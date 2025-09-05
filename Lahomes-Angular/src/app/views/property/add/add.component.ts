import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { AddInformationComponent } from './components/add-information/add-information.component';
// import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import { PropertyService } from '@core/services/property.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe, // ✅ عشان ال currency pipe يشتغل
    PageTitleComponent,
    AddCardComponent,
    AddInformationComponent,
    FileUploaderComponent
  ],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {
  selectedImages: File[] = [];
  createdProperty: any = null;

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
  onInfoChange(updatedData: any) {
    this.propertyData = { ...this.propertyData, ...updatedData };
  }
  
  onImagesSelected(files: File[]) {
    this.selectedImages = files;
  }

  createProperty() {
    const formData = new FormData();
  
    Object.keys(this.propertyData).forEach((key) => {
      if (this.propertyData[key] !== '') {
        formData.append(key, this.propertyData[key]);
      }
    });
  
    this.selectedImages.forEach((file) => {
      formData.append('images', file);
    });
  
    // استدعاء الدالة بوسيط واحد فقط
    this.propertyService.addProperty(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.createdProperty = res; // ⚠️ غيريها لو الـ API بيرجع object تاني
        alert('✅ تم إضافة العقار بنجاح');
      },
      error: (err) => {
        console.error(err);
        alert(err.message || '❌ حصل خطأ في إضافة العقار');
      },
    });
  }

}