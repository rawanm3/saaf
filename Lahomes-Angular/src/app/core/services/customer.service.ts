import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
 private baseUrl = 'http://localhost:3000/user';
  private propertiesSource = new BehaviorSubject<any[]>([]);
  properties$ = this.propertiesSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  getAllCustomers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`, {
      headers: this.headers,
    });
  }


}
