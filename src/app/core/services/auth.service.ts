import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthUser {
  id: string;
  email: string;
  roleIds: string[];
  fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user$ = new BehaviorSubject<AuthUser | null>({
    id: 'u-mock',
    email: 'admin@example.com',
    roleIds: ['r-admin'], // 👈 cambia a ['r-lawyer'] para probar no-admin
    fullName: 'Admin Mock',
  });

  readonly user$: Observable<AuthUser | null> = this._user$.asObservable();
  readonly isLoggedIn$ = this.user$.pipe(map(u => !!u));

  get snapshot(): AuthUser | null {
    return this._user$.value;
  }

  loginMock(user: AuthUser) {
    this._user$.next(user);
  }

  logout() {
    this._user$.next(null);
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
