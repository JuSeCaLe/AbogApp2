import { Component, EventEmitter, Output } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './app-toolbar.html',
  styleUrl: './app-toolbar.css',
})
export class AppToolbar {
  @Output() menu = new EventEmitter<void>();

  constructor(private auth: Auth) {}

  toggleMenu() {
    this.menu.emit();
  }

  logout() {
    this.auth.logout();
  }
}
