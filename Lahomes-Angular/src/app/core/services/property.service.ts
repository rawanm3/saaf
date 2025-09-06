import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from './auth.service'
@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private baseUrl = 'http://localhost:3000/realestate' // 👈 الأساس

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getAuthHeaders() {
    const token = this.authService.session
    return { Authorization: token || '' }
  }

  // جلب كل العقارات
  getAllRealEstates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all-properties`, {
      headers: this.getAuthHeaders(),
    })
  }

  // جلب عقار واحد
  getOneRealEstate(id: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:3000/realestate/property/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    )
  }

  // البحث عن عقارات بالاسم أو المكان
  searchProperties(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search`, {
      headers: this.getAuthHeaders(),
      params: { q: query },
    })
  }

  // إضافة عقار جديد
  createRealEstate(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-property`, data, {
      headers: this.getAuthHeaders(),
    })
  }

  // تعديل عقار
  updateRealEstate(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update-property/${id}`, data, {
      headers: this.getAuthHeaders(),
    })
  }

  // حذف عقار
  deleteRealEstate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete-property/${id}`, {
      headers: this.getAuthHeaders(),
    })
  }

  // تحديث الحالة
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-status/${id}`,
      { status },
      { headers: this.getAuthHeaders() }
    )
  }

  // فلترة بالسعر
  filterByPrice(minPrice?: number, maxPrice?: number): Observable<any> {
    const params: any = {}
    if (minPrice !== undefined) params.minPrice = minPrice
    if (maxPrice !== undefined) params.maxPrice = maxPrice

    return this.http.get<any>(`${this.baseUrl}/filter`, {
      headers: this.getAuthHeaders(),
      params,
    })
  }
}
