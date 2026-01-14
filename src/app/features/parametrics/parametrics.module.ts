import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametricsRoutingModule } from './parametrics.routing.module';
import { CourtForm } from './courts/court-form/court-form';
import { CourtsList } from './courts/courts-list/courts-list';
import { PlaintiffForm } from './plaintiffs/plaintiff-form/plaintiff-form';
import { ObligationsList } from './obligations/obligations-list/obligations-list';
import { ObligationForm } from './obligations/obligation-form/obligation-form';
import { PlaintiffsList } from './plaintiffs/plaintiffs-list/plaintiffs-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';


@NgModule({
  declarations: [
    CourtForm,
    CourtsList,
    PlaintiffForm,
    PlaintiffsList,
    ObligationForm,
    ObligationsList
  ],
  imports: [
    CommonModule,
    ParametricsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ParametricsModule { }
