import { Component } from '@angular/core'
import { currency } from '@common/constants'

@Component({
  selector: 'customer-card',
  standalone: true,
  imports: [],
  templateUrl: './customer-card.component.html',
  styles: ``,
})
export class CustomerCardComponent {
  currency = currency
}
