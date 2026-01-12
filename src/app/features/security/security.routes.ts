import { Routes } from '@angular/router';
import { RolesList } from './roles/pages/roles-list/roles-list';
import { RoleForm } from './roles/pages/role-form/role-form';
import { UsersList } from './users/pages/users-list/users-list';
import { UserForm } from './users/pages/user-form/user-form';

export const routes: Routes = [
  { path: 'security/roles', component: RolesList },
  { path: 'security/roles/new', component: RoleForm },
  { path: 'security/roles/:id/edit', component: RoleForm },
  { path: 'security/users', component: UsersList},
  { path: 'security/users/new', component: UserForm },
  { path: 'security/users/:id/edit', component: UserForm },
];
