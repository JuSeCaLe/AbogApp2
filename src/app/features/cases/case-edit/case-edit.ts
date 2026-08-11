import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '../../../core/services/case.service';
import { Case, CaseProcessStage, CaseProceduralNote } from '../../../core/models/case.model';
import { ProcessStageDialog } from './process-stage-dialog/process-stage-dialog';
import { ProceduralNoteDialog } from './procedural-note-dialog/procedural-note-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-case-edit',
  standalone: false,
  templateUrl: './case-edit.html',
  styleUrls: ['./case-edit.css']
})
export class CaseEdit implements OnInit {
  caseId!: number;
  caseData?: Case;

  editingRadicado = false;
  radicadoDraft = '';
  savingRadicado = false;

  displayedStageColumns = ['createdAt', 'stageName', 'subStageName', 'observation'];
  displayedNoteColumns = ['createdAt', 'text'];

  constructor(
    private route: ActivatedRoute,
    private caseService: CaseService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.caseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCase();
  }

  loadCase(): void {
    this.caseService.getCaseById(this.caseId).subscribe(c => {
      this.caseData = c;
      this.cdr.detectChanges();
    });
  }

  startEditRadicado(): void {
    this.radicadoDraft = this.caseData?.process?.radicado ?? '';
    this.editingRadicado = true;
  }

  cancelEditRadicado(): void {
    this.editingRadicado = false;
  }

  saveRadicado(): void {
    if (!this.caseData) return;

    const updated: Case = {
      ...this.caseData,
      process: { ...this.caseData.process, radicado: this.radicadoDraft.trim() }
    };

    this.savingRadicado = true;
    this.caseService.updateCase(updated).subscribe({
      next: () => {
        this.savingRadicado = false;
        this.editingRadicado = false;
        this.loadCase();
      },
      error: () => { this.savingRadicado = false; }
    });
  }

  addStage(): void {
    const ref = this.dialog.open(ProcessStageDialog, {
      data: { processType: this.caseData?.process?.processType ?? '' }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      const stage: CaseProcessStage = {
        id: 0,
        createdAt: result.stageDate,
        stageName: result.stageName,
        subStageName: result.subStageName ?? '',
        observation: result.observation
      };

      this.caseService.addProcessStage(this.caseId, stage)
        .subscribe(() => this.loadCase());
    });
  }

  addNote(): void {
    const ref = this.dialog.open(ProceduralNoteDialog);

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      const note: CaseProceduralNote = {
        id: 0,
        createdAt: result.noteDate ?? new Date().toISOString().substring(0, 10),
        text: result.text
      };

      this.caseService.addProceduralNote(this.caseId, note)
        .subscribe(() => this.loadCase());
    });
  }

  get defendantText(): string {
    const parties = this.caseData?.partiesInfo as any[];
    const defendant = parties?.find(p => p.processRole === 'DEMANDADO');
    return defendant?.person ?? 'Demandado no registrado';
  }
}
