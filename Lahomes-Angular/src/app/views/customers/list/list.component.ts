import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal, NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgbPaginationModule, NgbDropdownModule, NgbModalModule],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {
  customerList = customerData
// -----------------------------bassant-------------------------------------------------

   selectedCustomer: any | null = null;

  constructor(private modalService: NgbModal) {}

  openCustomerModal(tpl: any, customer: any) {
    this.selectedCustomer = customer;
    this.modalService.open(tpl, { size: 'lg', centered: true });
  }
}
