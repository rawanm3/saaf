import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { currency } from '@common/constants'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { propertyData } from '@views/property/data'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'property-data',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
  ],
  templateUrl: './property-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDataComponent {
  propertyList = propertyData
  filteredProperties = [...this.propertyList] // دي اللي هنشتغل بيها
  currency = currency



// -------------bassant--------------------------------------------------
  selectedProperty: any = null;

constructor(private modalService: NgbModal) {}

  openPropertyModal(content: any, property: any) {
    this.selectedProperty = property;
    this.modalService.open(content, { size: 'lg' }); // lg = Large Modal
  }
// ------------------------------------------------------------------

  searchText: string = ''
  private searchTimeout: any

  filterProperties() {
    clearTimeout(this.searchTimeout)

    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim()

      if (!search) {
        // لو السيرش فاضي رجّع كل العقارات
        this.filteredProperties = [...this.propertyList]
        return
      }

      // فلترة حسب النص اللي اتكتب
      this.filteredProperties = this.propertyList.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.propertyType.toLowerCase().includes(search) ||
          p.type.toLowerCase().includes(search) ||
          p.country.toLowerCase().includes(search) ||
          String(p.size).includes(search) ||
          String(p.price).includes(search) ||
          String(p.beds).includes(search)
      )
    }, 300)
  }
}

