import { Component, EventEmitter, Output } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';

@Component({
  selector: 'customer-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './customer-info.component.html',
  styles: [``
  ],
})
export class CustomerInfoComponent {
  @Output() infoChange = new EventEmitter<any>();

  customerData: any = {
    name: '',
    email: '',
    phone: '',
    viewProperties: 0,
    ownProperties: 0,
    investProperty: 0,
    address: '',
    zipCode: '',
    city: '',
    country: '',
    facebook: '',
    instagram: '',
    twitter: '',
    status: '',
  };

  updateField(field: string, value: any) {
    this.customerData[field] = value;
    this.infoChange.emit(this.customerData);
  }
}

