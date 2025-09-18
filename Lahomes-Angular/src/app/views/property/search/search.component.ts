import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageTitleComponent } from '@component/page-title.component'
import { propertyData, type PropertyType } from '@views/property/data'

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

  constructor(private router: Router) {}

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.query = value
    const lower = value.toLowerCase()
    this.filteredNames = this.properties
      .filter((p) => p.name.toLowerCase().includes(lower))
      .map((p) => p.name)
  }

  tryNavigateSelected() {
    const selected = this.properties.find(
      (p) => p.name.toLowerCase() === this.query.trim().toLowerCase()
    )
    if (selected) {
      this.router.navigate(['/property/details', selected.id])
    }
  }
}


