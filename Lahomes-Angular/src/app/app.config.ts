import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  type InMemoryScrollingFeature,
  type InMemoryScrollingOptions,
} from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { rootReducer } from './store';
import { localStorageSyncReducer } from '@store/layout/layout-reducers';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { CalendarEffects } from '@store/calendar/calendar.effects';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationEffects } from '@store/authentication/authentication.effects';
import { FakeBackendProvider } from '@core/helper/fake-backend';
import { provideToastr } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';

// ✅ Loader المخصص
import { CustomTranslateLoader } from './core/i18n/custom-translate-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeatures: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    FakeBackendProvider,
    CookieService,
    DecimalPipe,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, inMemoryScrollingFeatures),
    provideStore(rootReducer, { metaReducers: [localStorageSyncReducer] }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects, CalendarEffects),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),

    // ✅ الترجمة
    importProvidersFrom(
  TranslateModule.forRoot({
    defaultLanguage: 'en',
    loader: {
      provide: TranslateLoader,
      useClass: CustomTranslateLoader,
      deps: [HttpClient],
    },
  })
),


    provideToastr(),
  ],
};
