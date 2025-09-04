import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    this.setLanguage('en');
  }

  toggleLanguage() {
    const newLang = this.currentLang.value === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  private setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
