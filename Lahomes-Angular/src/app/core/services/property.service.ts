// property.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private apiUrl = 'http://localhost:3000/realestate/add-property';

  constructor(private http: HttpClient) {}

  // ✅ Getter للـ headers (لو عايزة بعدين تستخدمي authService هتبدلي هنا)
  private get headers() {
    const token = localStorage.getItem('token') || '';
    return { Authorization: token };
  }

  // ✅ إضافة Property جديد
  addProperty(formData: FormData): Observable<any> {
    if (!this.headers.Authorization) {
      return throwError(() => new Error('User is not authenticated!'));
    }
    return this.http.post<any>(this.apiUrl, formData, { headers: this.headers });
  }
}
