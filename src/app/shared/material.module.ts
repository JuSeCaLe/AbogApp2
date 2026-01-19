import { NgModule } from '@angular/core';

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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const MATERIAL = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatTabsModule,
  MatSelectModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  imports: MATERIAL,
  exports: MATERIAL,
})
export class MaterialModule {}
