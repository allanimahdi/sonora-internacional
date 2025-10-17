import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Simple password - you can change this
  private readonly VALID_PASSWORD = 'sonora2025';
  private readonly AUTH_TOKEN_KEY = 'sonora_auth_token';

  constructor() {}

  login(password: string): boolean {
    if (password === this.VALID_PASSWORD) {
      // Generate a simple token (timestamp-based)
      const token = btoa(Date.now().toString());
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}

