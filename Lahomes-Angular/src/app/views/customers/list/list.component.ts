// list.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomersService } from '@core/services/customers.services';

import { PageTitleComponent } from '@component/page-title.component';
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { customerData, CustomerStatType, customerStatData, CustomerType } from '../data';

@Component({
  selector: 'app-customer-list',
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
  customerList: CustomerType[] = [];
  filteredCustomers: CustomerType[] = [];
  stateList: CustomerStatType[] = customerStatData;
  searchText: string = '';

  selectedCustomer: CustomerType | null = null;
  editCustomer: Partial<CustomerType> | null = null;

  // Pagination
  page: number = 1;
  pageSize: number = 10;

  // Modal mode
  isEditMode: boolean = false;

  private searchTimeout: any;

  constructor(
    private modalService: NgbModal,
    private customerService: CustomersService
  ) {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customerList = customers;
        this.filteredCustomers = [...this.customerList];
        this.customerService.setCustomers(customers);
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        // Fallback to local data if API fails
        this.customerList = customerData;
        this.filteredCustomers = [...this.customerList];
      },
    });
  }

  filterCustomers() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim();
      if (search) {
        this.customerService.searchCustomers(search).subscribe({
          next: (results) => {
            this.filteredCustomers = results ?? [];
          },
          error: () => {
            // Fallback local filter
            this.filteredCustomers = this.customerList.filter(
              (c) =>
                c.name?.toLowerCase().includes(search) ||
                c.email?.toLowerCase().includes(search) ||
                c.phone?.toLowerCase().includes(search) ||
                c.type?.toLowerCase().includes(search) ||
                c.address?.toLowerCase().includes(search) ||
                c.customerStatus?.toLowerCase().includes(search)
            );
          },
        });
      } else {
        this.filteredCustomers = [...this.customerList];
      }
    }, 300);
  }

  openCustomerModal(tpl: any, customer: CustomerType) {
    this.customerService.getOneCustomer(customer.id).subscribe({
      next: (data) => {
        this.selectedCustomer = data;
        this.editCustomer = { ...data };
        this.isEditMode = false;
        this.modalService.open(tpl, { size: 'lg', centered: true });
      },
      error: (err) => {
        console.error('Error fetching customer:', err);
        this.selectedCustomer = customer; // Fallback to current row data
        this.editCustomer = { ...customer };
        this.isEditMode = false;
        this.modalService.open(tpl, { size: 'lg', centered: true });
      },
    });
  }

  enterEditMode() {
    if (this.selectedCustomer) {
      this.editCustomer = { ...this.selectedCustomer };
      this.isEditMode = true;
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    if (this.selectedCustomer) {
      this.editCustomer = { ...this.selectedCustomer };
    } else {
      this.editCustomer = null;
    }
  }

  isFormValid(): boolean {
    return !!(
      this.editCustomer &&
      this.editCustomer.name &&
      this.editCustomer.email &&
      this.editCustomer.type &&
      this.editCustomer.address &&
      this.editCustomer.customerStatus
    );
  }

  saveCustomerChanges() {
    if (this.editCustomer && this.editCustomer.id) {
      this.customerService.updateCustomer(this.editCustomer.id, this.editCustomer).subscribe({
        next: (updatedCustomer) => {
          this.customerList = this.customerList.map((c) =>
            c.id === updatedCustomer.id ? updatedCustomer : c
          );
          this.filteredCustomers = this.filteredCustomers.map((c) =>
            c.id === updatedCustomer.id ? updatedCustomer : c
          );
          this.customerService.setCustomers(this.customerList);
          this.modalService.dismissAll();
          this.selectedCustomer = null;
          this.editCustomer = null;
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Error updating customer:', err);
        },
      });
    }
  }

  deleteCustomer(id?: string) {
    if (!id) return;
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.customerList = this.customerList.filter((c) => c.id !== id);
        this.filteredCustomers = this.filteredCustomers.filter((c) => c.id !== id);
        this.customerService.setCustomers(this.customerList);

        if (this.selectedCustomer?.id === id) {
          this.modalService.dismissAll();
          this.selectedCustomer = null;
          this.editCustomer = null;
          this.isEditMode = false;
        }
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
      },
    });
  }
}