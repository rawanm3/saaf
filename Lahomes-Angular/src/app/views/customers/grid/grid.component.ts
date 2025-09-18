import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms' 
import { currency } from '@common/constants'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [PageTitleComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './grid.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GridComponent {
  customers = customerData
  currency = currency

  searchText: string = ''
  filteredCustomers = [...this.customers]

  private searchTimeout: any

  filterCustomers() {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()
      this.filteredCustomers = this.customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          c.address.toLowerCase().includes(search)
      )
    }, 300)
  }
}

