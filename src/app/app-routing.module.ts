import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './layout/home/home';
import { AuthGuard } from './guards/auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Cases } from './pages/cases/cases';
import { CaseCreate } from './pages/cases/case-create/case-create';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: '',
    component: Home,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'cases', component: Cases },
      { path: 'dashboard', component: Dashboard },
      { path: 'cases/new', component: CaseCreate },
      { path: 'cases/:id', component: CaseCreate }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
