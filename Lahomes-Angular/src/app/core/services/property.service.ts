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
      Authorization: token || '' // 🟢 بدون Bearer
    });
  }

  addProperty(formData: FormData): Observable<any> {
    if (!this.authService.session) {
      return throwError(() => new Error('User is not authenticated!'));
    }

    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.headers
    });
  }
}
