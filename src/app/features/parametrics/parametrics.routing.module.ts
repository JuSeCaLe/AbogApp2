import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtsList } from './courts/courts-list/courts-list';
import { CourtForm } from './courts/court-form/court-form';
import { PlaintiffsList } from './plaintiffs/plaintiffs-list/plaintiffs-list';
import { PlaintiffForm } from './plaintiffs/plaintiff-form/plaintiff-form';
import { ObligationTypeForm } from './obligations/obligation-form/obligation-type-form';
import { ObligationTypeList } from './obligations/obligation-type-list/obligation-type-list';

const routes: Routes = [
  { path: 'courts', component: CourtsList },
  { path: 'courts/new', component: CourtForm },
  { path: 'courts/:id', component: CourtForm },

  { path: 'plaintiffs', component: PlaintiffsList },
  { path: 'plaintiffs/new', component: PlaintiffForm },
  { path: 'plaintiffs/:id', component: PlaintiffForm },

  { path: 'obligationType', component: ObligationTypeList },
  { path: 'obligationType/new', component: ObligationTypeForm },
  { path: 'obligationType/:id', component: ObligationTypeForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametricsRoutingModule { }
