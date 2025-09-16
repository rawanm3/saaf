import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private apiUrl = 'http://localhost:3000/realestate/add-property';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers(): HttpHeaders {
    const token = this.authService.session;
    return new HttpHeaders({
      Authorization: token || ''
    });
  }

  addProperty(propertyData: any): Observable<any> {
    if (!this.authService.session) {
      return throwError(() => new Error('User is not authenticated!'));
    }

    const formData = new FormData();

    // 🔹 Append الحقول العادية
    for (const key in propertyData) {
      if (propertyData.hasOwnProperty(key)) {
        const value = propertyData[key];

        // ✅ لو Arrays (features, keywords, metaTags, translations...)
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }

        // ✅ لو Objects (coordinates, tenantInfo, metaTags, translations)
        else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        }

        // ✅ لو قيم بسيطة (string | number | boolean)
        else if (!(value instanceof File)) {
          formData.append(key, value);
        }
      }
    }

    // 🔹 Append الصور
    if (propertyData.images && propertyData.images.length > 0) {
      propertyData.images.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    // 🔹 Append الوثائق القانونية
    // if (propertyData.legalDocuments && propertyData.legalDocuments.length > 0) {
    //   propertyData.legalDocuments.forEach((file: File) => {
    //     formData.append('legalDocuments', file);
    //   });
    // }

    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.headers
    });
  }
}
