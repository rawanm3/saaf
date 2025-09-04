import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbModalModule,
    FormsModule,
  ],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {
  customerList = customerData
  filteredCustomers = [...this.customerList]

  searchText: string = ''
  private searchTimeout: any

  selectedCustomer: any | null = null

  constructor(private modalService: NgbModal) {}

  // البحث
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
  }

  // فتح المودال
  openCustomerModal(tpl: any, customer: any) {
    this.selectedCustomer = customer
    this.modalService.open(tpl, { size: 'lg', centered: true })
  }
}
