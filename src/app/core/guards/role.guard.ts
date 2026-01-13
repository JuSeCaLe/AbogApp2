import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanMatch {
  constructor(private auth: AuthService, private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];
    if (allowedRoles.length === 0) return true;

    return this.auth.hasAnyRole(allowedRoles)
      ? true
      : this.router.createUrlTree(['/forbidden']);
  }
}
