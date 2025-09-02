import type { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { GridComponent } from './grid/grid.component'
import { DetailsComponent } from './details/details.component'
import { AddComponent } from './add/add.component'
import { SearchComponent } from './search/search.component'

export const CUSTOMER_ROUTES: Route[] = [
  { path: 'list', component: ListComponent, data: { title: 'Customer List' } },
  { path: 'grid', component: GridComponent, data: { title: 'Customer Grid' } },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Customer Overview' },
  },
  {
    path: 'details/:name',
    component: DetailsComponent,
    data: { title: 'Customer Overview' },
  },
  { path: 'search', component: SearchComponent, data: { title: 'Search Customers' } },
  { path: 'add', component: AddComponent, data: { title: 'Customers Add' } },
]
