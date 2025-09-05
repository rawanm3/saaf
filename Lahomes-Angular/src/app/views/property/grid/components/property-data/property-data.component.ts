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
  }

  loadProperties() {
    this.propertyService.getAllRealEstates().subscribe({
      next: (res) => {
        // لو الـ backend بيرجع { properties: [...] }
        this.propertyList = res.properties;

        // لو بيرجع Array مباشرة
        // this.propertyList = res;
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
      }
    });
  }
}
