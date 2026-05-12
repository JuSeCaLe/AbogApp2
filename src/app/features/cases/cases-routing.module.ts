import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Cases } from './cases';
import { CaseCreate } from './case-create/case-create';
import { CaseEdit } from './case-edit/case-edit';

const routes: Routes = [
  { path: '', component: Cases },
  { path: 'new', component: CaseCreate },
  { path: ':id/edit', component: CaseEdit }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule { }
