import { Component } from '@angular/core'
import { customersInvestOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { currency } from '@common/constants'

@Component({
  selector: 'customer-invest',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './customer-invest.component.html',
  styles: ``,
})
export class CustomerInvestComponent {
  dataColumn2Chart = customersInvestOptions
  currency = currency
}
