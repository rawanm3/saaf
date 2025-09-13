import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { AuthenticationService } from './auth.service';
import { CustomerType } from '@views/customers/data';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl = 'http://localhost:3000/user';
  private customersSource = new BehaviorSubject<CustomerType[]>([]);
  customers$ = this.customersSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  getAllCustomers(): Observable<CustomerType[]> {
    return this.http
      .get<any>(`${this.baseUrl}/users`, { headers: this.headers })
      .pipe(map((res) => this.normalizeCustomersResponse(res)));
  }

  getOneCustomer(id: string): Observable<CustomerType> {
    return this.http.get<any>(`${this.baseUrl}/users/${id}`, { headers: this.headers }).pipe(
      map((res) => this.normalizeSingleCustomerResponse(res))
    );
  }

  updateCustomer(id: string, data: Partial<CustomerType>): Observable<CustomerType> {
    return this.http.put<CustomerType>(
      `${this.baseUrl}/update-user/${id}`,
      data,
      { headers: this.headers }
    );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/delete-user/${id}`,
      { headers: this.headers }
    );
  }

  updateStatus(id: string, status: string): Observable<CustomerType> {
    return this.http.put<CustomerType>(
      `${this.baseUrl}/update-status/${id}`,
      { status },
      { headers: this.headers }
    );
  }

  searchCustomers(query: string): Observable<CustomerType[]> {
    return this.http
      .get<any>(`${this.baseUrl}/search?q=${query}`, { headers: this.headers })
      .pipe(map((res) => this.normalizeCustomersResponse(res)));
  }

  getFilteredCustomers(filters: any): Observable<CustomerType[]> {
    let params: any = {};
    if (filters.q) params.q = filters.q;
    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;

    return this.http
      .get<any>(`${this.baseUrl}/filter`, { headers: this.headers, params })
      .pipe(map((res) => this.normalizeCustomersResponse(res)));
  }

  setCustomers(customers: CustomerType[]) {
    this.customersSource.next(customers);
  }

  // --- Helpers to normalize various backend shapes ---
  private normalizeCustomersResponse(res: any): CustomerType[] {
    // Common envelopes: { customers: [] }, { users: [] }, { data: [] }, []
    const list: any[] = Array.isArray(res)
      ? res
      : res?.customers ?? res?.users ?? res?.data ?? res?.result ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((it) => this.toCustomer(it)).filter(Boolean) as CustomerType[];
  }

  private normalizeSingleCustomerResponse(res: any): CustomerType {
    // Common envelopes: { customer: {} }, { user: {} }, { data: {} }, {}
    const obj = res?.customer ?? res?.user ?? res?.data ?? res;
    return this.toCustomer(obj);
  }

  private toCustomer(obj: any): CustomerType {
    if (!obj) {
      return {
        id: '',
        name: '',
        image: '',
        email: '',
        phone: '',
        type: '',
        address: '',
        customerStatus: '',
        date: '',
        status: '',
        propertyView: 0,
        propertyOwn: 0,
        invest: '',
      };
    }
    const id = obj.id ?? obj._id ?? '';
    return {
      id: String(id),
      name: obj.name ?? obj.fullName ?? obj.username ?? '',
      image: obj.image ?? obj.avatar ?? '',
      email: obj.email ?? '',
      phone: obj.phone ?? obj.mobile ?? '',
      type: obj.type ?? obj.customerType ?? '',
      address: obj.address ?? '',
      customerStatus: obj.customerStatus ?? obj.statusText ?? obj.status ?? '',
      date: obj.date ?? obj.createdAt ?? obj.updatedAt ?? '',
      status: obj.status ?? '',
      propertyView: obj.propertyView ?? 0,
      propertyOwn: obj.propertyOwn ?? 0,
      invest: obj.invest ?? obj.investment ?? '',
    } as CustomerType;
  }
}