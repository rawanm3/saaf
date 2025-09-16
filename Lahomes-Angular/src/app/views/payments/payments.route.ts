import { Routes } from '@angular/router'
import { PaymentListComponent } from './payment-list/payment-list.component'
import { PaymentDetailsComponent } from './payment-details/payment-details.component'

export const PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: PaymentListComponent,
    data: { title: 'Payments' },
  },
  {
    path: 'details/:id',
    component: PaymentDetailsComponent,
    data: { title: 'Payment Details' },
  },
];


