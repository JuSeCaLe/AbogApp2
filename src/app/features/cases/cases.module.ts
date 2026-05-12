import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasesRoutingModule } from './cases-routing.module';
import { Cases } from './cases';
import { CaseCreate } from './case-create/case-create';
import { CaseEdit } from './case-edit/case-edit';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessStageDialog } from './case-edit/process-stage-dialog/process-stage-dialog';
import { ProceduralNoteDialog } from './case-edit/procedural-note-dialog/procedural-note-dialog';


@NgModule({
  declarations: [
    Cases,
    CaseCreate,
    CaseEdit,
    ProcessStageDialog,
    ProceduralNoteDialog
  ],
  imports: [
    CommonModule,
    CasesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CasesModule { }
