import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { propertyData } from '../../../data'
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'
import { PropertyService } from '@core/services/property.service'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'property-data',
  standalone: true,
  imports: [ CommonModule, NgbPaginationModule,RouterModule],
  templateUrl: './property-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDataComponent implements OnInit {
//     propertyList: any[] = [];
//   currency = '$'; // تقدر تغيريها حسب العملة
// page = 1;               // الصفحة الحالية
// pageSize = 6;           // عدد العناصر في الصفحة (مثلاً 6 كروت في الصفحة)
// collectionSize = 0;     // إجمالي العناصر
// paginatedList: any[] = [];

//   constructor(private propertyService: PropertyService) {}
// ngOnInit(): void {
//   this.loadProperties();

//   // 👂 استمع للتحديثات (من Apply Filters أو غيره)
//   this.propertyService.properties$.subscribe((data) => {
//     if (data.length) {
//       this.propertyList = data;
//     }
//   });
// }
// refreshProperties() {
//   const start = (this.page - 1) * this.pageSize;
//   const end = start + this.pageSize;
//   this.paginatedList = this.propertyList.slice(start, end);
// }

// loadProperties() {
//   this.propertyService.getAllRealEstates().subscribe({
//     next: (res) => {
//       this.propertyList = res.properties ?? res;
//       this.collectionSize = this.propertyList.length; // 👈 مهم عشان pagination
//       this.refreshProperties(); // 👈 هنا بعد ما البيانات جهزت
//       this.propertyService.setProperties(this.propertyList);
//     },
//     error: (err) => console.error('Error fetching properties:', err),
//   });
// }

  allProperties: any[] = [];       // كل العقارات (من الـ backend)
  filteredProperties: any[] = [];  // بعد الفلترة
  paginatedList: any[] = [];       // بعد الـ pagination
currency = '$';
  page = 1;
  pageSize = 6; // عدد الكروت في الصفحة
  collectionSize = 0;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadAllProperties();

    // نسمع أي تحديث من الفلتر
    this.propertyService.properties$.subscribe((data) => {
      this.filteredProperties = data;
      this.collectionSize = this.filteredProperties.length;
      this.refreshProperties();
    });
  }

  loadAllProperties() {
    this.propertyService.getAllRealEstates().subscribe({
      next: (res) => {
        this.allProperties = res.properties || res;
        this.filteredProperties = [...this.allProperties];
        this.collectionSize = this.filteredProperties.length;
        this.refreshProperties();
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
      },
    });
  }

  refreshProperties() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedList = this.filteredProperties.slice(start, end);
  }
}
