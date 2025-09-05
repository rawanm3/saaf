import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private apiUrl = 'http://localhost:3000/register'; // رابط الباك تيم

  constructor(private http: HttpClient) { }

  // عمل Header فيه توكن الأدمن
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // التوكن المخزن للأدمن
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ✅ إضافة Customer جديد
  addCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, customerData, { headers: this.getHeaders() });
  }
}
