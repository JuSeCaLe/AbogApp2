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

/* Angular Material */
import { MaterialModule } from './shared/material.module';



@NgModule({
  declarations: [
    App,
    Login
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
