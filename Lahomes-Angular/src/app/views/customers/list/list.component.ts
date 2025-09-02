import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal, NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
<<<<<<< HEAD
import { CommonModule } from '@angular/common';

=======
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
>>>>>>> origin/search-input

@Component({
  selector: 'app-list',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, PageTitleComponent, NgbPaginationModule, NgbDropdownModule, NgbModalModule],
=======
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    CommonModule,
    FormsModule,
  ],
>>>>>>> origin/search-input
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {
  customerList = customerData
<<<<<<< HEAD
// -----------------------------bassant-------------------------------------------------

   selectedCustomer: any | null = null;

  constructor(private modalService: NgbModal) {}

  openCustomerModal(tpl: any, customer: any) {
    this.selectedCustomer = customer;
    this.modalService.open(tpl, { size: 'lg', centered: true });
=======
  filteredCustomers = [...this.customerList]

  searchText: string = ''
  private searchTimeout: any

  filterCustomers() {
    clearTimeout(this.searchTimeout)

    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()
      this.filteredCustomers = this.customerList.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          c.type.toLowerCase().includes(search) ||
          c.address.toLowerCase().includes(search) ||
          c.customerStatus.toLowerCase().includes(search)
      )
    }, 300)
>>>>>>> origin/search-input
  }
}
