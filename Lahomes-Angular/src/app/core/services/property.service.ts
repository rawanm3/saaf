import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
private apiUrl = 'http://localhost:3000/realestate/all-properties'; // غيري على حسب الـ backend


  // getAllRealEstates(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getAllRealEstates(): Observable<any> {
    const token = this.authService.session; // 👈 يجيب التوكن الصح
    const headers = { Authorization: token || '' }; // أو Authorization: `Bearer ${token}` لو عدلتي الميدل وير
    return this.http.get<any>(this.apiUrl, { headers });
  }


}
