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

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RoleForm } from './features/security/roles/pages/role-form/role-form';
import { UsersList } from './features/security/users/pages/users-list/users-list';
import { UserForm } from './features/security/users/pages/user-form/user-form';
import { RolesList } from './features/security/roles/pages/roles-list/roles-list';

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

    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  bootstrap: [App]
})
export class AppModule {}
