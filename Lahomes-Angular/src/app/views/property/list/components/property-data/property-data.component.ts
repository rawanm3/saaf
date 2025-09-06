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
  paginatedProperties: any[] = [] // اللي هنعرضها في الصفحة الحالية

  currency = currency

  selectedProperty: any = null

  // pagination variables
  page = 1
  pageSize = 10
  collectionSize = 0

  constructor(
    private modalService: NgbModal,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.loadAllProperties()
  }

  loadAllProperties() {
    this.propertyService.getAllRealEstates().subscribe({
      next: (res) => {
        this.propertyList = res.properties || [] // ناخد ال array من جوا
        this.filteredProperties = [...this.propertyList]
        this.collectionSize = this.filteredProperties.length
        this.refreshProperties()
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
        this.collectionSize = this.filteredProperties.length
        this.refreshProperties()
        return
      }

      this.propertyService.searchProperties(search).subscribe({
        next: (res) => {
          const properties = res.properties || []
          this.filteredProperties = Array.isArray(properties) ? properties : []
          if (!this.filteredProperties.length) {
            this.filteredProperties = this.clientFilter(search)
          }
          this.collectionSize = this.filteredProperties.length
          this.refreshProperties()
        },
        error: () => {
          this.filteredProperties = this.clientFilter(search)
          this.collectionSize = this.filteredProperties.length
          this.refreshProperties()
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

  refreshProperties() {
    const start = (this.page - 1) * this.pageSize
    const end = start + this.pageSize
    this.paginatedProperties = this.filteredProperties.slice(start, end)
  }
}