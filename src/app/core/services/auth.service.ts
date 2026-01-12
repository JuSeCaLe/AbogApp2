import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      if (this.isBrowser) {
        localStorage.setItem('auth', 'true');
      }
      return true;
    }
    return false;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('auth');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth');
  }
}
