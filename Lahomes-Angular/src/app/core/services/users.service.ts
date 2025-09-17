import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

    // private apiUrl = 'http://localhost:3000/register/add'; // رابط الباك

  private apiUrl = 'http://localhost:3000/register/add';
 constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('LAhomes_AUTH_SESSION_KEY');

    if (!token) {
      console.warn('⚠ No token found in localStorage (LAhomes_AUTH_SESSION_KEY). Admin route may fail.');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: token, // 👈 التوكن فقط بدون Bearer
    });
  }

  addCustomer(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.headers, // مهم: متتحطيش Content-Type
      observe: 'response',
    }).pipe(
      tap({
        next: (res) => console.log('✅ /register/add response:', res),
        error: (err) => console.error('❌ /register/add error:', err),
      })
    );
  }
  

