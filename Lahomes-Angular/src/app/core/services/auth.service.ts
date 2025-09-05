// import { Injectable } from '@angular/core'
// import { HttpClient } from '@angular/common/http'
// import { map } from 'rxjs/operators'

// import { CookieService } from 'ngx-cookie-service'
// import type { User } from '@core/helper/fake-backend'

// @Injectable({ providedIn: 'root' })
// export class AuthenticationService {
//   user: User | null = null

//   public readonly authSessionKey = '_LAhomes_AUTH_SESSION_KEY_'

//   constructor(
//     private http: HttpClient,
//     private cookieService: CookieService
//   ) {}

//   login(email: string, password: string) {
//     return this.http.post<User>(`/api/login`, { email, password }).pipe(
//       map((user) => {
//         if (user && user.token) {
//           this.user = user
//           this.saveSession(user.token)
//         }
//         return user
//       })
//     )
//   }

//   logout(): void {
//     this.removeSession()
//     this.user = null
//   }

//   get session(): string {
//     return this.cookieService.get(this.authSessionKey)
//   }

//   saveSession(token: string): void {
//     this.cookieService.set(this.authSessionKey, token)
//   }

//   removeSession(): void {
//     this.cookieService.delete(this.authSessionKey)
//   }
// }
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import type { User } from '@core/helper/fake-backend'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null

  public readonly authSessionKey = '_LAhomes_AUTH_SESSION_KEY_'

  constructor(private http: HttpClient) {}

  // استدعاء API تسجيل الدخول
  login(email: string, password: string) {
    return this.http
      .post<User>('http://localhost:3000/login', { email, password })
      .pipe(
        map((user) => {
          if (user && user.token) {
            this.user = user
            this.saveSession(user.token)
          }
          return user
        })
      )
  }

  // تسجيل الخروج
  logout(): void {
    this.removeSession()
    this.user = null
  }

  // جلب التوكن من localStorage
  get session(): string {
    return localStorage.getItem(this.authSessionKey) || ''
  }

  // حفظ التوكن
  saveSession(token: string): void {
    localStorage.setItem(this.authSessionKey, token)
  }

  // حذف التوكن
  removeSession(): void {
    localStorage.removeItem(this.authSessionKey)
  }
}