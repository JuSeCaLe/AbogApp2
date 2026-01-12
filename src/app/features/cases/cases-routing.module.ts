import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Cases } from './cases';
import { CaseCreate } from './case-create/case-create';

const routes: Routes = [
  { path: '', component: Cases },
  { path: 'new', component: CaseCreate },
  { path: ':id', component: CaseCreate }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule { }
