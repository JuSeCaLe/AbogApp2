import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { Login } from './auth/login/login';
import { Home } from './layout/home/home';
import { Sidebar } from './layout/sidebar/sidebar';
import { AppRoutingModule } from './app-routing.module';

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
import { Dashboard } from './pages/dashboard/dashboard';
import { Cases } from './pages/cases/cases';
import { CaseCreate } from './pages/cases/case-create/case-create';
import { AppToolbar } from './layout/app-toolbar/app-toolbar';

@NgModule({
  declarations: [
    App,
    Login,
    Home,
    Sidebar,
    Dashboard,
    Cases,
    CaseCreate,
    AppToolbar
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,

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
    MatSelectModule
  ],
  bootstrap: [App]
})
export class AppModule {}
