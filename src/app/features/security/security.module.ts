import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SecurityRoutingModule } from './security-routing.module';
import { RoleForm } from './roles/pages/role-form/role-form';
import { RolesList } from './roles/pages/roles-list/roles-list';
import { UsersList } from './users/pages/users-list/users-list';
import { UserForm } from './users/pages/user-form/user-form';
import { GoogleDrive } from './google-drive/google-drive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';


@NgModule({
  declarations: [
    RolesList,
    RoleForm,
    UsersList,
    UserForm,
    GoogleDrive
  ],
  imports: [
    CommonModule,
    RouterModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class SecurityModule { }
