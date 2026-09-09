import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MemorialsRoutingModule } from './memorials-routing.module';
import { Memorials } from './memorials';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [
    Memorials
  ],
  imports: [
    CommonModule,
    MemorialsRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class MemorialsModule { }
