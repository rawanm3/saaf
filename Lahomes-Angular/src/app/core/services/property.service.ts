// property.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map, tap } from 'rxjs'
import { AuthenticationService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = 'http://localhost:3000/realestate'

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  // نداء البحث
  searchProperties(query: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map((res) => res?.properties ?? []) // 👈 برضه properties
    )
  }

  // عرض كل العقارات
  getAllProperties(): Observable<any[]> {
    const token = this.authService.session
    return this.http
      .get<any>(`${this.apiUrl}/all-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => res?.properties ?? []) // 👈 ناخد properties بدل data
      )
  }
}
