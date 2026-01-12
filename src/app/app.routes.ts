import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './layout/home/home';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Home, canActivate: [AuthGuard] }
];
