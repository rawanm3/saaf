import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '@component/page-title.component';
import { CustomerService } from '@core/services/customer.service';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  query = '';
  filteredCustomers: any[] = [];

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query = value.trim();

    if (this.query.length > 1) {
      
      this.customerService.searchUsers(this.query).subscribe({
        next: (res) => {
          this.filteredCustomers = res || [];
        },
        error: (err) => {
          console.error('Search error:', err);
          this.filteredCustomers = [];
        }
      });
    } else {
      this.filteredCustomers = [];
    }
  }

  tryNavigateSelected() {
    const selected = this.filteredCustomers.find(
      (c) =>
        (typeof c.name === 'string'
          ? c.name.toLowerCase()
          : (c.name?.en || '').toLowerCase()) === this.query.toLowerCase()
    );
    if (selected) {
      this.router.navigate(['/customers/details', selected._id || selected.id]);
    }
  }
}