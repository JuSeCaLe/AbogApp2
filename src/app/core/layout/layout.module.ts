import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Angular Material (usa los que realmente ocupan tus componentes de layout) */
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { Home } from './home/home';
import { Sidebar } from './sidebar/sidebar';
import { AppToolbar } from './app-toolbar/app-toolbar';

@NgModule({
  declarations: [Home, Sidebar, AppToolbar],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  exports: [Home, Sidebar, AppToolbar],
})
export class LayoutModule {}
