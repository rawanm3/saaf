import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:3000';  

  private customersSource = new BehaviorSubject<any[]>([]);
  public customers$ = this.customersSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

 
  private normalizeName(user: any) {
    if (!user) return user;
    return {
      ...user,
      name: typeof user.name === 'string' ? user.name : (user.name?.en || user.name?.ar || '')
    };
  }

  getAllCustomers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/users`, {
      headers: this.headers,
    }).pipe(
      tap((response) => {
        let customers: any[] = [];
        if (response?.users) {
          customers = response.users;
        } else if (Array.isArray(response)) {
          customers = response;
        } else if (response) {
          customers = [response];
        }

        
        customers = customers.map((c: any) => this.normalizeName(c));

        this.customersSource.next(customers);
      })
    );
  }

  getCustomerById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/user/user/${id}`, { headers: this.headers })
      .pipe(
        tap((res) => console.log('API Response for getCustomerById:', res)),
        map((res: any) => {
          const u = res && typeof res === 'object' && 'user' in res ? res.user : res;
          return this.normalizeName(u);
        })
      );
  }

  updateCustomer(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/update-user/${id}`, payload, {
      headers: this.headers,
    }).pipe(
      tap((response) => {
        console.log('Update response:', response);
        const currentCustomers = this.customersSource.value;
        const updatedCustomers = currentCustomers.map((customer: any) => {
          if (customer._id === id || customer.id === id) {
            const updatedData = this.normalizeName(response?.user || response || payload);

            return {
              ...customer,
              ...updatedData,
              _id: customer._id || customer.id
            };
          }
          return customer;
        });
        this.customersSource.next(updatedCustomers);
        console.log('Customer updated in service:', updatedCustomers);
      })
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user/delete-user/${id}`, {
      headers: this.headers,
    }).pipe(
      tap(() => {
        const currentCustomers = this.customersSource.value;
        const filteredCustomers = currentCustomers.filter((customer: any) =>
          customer._id !== id && customer.id !== id
        );
        this.customersSource.next(filteredCustomers);
        console.log('Customer deleted from service');
      })
    );
  }

  updateUserStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/user-status/${id}`, { status }, {
      headers: this.headers,
    }).pipe(
      tap((response) => {
        const updated = this.normalizeName(response?.user || {});
        const currentCustomers = this.customersSource.value;
        const updatedCustomers = currentCustomers.map((customer: any) => {
          if (customer._id === id || customer.id === id) {
            return { ...customer, status: updated.status ?? status };
          }
          return customer;
        });
        this.customersSource.next(updatedCustomers);
        console.log('User status updated in service');
      })
    );
  }

  searchUsers(query: string): Observable<any[]> {
    const q = encodeURIComponent(query);
    return this.http.get<any[]>(`${this.baseUrl}/user/users?search=${q}`, { headers: this.headers }).pipe(
      map((res: any) => {
        const users = Array.isArray(res) ? res : (res?.users ?? []);
        return users.map((u: any) => this.normalizeName(u));
      })
    );
  }

  refreshCustomers(): void {
    this.getAllCustomers().subscribe();
  }

  getCurrentCustomers(): any[] {
    return this.customersSource.value;
  }
}