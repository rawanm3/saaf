import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import type { User } from '@core/helper/fake-backend'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null

  public readonly authSessionKey = 'LAhomes_AUTH_SESSION_KEY'

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