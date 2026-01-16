import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.css',
})
export class AppFooter {
  year = new Date().getFullYear();
}
