import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { currency, currentYear } from '@common/constants'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'property-info',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, RouterModule],
  templateUrl: './property-info.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyInfoComponent {
  @Input() property: any
  currency = currency
  currentYear = currentYear
}
