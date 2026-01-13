import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from './../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
})
export class Login {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  loginAsAdmin(): void {
    const admin: AuthUser = {
      id: 'u-admin',
      email: 'admin@example.com',
      fullName: 'Administrador',
      roleIds: ['r-admin'],
    };

    this.auth.loginMock(admin);
    this.router.navigate(['/dashboard']);
  }

  loginAsLawyer(): void {
    const lawyer: AuthUser = {
      id: 'u-lawyer',
      email: 'lawyer@example.com',
      fullName: 'Abogado',
      roleIds: ['r-lawyer'],
    };

    this.auth.loginMock(lawyer);
    this.router.navigate(['/dashboard']);
  }
}
