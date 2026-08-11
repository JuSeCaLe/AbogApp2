import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DemandanteInfo {
  id: string;
  name: string;
}

export interface UserMe {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  demandanteIds: string[];
  demandantes: DemandanteInfo[];
}

type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  user: { id: string; email: string; userName: string };
  roles: string[];
  demandanteIds: string[];
  demandantes: DemandanteInfo[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;
  private apiBase = environment.apiUrl;

  private _user$ = new BehaviorSubject<UserMe | null>(null);
  user$ = this._user$.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/Auth/login`, { email, password }).pipe(
      tap(res => {
        if (this.isBrowser) localStorage.setItem('accessToken', res.accessToken);

        this._user$.next({
          id: res.user.id,
          email: res.user.email,
          userName: res.user.userName,
          roles: res.roles ?? [],
          demandanteIds: res.demandanteIds ?? [],
          demandantes: res.demandantes ?? []
        });
      })
    );
  }

  loadMe(): Observable<UserMe> {
    return this.http.get<UserMe>(`${this.apiBase}/Auth/me`).pipe(
      tap(u => this._user$.next(u))
    );
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('accessToken');
    this._user$.next(null);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('accessToken');
  }

  get token(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('accessToken');
  }

  get snapshot(): UserMe | null {
    return this._user$.value;
  }

  hasRole(roleId: string): boolean {
    const u = this._user$.value;
    return !!u && (u.roles ?? []).includes(roleId);
  }

  hasAnyRole(roleIds: string[]): boolean {
    const u = this._user$.value;
    if (!u) return false;
    const roles = u.roles ?? [];
    return roleIds.some(r => roles.includes(r));
  }

  // true si el usuario no es admin y tiene uno o más demandantes vinculados:
  // solo debe ver/crear casos de esos demandantes (ver CaseCreate/CasesController).
  get isScopedToPlaintiff(): boolean {
    const u = this._user$.value;
    return !!u && !this.hasRole('r-admin') && (u.demandantes?.length ?? 0) > 0;
  }
}
