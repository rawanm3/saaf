import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  export class PaymentService {
    private apiUrl = 'http://localhost:3000/payments';
  
    constructor(private http: HttpClient) {}
  
    // جلب كل المدفوعات من Stripe
    getAllPayments(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/AllPayments`);
    }
  
    // إحصائيات
    getStats(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/stats`);
    }
  
    // إنشاء Checkout
    createCheckoutSession(payload: { amount: number; userId: string }): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/create-checkout-session`, payload);
    }
  
    // تحويل لبنك
    payoutToBank(payload: { userId: string; amount: number }): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/payout-to-bank`, payload);
    }
  }
