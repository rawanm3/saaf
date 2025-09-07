import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class CustomersService {
  private apiUrl = 'http://localhost:3000/registration-international/add';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  addCustomer(customerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customerData, { headers: this.headers });
  }

  getAllCustomers(): Observable<any[]> {
    return this.http.get<any>('http://localhost:3000/registration-international/all', { headers: this.headers });
  }
}
