import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './layout/home/home';
import { AuthGuard } from './guards/auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Cases } from './pages/cases/cases';
import { CaseCreate } from './pages/cases/case-create/case-create';
import { RolesList } from './features/security/roles/pages/roles-list/roles-list';
import { RoleForm } from './features/security/roles/pages/role-form/role-form';
import { UsersList } from './features/security/users/pages/users-list/users-list';
import { UserForm } from './features/security/users/pages/user-form/user-form';

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
      { path: 'cases/:id', component: CaseCreate },
      { path: 'security/roles', component: RolesList },
      { path: 'security/roles/new', component: RoleForm },
      { path: 'security/roles/:id', component: RoleForm },
      { path: 'security/users', component: UsersList },
      { path: 'security/users/new', component: UserForm },
      { path: 'security/users/:id', component: UserForm }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
