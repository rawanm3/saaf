import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
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
  imports: [DecimalPipe, CommonModule, NgbPaginationModule, NgbDropdownModule],
  templateUrl: './property-data.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyDataComponent {
  propertyList = propertyData
  currency = currency



// -------------bassant--------------------------------------------------
  selectedProperty: any = null;

constructor(private modalService: NgbModal) {}

  openPropertyModal(content: any, property: any) {
    this.selectedProperty = property;
    this.modalService.open(content, { size: 'lg' }); // lg = Large Modal
  }
// ------------------------------------------------------------------

}
