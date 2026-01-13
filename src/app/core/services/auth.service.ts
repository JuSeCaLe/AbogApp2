import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthUser {
  id: string;
  email: string;
  roleIds: string[];
  fullName?: string;
}

const STORAGE_KEY = 'abogapp.auth.user';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user$ = new BehaviorSubject<AuthUser | null>(loadUser());

  readonly user$: Observable<AuthUser | null> = this._user$.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map(u => !!u));

  get snapshot(): AuthUser | null {
    return this._user$.value;
  }

  loginMock(user: AuthUser) {
    this._user$.next(user);
    saveUser(user);
  }

  logout() {
    this._user$.next(null);
    saveUser(null);
  }

  hasRole(roleId: string): boolean {
    const u = this._user$.value;
    return !!u && u.roleIds.includes(roleId);
  }

  hasAnyRole(roleIds: string[]): boolean {
    const u = this._user$.value;
    return !!u && roleIds.some(r => u.roleIds.includes(r));
  }
}
