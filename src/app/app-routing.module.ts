import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './core/layout/home/home';
import { AuthGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard';
import { Cases } from './features/cases/cases';
import { CaseCreate } from './features/cases/case-create/case-create';
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
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module')
          .then(m => m.DashboardModule)
      },
      {
        path: 'cases',
        loadChildren: () => import('./features/cases/cases.module')
          .then(m => m.CasesModule)
      },
      {
        path: 'security',
        loadChildren: () => import('./features/security/security.module')
          .then(m => m.SecurityModule)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
