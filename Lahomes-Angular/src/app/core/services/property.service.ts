import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
 private baseUrl = 'http://localhost:3000/realestate';
  private propertiesSource = new BehaviorSubject<any[]>([]);
  properties$ = this.propertiesSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private get headers() {
    return { Authorization: this.authService.session || '' };
  }

  getAllRealEstates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all-properties`, {
      headers: this.headers,
    });
  }
  addProperty(formData: FormData): Observable<any> {
    if (!this.authService.session) {
      return throwError(() => new Error('User is not authenticated!'));
    }

    return this.http.post<any>(`${this.baseUrl}/add-property`, formData, {
      headers: this.headers
    });
  }
   getAllProperties(): Observable<any[]> {
    return this.http
      .get<any>(`${this.baseUrl}/all-properties`, { headers: this.headers })
      .pipe(map((res) => res?.properties ?? []));
  }

  searchProperties(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search?q=${query}`, {
      headers: this.headers,
    });
  }

  getFilteredProperties(filters: any): Observable<any> {
    let params: any = {};
    if (filters.q) params.q = filters.q;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.type) params.type = filters.type;
    if (filters.features?.length > 0) {
      params.features = filters.features.join(',');
    }

    return this.http.get<any>(`${this.baseUrl}/filter`, {
      headers: this.headers,
      params,
    });
  }

  setProperties(properties: any[]) {
    this.propertiesSource.next(properties);
  }
    getOneRealEstate(id: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:3000/realestate/property/${id}`,
      {
        headers: this.headers,
      }
    )
  }
 // تعديل عقار
  updateRealEstate(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update-property/${id}`, data, {
      headers: this.headers,
    })
  }

  // حذف عقار
  deleteRealEstate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete-property/${id}`, {
      headers:  this.headers,
    })
  }

  // تحديث الحالة
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-status/${id}`,
      { status },
      { headers:  this.headers }
    )
  }
}
