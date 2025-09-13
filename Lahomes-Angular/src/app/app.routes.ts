import { inject } from '@angular/core'
import { Router, Routes } from '@angular/router'
import { AuthenticationService } from '@core/services/auth.service'
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component'
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component'
import { ComingSoonComponent } from '@views/extra/coming-soon/coming-soon.component'
import { Error404Component } from '@views/extra/error404/error404.component'
import { MaintenanceComponent } from '@views/extra/maintenance/maintenance.component'
import { DetailsComponent } from '@views/property/details/details.component'

export const routes: Routes = [
  // Redirect from empty path
  {
    path: '',
    redirectTo: 'dashboards/analytics',
    pathMatch: 'full',
  },

  // Main layout + lazy loaded module
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [
      (url: any) => {
        const router = inject(Router)
        const authService = inject(AuthenticationService)
        if (!authService.session) {
          return router.createUrlTree(['/auth/sign-in'], {
            queryParams: { returnUrl: url._routerState.url },
          })
        }
        return true
      },
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
      },
      {
        path: 'properties/:id',
        component: DetailsComponent, // هنا نضمن الـ layout يكون موجود
      },
    ],
  },

  // Auth routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },

  // Extra pages
  {
    path: 'pages',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/extra/extra.route').then((mod) => mod.OTHER_PAGE_ROUTE),
  },
  {
  path: 'properties/:id',
  loadComponent: () =>
    import('@views/property/details/details.component').then(m => m.DetailsComponent),
},


  // Fallback 404
  { path: '**', component: Error404Component },
]