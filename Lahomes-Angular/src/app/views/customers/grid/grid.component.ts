import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms' 
import { currency } from '@common/constants'
import { RouterLink } from '@angular/router'
import { CustomerService } from '@core/services/customer.service'

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [PageTitleComponent, CommonModule,  FormsModule],
  templateUrl: './grid.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GridComponent implements OnInit{
   customers: any[] = []
  filteredCustomers: any[] = []
  currency = currency

  searchText: string = ''
  private searchTimeout: any

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers()
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        this.customers = res
        this.filteredCustomers = [...this.customers]
      },
      error: (err) => {
        console.error('Error fetching customers:', err)
      }
    })
  }

  // 🔎 فلترة لايف
  filterCustomers() {
    const search = this.searchText.toLowerCase().trim()
    this.filteredCustomers = this.customers.filter(
      (c) =>
        c.name?.en?.toLowerCase().includes(search) ||
        c.name?.ar?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.phone?.toLowerCase().includes(search) ||
        c.country?.toLowerCase().includes(search) ||
        c.status?.toLowerCase().includes(search)
    )
  }
}

