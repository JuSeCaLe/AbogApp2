import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RolesList } from './roles/pages/roles-list/roles-list';
import { RoleForm } from './roles/pages/role-form/role-form';
import { UsersList } from './users/pages/users-list/users-list';
import { UserForm } from './users/pages/user-form/user-form';
import { GoogleDrive } from './google-drive/google-drive';

const routes: Routes = [
  { path: 'roles', component: RolesList },
  { path: 'roles/new', component: RoleForm },
  { path: 'roles/:id', component: RoleForm },

  { path: 'users', component: UsersList },
  { path: 'users/new', component: UserForm },
  { path: 'users/:id', component: UserForm },

  { path: 'google-drive', component: GoogleDrive }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
