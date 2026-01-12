import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './core/layout/layout.module';

import { App } from './app';
import { Login } from './auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Cases } from './pages/cases/cases';
import { CaseCreate } from './pages/cases/case-create/case-create';
import { RoleForm } from './features/security/roles/pages/role-form/role-form';
import { UsersList } from './features/security/users/pages/users-list/users-list';
import { UserForm } from './features/security/users/pages/user-form/user-form';
import { RolesList } from './features/security/roles/pages/roles-list/roles-list';

/* Angular Material */
import { MaterialModule } from './shared/material.module';



@NgModule({
  declarations: [
    App,
    Login,
    Dashboard,
    Cases,
    CaseCreate,
    RolesList,
    RoleForm,
    UsersList,
    UserForm
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    LayoutModule,
    CoreModule,
    SharedModule,

    MaterialModule
  ],
  bootstrap: [App]
})
export class AppModule {}
