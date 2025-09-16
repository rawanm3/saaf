import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { AddInformationComponent } from './components/add-information/add-information.component';
import { PropertyService } from '@core/services/property.service';
import { FormGroup } from '@angular/forms';

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
  createProperty(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      alert('❌ من فضلك املأ البيانات المطلوبة');
      return;
    }
  
    const propertyData = form.value;
    this.propertyService.addProperty(propertyData).subscribe({
      next: (res) => {
        this.createdProperty = res.data || res;
        alert('✅ تم إضافة العقار بنجاح');
        form.reset(); // ✨ تصفير الفورم بعد الإضافة
      },
      error: (err) => {
        console.error(err);
        alert(err.message || '❌ حصل خطأ في إضافة العقار');
      },
    });
  }

}
