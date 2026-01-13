import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './app-toolbar.html',
  styleUrl: './app-toolbar.css',
})
export class AppToolbar {
  @Output() menu = new EventEmitter<void>();

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menu.emit();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
