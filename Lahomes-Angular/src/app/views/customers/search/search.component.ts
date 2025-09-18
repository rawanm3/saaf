import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData, type CustomerType } from '@views/customers/data'

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  query = ''
  customers: CustomerType[] = customerData
  filteredNames: string[] = this.customers.map((c) => c.name)

  constructor(private router: Router) {}

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.query = value
    const lower = value.toLowerCase()
    this.filteredNames = this.customers
      .filter((c) => c.name.toLowerCase().includes(lower))
      .map((c) => c.name)
  }

  tryNavigateSelected() {
    const selected = this.customers.find(
      (c) => c.name.toLowerCase() === this.query.trim().toLowerCase()
    )
    if (selected) {
      this.router.navigate(['/customers/details', selected.name])
    }
  }
}


