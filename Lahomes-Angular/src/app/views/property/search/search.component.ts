import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { propertyData } from '@views/property/data'
import type { PropertyType } from '@views/property/data' // ✅ استيراد النوع بشكل صحيح
import { PropertyService } from '@core/services/property.service'

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './search.component.html',
  styles: ``,
})
export class SearchComponent {
  query = ''
  properties: PropertyType[] = propertyData
  filteredNames: string[] = this.properties.map((p) => p.name)

  constructor(
    private router: Router,
    private propertyService: PropertyService
  ) {}

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.query = value

    if (!value.trim()) {
      this.filteredNames = []
      return
    }

    // البحث عبر الباك اند
    this.propertyService.searchProperties(value).subscribe({
      next: (res) => {
        // بافتراض أن الباك اند يرجع مصفوفة من العقارات
        this.filteredNames = res.map((p: any) => p.name)
      },
      error: (err) => {
        console.error('Search failed', err)
        this.filteredNames = []
      },
    })
  }

  tryNavigateSelected() {
    const selectedName = this.query.trim().toLowerCase()
    if (!selectedName) return

    this.propertyService.searchProperties(selectedName).subscribe({
      next: (res) => {
        const selected = res.find(
          (p: any) => p.name.toLowerCase() === selectedName
        )
        if (selected) {
          this.router.navigate(['/property/details', selected._id])
        }
      },
      error: (err) => console.error(err),
    })
  }
}
