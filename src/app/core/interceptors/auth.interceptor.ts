import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.token;
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: unknown) => {
        // Sesión vencida o token inválido: cierra sesión y manda al login,
        // conservando a dónde iba para volver ahí después de loguearse de
        // nuevo. Se excluye el propio POST de login (un 401 ahí es
        // "usuario/clave incorrectos", no una sesión vencida) y evita
        // redirigir en bucle si ya estamos en /login.
        if (
          err instanceof HttpErrorResponse &&
          err.status === 401 &&
          !req.url.includes('/Auth/login') &&
          !this.router.url.startsWith('/login')
        ) {
          this.auth.logout();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url, sessionExpired: 1 }
          });
        }
        return throwError(() => err);
      })
    );
  }
}
