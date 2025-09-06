import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { propertyData } from '../../../data'
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'
import { PropertyService } from '@core/services/property.service'

@Component({
  selector: 'property-data',
  standalone: true,
  imports: [ CommonModule, NgbPaginationModule],
  templateUrl: './property-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDataComponent implements OnInit {
    propertyList: any[] = [];
  currency = '$'; // تقدر تغيريها حسب العملة

  constructor(private propertyService: PropertyService) {}
ngOnInit(): void {
  this.loadProperties();

  // 👂 استمع للتحديثات (من Apply Filters أو غيره)
  this.propertyService.properties$.subscribe((data) => {
    if (data.length) {
      this.propertyList = data;
    }
  });
}

loadProperties() {
  this.propertyService.getAllRealEstates().subscribe({
    next: (res) => {
      this.propertyList = res.properties ?? res;
      this.propertyService.setProperties(this.propertyList); // 👈 تحميل أولي
    },
    error: (err) => console.error('Error fetching properties:', err),
  });
}

}
