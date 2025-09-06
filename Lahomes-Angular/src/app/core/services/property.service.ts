import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

}
