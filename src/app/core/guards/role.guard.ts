import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanMatchFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  // Si no requiere roles, solo exige estar autenticado
  if (allowedRoles.length === 0) {
    return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
  }

  // Si no hay token => login
  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Si ya hay user en memoria, evaluar roles directo
  if (auth.snapshot) {
    return auth.hasAnyRole(allowedRoles)
      ? true
      : router.createUrlTree(['/forbidden']);
  }

  // Refresh case: hay token pero no snapshot => cargar /me y luego validar roles
  return auth.loadMe().pipe(
    map(() => auth.hasAnyRole(allowedRoles) ? true : router.createUrlTree(['/forbidden'])),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
