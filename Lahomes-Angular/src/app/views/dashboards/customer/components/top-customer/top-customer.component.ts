import { Component } from '@angular/core'
import { TopCustomers } from '../../data'
import { CommonModule } from '@angular/common'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'top-customer',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './top-customer.component.html',
  styles: ``,
})
export class TopCustomerComponent {
  customerList = TopCustomers
}
