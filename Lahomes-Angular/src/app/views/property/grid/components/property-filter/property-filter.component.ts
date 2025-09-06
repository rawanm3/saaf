import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'
import { PropertyService } from '@core/services/property.service';
import { NouisliderModule } from 'ng2-nouislider'

@Component({
  selector: 'property-filter',
  standalone: true,
  imports: [ NouisliderModule, FormsModule,CommonModule ],
  templateUrl: './property-filter.component.html',
  styles: ``,
})
export class PropertyFilterComponent implements OnInit{
// 🔹 متغيرات البحث والفلترة
  searchText: string = '';
  selectedLocation: string = '';
  selectedType: string = '';
  selectedFeatures: string[] = [];
  someRange: number[] = [0, 500000]; // قيم افتراضية

  // 🔹 Config للـ Slider
  rangeConfig: any = {
    behaviour: 'drag',
    connect: true,
    range: {
      min: 0,
      max: 25000000,
    },
    step: 1000,
  };

  // 🔹 القوائم (ممكن تجيبها من الـ backend أو تحطيها static)
  locations: string[] = ['Cairo', 'Alexandria', 'Giza'];
  types: string[] = ['Apartment', 'Villa', 'Studio'];
  features: string[] = ['Pool', 'Garage', 'Garden', 'Gym'];

  // 🔹 النتيجة بعد الفلترة
  filteredProperties: any[] = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    // ممكن أول ما يفتح يجيب كل العقارات
    this.loadAllProperties();
  }

  // 🏠 جلب كل العقارات
  loadAllProperties() {
    this.propertyService.getAllRealEstates().subscribe({
      next: (res) => {
        this.filteredProperties = res.properties || res;
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
      },
    });
  }

applyFilters() {
  this.propertyService.getAllRealEstates().subscribe({
    next: (res) => {
      let properties = res.properties || res;

      // فلترة بالبحث (لو عايزة تجمع بينه وبين السعر)
      if (this.searchText.trim()) {
        const q = this.searchText.toLowerCase();
        properties = properties.filter(
          (p: any) =>
            p.name.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q)
        );
      }

      // فلترة بالسعر (محليًا)
      properties = properties.filter(
        (p: any) =>
          p.totalValue >= this.someRange[0] &&
          p.totalValue <= this.someRange[1]
      );

      // فلترة بالنوع
      if (this.selectedType) {
        properties = properties.filter((p: any) => p.type === this.selectedType);
      }

      // فلترة باللوكيشن
      if (this.selectedLocation) {
        properties = properties.filter(
          (p: any) => p.location === this.selectedLocation
        );
      }

      // فلترة بالمميزات
      if (this.selectedFeatures.length > 0) {
        properties = properties.filter((p: any) =>
          this.selectedFeatures.every((f) => p.features?.includes(f))
        );
      }

      this.filteredProperties = properties;
      this.propertyService.setProperties(properties);
      console.log('Filtered (frontend) Properties:', this.filteredProperties);
    },
    error: (err) => {
      console.error('Error fetching properties:', err);
    },
  });
}

onSearchChange() {
  if (this.searchText.trim().length > 0) {
    this.propertyService.searchProperties(this.searchText).subscribe({
      next: (res) => {
        this.filteredProperties = res.properties || res;
        this.propertyService.setProperties(this.filteredProperties);
      },
      error: (err) => {
        console.error('Error searching properties:', err);
        this.filteredProperties = [];
        this.propertyService.setProperties([]);
      },
    });
  } else {
    // لو مفيش نص → رجع كل العقارات
    this.loadAllProperties();
  }
}

}
