import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Home } from './home/home';
import { Sidebar } from './sidebar/sidebar';
import { AppToolbar } from './app-toolbar/app-toolbar';

/* Angular Material (usa los que realmente ocupan tus componentes de layout) */
import { MaterialModule } from '../../shared/material.module';
import { AppFooter } from './app-footer/app-footer';

@NgModule({
  declarations: [Home, Sidebar, AppToolbar, AppFooter],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [Home, Sidebar, AppToolbar, AppFooter],
})
export class LayoutModule {}
