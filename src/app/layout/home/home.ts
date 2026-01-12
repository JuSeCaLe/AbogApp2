import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  opened = false;
}
