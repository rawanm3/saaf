import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { AddInformationComponent } from './components/add-information/add-information.component';
import { PropertyService } from '@core/services/property.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PageTitleComponent,
    AddInformationComponent
  ],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {
  createdProperty: any = null; // هنا هيتم تخزين البيانات بعد الCreate
  propertyData: any = {};

  constructor(private propertyService: PropertyService) {}

  onInfoChange(updatedData: any) {
    this.propertyData = { ...this.propertyData, ...updatedData };
  }

  createProperty() {
    const formData = new FormData();

    Object.keys(this.propertyData).forEach((key) => {
      if (this.propertyData[key] !== '' && this.propertyData[key] !== undefined) {
        const value = typeof this.propertyData[key] === 'number' 
          ? this.propertyData[key].toString() 
          : this.propertyData[key];
        formData.append(key, value);
      }
    });

    this.propertyService.addProperty(formData).subscribe({
      next: (res) => {
        this.createdProperty = res.data || res; // ✅ البيانات اللي هيظهر بها الكارد
        alert('✅ تم إضافة العقار بنجاح');

        // تصفير الفورم بعد الإضافة
        this.propertyData = {};
      },
      error: (err) => {
        console.error(err);
        alert(err.message || '❌ حصل خطأ في إضافة العقار');
      },
    });
  }
}