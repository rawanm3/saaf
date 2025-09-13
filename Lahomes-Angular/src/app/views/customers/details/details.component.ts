import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil, tap, catchError } from 'rxjs';
import { CustomerService } from '@core/services/customer.service';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { PageTitleComponent } from "@component/page-title.component";
import { TransactionHistoryComponent } from "./components/transaction-history/transaction-history.component";
import { OwnPropertyComponent } from "./components/own-property/own-property.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";
import { WeeklyInquiryComponent } from "./components/weekly-inquiry/weekly-inquiry.component";
import { InterestedPropertyComponent } from "./components/interested-property/interested-property.component";
import { PropertyCardComponent } from "./components/property-card/property-card.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CustomerInfoComponent,

  ],
  templateUrl: './details.component.html',
  styles: ``,
})
export class DetailsComponent implements OnInit, OnDestroy {
  customer: any;
  editMode = false;
  customerForm!: FormGroup;

  searchControl = new FormControl('');
  filteredCustomers: any[] = [];
  searching = false;

  loading = false;
  saving = false;
  error: string | null = null;
  saveError: string | null = null;

  roleOptions: string[] = ['user', 'admin', 'agent', 'moderator'];
  statusOptions: string[] = ['pending', 'active', 'suspended', 'confirmed'];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) this.fetchById(id);
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((q) => {
        const query = (q || '').toString().trim();
        if (!query) { this.searching = false; return of([]); }
        return this.customerService.searchUsers(query).pipe(
          catchError(() => of([])),
          tap(() => (this.searching = false))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((users) => (this.filteredCustomers = users || []));
  }

  fetchById(id: string) {
    this.loading = true;
    this.error = null;
    this.customerService.getCustomerById(id).subscribe({
      next: (u) => {
        this.customer = u;
        this.initForm();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load customer.';
        this.loading = false;
      }
    });
  }

  initForm() {
    const name = typeof this.customer?.name === 'string'
      ? this.customer.name
      : (this.customer?.name?.en || '');

    this.customerForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(2)]],
      email: [this.customer?.email || '', [Validators.required, Validators.email]],
      phone: [this.customer?.phone || ''],
      country: [this.customer?.country || '', Validators.required],
      status: [this.customer?.status || '', Validators.required],
      role: [this.customer?.role || '', Validators.required],
    });
  }

  enableEdit() { this.editMode = true; }

  saveChanges() {
    const id = this.customer?._id || this.customer?.id;
    if (!id || !this.customerForm.valid) return;
    this.saving = true;
    this.saveError = null;

    const payload = { ...this.customerForm.value };

    this.customerService.updateCustomer(id, payload).subscribe({
      next: (res) => {
        this.customer = res?.user || res || payload;

        const current = this.customerService.getCurrentCustomers();
        const updated = current.map(c =>
          (c._id === id || c.id === id) ? { ...c, ...this.customer } : c
        );
        (this.customerService as any)['customersSource'].next(updated);

        this.editMode = false;
        this.saving = false;
      },
      error: () => {
        this.saveError = 'Failed to save changes.';
        this.saving = false;
      }
    });
  }

  selectSuggestion(u: any) {
    const id = u?._id || u?.id;
    if (!id) return;
    this.router.navigate(['/customers/details', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  deleteCustomer() {
  if (!this.customer?._id && !this.customer?.id) return;

  if (confirm(`Are you sure you want to delete ${this.customer?.name}?`)) {
    const id = this.customer._id || this.customer.id;

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        console.log('Customer deleted successfully');
        this.router.navigate(['/customers/list']); // 👈 يرجع للليست
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
      }
    });
  }
}

}