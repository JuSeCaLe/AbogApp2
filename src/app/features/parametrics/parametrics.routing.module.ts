import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtsList } from './courts/courts-list/courts-list';
import { CourtForm } from './courts/court-form/court-form';
import { ObligationTypeForm } from './obligation-types/obligation-types-form/obligation-types-form';
import { ObligationTypeList } from './obligation-types/obligation-types-list/obligation-types-list';
import { ProcessTypeList } from './process-types/process-types-list/process-types-list';
import { ProcessTypeForm } from './process-types/process-types-form/process-types-form';
import { MemorialTemplatesList } from './memorial-templates/memorial-templates-list/memorial-templates-list';
import { CaseBulkImport } from './case-bulk-import/case-bulk-import';

const routes: Routes = [
  { path: 'courts', component: CourtsList },
  { path: 'courts/new', component: CourtForm },
  { path: 'courts/:id', component: CourtForm },

  { path: 'obligationType', component: ObligationTypeList },
  { path: 'obligationType/new', component: ObligationTypeForm },
  { path: 'obligationType/:id', component: ObligationTypeForm },

  { path: 'processType', component: ProcessTypeList },
  { path: 'processType/new', component: ProcessTypeForm },
  { path: 'processType/:id', component: ProcessTypeForm },

  { path: 'memorialTemplates', component: MemorialTemplatesList },
  { path: 'caseBulkImport', component: CaseBulkImport }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametricsRoutingModule { }
