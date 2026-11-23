import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametricsRoutingModule } from './parametrics.routing.module';
import { CourtForm } from './courts/court-form/court-form';
import { CourtsList } from './courts/courts-list/courts-list';
import { ObligationTypeList } from './obligation-types/obligation-types-list/obligation-types-list';
import { ObligationTypeForm } from './obligation-types/obligation-types-form/obligation-types-form';
import { ProcessTypeForm } from './process-types/process-types-form/process-types-form';
import { ProcessTypeList } from './process-types/process-types-list/process-types-list';
import { MemorialTemplatesList } from './memorial-templates/memorial-templates-list/memorial-templates-list';
import { MemorialTemplateDialog } from './memorial-templates/memorial-template-dialog/memorial-template-dialog';
import { CaseBulkImport } from './case-bulk-import/case-bulk-import';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CourtForm,
    CourtsList,
    ObligationTypeForm,
    ObligationTypeList,
    ProcessTypeForm,
    ProcessTypeList,
    MemorialTemplatesList,
    MemorialTemplateDialog,
    CaseBulkImport
  ],
  imports: [
    CommonModule,
    ParametricsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class ParametricsModule { }
