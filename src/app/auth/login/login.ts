import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.loadMe().subscribe({ error: () => this.auth.logout() });
    }
  }

  submit() {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.error = err?.error?.message || 'No fue posible iniciar sesión';
        this.loading = false;
      }
    });
  }
  // loginAsAdmin(): void {
  //   const admin: AuthUser = {
  //     id: 'u-admin',
  //     email: 'admin@example.com',
  //     fullName: 'Administrador',
  //     roleIds: ['r-admin'],
  //   };

  //   this.auth.loginMock(admin);
  //   this.router.navigate(['/dashboard']);
  // }

  // loginAsLawyer(): void {
  //   const lawyer: AuthUser = {
  //     id: 'u-lawyer',
  //     email: 'lawyer@example.com',
  //     fullName: 'Abogado',
  //     roleIds: ['r-lawyer'],
  //   };

  //   this.auth.loginMock(lawyer);
  //   this.router.navigate(['/dashboard']);
  // }
}
