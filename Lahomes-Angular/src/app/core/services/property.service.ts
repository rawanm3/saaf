import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class PropertyService {
  private apiUrl = 'http://localhost:3000/realestate/add-property';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  addProperty(formData: FormData): Observable<any> {
    if (!this.headers.Authorization) {
      return throwError(() => new Error('User is not authenticated!'));
    }
    return this.http.post<any>(this.apiUrl, formData, { headers: this.headers });
  }
}
