import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private apiUrl = 'http://localhost:3000/register'; // رابط الباك تيم

  constructor(private http: HttpClient) {}

  // ✅ Header فيه التوكن
  private get headers() {
    const token = localStorage.getItem('token') || '';
    return { Authorization: token };
  }

  // ✅ إضافة Customer جديد
  addCustomer(customerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customerData, { headers: this.headers });
  }
}

