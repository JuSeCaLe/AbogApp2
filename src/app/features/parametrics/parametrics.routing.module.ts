import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtsList } from './courts/courts-list/courts-list';
import { CourtForm } from './courts/court-form/court-form';
import { PlaintiffsList } from './plaintiffs/plaintiffs-list/plaintiffs-list';
import { PlaintiffForm } from './plaintiffs/plaintiff-form/plaintiff-form';
import { ObligationForm } from './obligations/obligation-form/obligation-form';
import { ObligationsList } from './obligations/obligations-list/obligations-list';

const routes: Routes = [
  { path: 'courts', component: CourtsList },
  { path: 'courts/new', component: CourtForm },
  { path: 'courts/:id', component: CourtForm },

  { path: 'plaintiffs', component: PlaintiffsList },
  { path: 'plaintiffs/new', component: PlaintiffForm },
  { path: 'plaintiffs/:id', component: PlaintiffForm },

  { path: 'obligations', component: ObligationsList },
  { path: 'obligations/new', component: ObligationForm },
  { path: 'obligations/:id', component: ObligationForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametricsRoutingModule { }
