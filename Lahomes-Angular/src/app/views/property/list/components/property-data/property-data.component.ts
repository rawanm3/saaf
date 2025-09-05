import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { currency } from '@common/constants'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { PropertyService } from '../../../../../core/services/property.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

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
  propertyList: any[] = [] // هنا هنجيب الداتا من الباك
  filteredProperties: any[] = [] // اللي هنعرضها بعد السيرش
  currency = currency

  selectedProperty: any = null

  constructor(
    private modalService: NgbModal,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.loadAllProperties()
  }

  loadAllProperties() {
    this.propertyService.getAllProperties().subscribe({
      next: (properties) => {
        this.propertyList = properties
        this.filteredProperties = [...this.propertyList]
      },
      error: (err) => {
        console.error('Error fetching properties', err)
      },
    })
  }

  openPropertyModal(content: any, property: any) {
    this.selectedProperty = property
    this.modalService.open(content, { size: 'lg' })
  }

  searchText: string = ''
  private searchTimeout: any

  filterProperties() {
    clearTimeout(this.searchTimeout)

    this.searchTimeout = setTimeout(() => {
      const search = this.searchText.trim()

      if (!search) {
        this.filteredProperties = [...this.propertyList]
        return
      }

      this.propertyService.searchProperties(search).subscribe({
        next: (properties) => {
          this.filteredProperties = Array.isArray(properties) ? properties : []
          if (!this.filteredProperties.length) {
            // فلترة محلية fallback
            this.filteredProperties = this.clientFilter(search)
          }
        },
        error: () => {
          // fallback لو السيرفر رجّع Error
          this.filteredProperties = this.clientFilter(search)
        },
      })
    }, 300)
  }

  private clientFilter(search: string) {
    const s = search.toLowerCase()
    return this.propertyList.filter((item: any) =>
      [
        item?.name,
        item?.country,
        item?.location,
        item?.propertyType,
        item?.type,
      ].some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(s)
      )
    )
  }
}
