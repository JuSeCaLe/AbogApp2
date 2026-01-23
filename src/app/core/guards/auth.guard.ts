import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean | UrlTree | ReturnType<AuthService['loadMe']> | any {
    // 1) si no hay token → login
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    // 2) si ya tengo user en memoria → ok
    if (this.auth.snapshot) return true;

    // 3) si hay token pero no user (refresh) → cargar /me
    return this.auth.loadMe().pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }
}
