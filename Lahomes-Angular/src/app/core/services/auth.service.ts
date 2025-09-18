import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import type { User } from '@core/helper/fake-backend'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null
  public readonly authSessionKey = 'LAhomes_AUTH_SESSION_KEY'

  constructor(private http: HttpClient) {}

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

  logout(): void {
    this.removeSession()
    this.user = null
  }

  get session(): string {
    return localStorage.getItem(this.authSessionKey) || ''
  }

  saveSession(token: string): void {
    localStorage.setItem(this.authSessionKey, token)
  }

  removeSession(): void {
    localStorage.removeItem(this.authSessionKey)
  }
}
