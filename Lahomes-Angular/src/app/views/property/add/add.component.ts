import { Component, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PageTitleComponent } from '@component/page-title.component';
import { AddInformationComponent } from './components/add-information/add-information.component';

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
  createdProperty: any = null;

  // @ViewChild(AddInformationComponent) infoComp!: AddInformationComponent;

  // 🟢 لما الزرار يتداس في الـ parent نستدعي submit بتاع child
  // triggerChildSubmit() {
  //   if (this.infoComp) {
  //     this.infoComp.onSubmit();
  //   }
  // }

  // 🟢 استقبال النتيجة من child
//   onPropertyCreated(property: any) {
//     this.createdProperty = property;
//     alert('✅ تم إضافة العقار بنجاح');
//   }
}

