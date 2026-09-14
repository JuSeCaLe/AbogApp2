import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CaseService } from '../../../core/services/case.service';
import { MemorialService } from '../../../core/services/memorial.service';
import { Case, CaseProcessStage, CaseProceduralNote, DriveFile } from '../../../core/models/case.model';
import { MemorialTemplate } from '../../../core/models/memorial.model';
import { ProcessStageDialog } from './process-stage-dialog/process-stage-dialog';
import { ProceduralNoteDialog } from './procedural-note-dialog/procedural-note-dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
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

  displayedStageColumns = ['createdAt', 'stageName', 'subStageName', 'observation', 'actions'];
  displayedNoteColumns = ['createdAt', 'text'];

  driveFiles: DriveFile[] = [];
  loadingDriveFiles = false;
  creatingDriveFolder = false;
  uploadingDriveFile = false;
  driveError = '';

  memorialTemplates: MemorialTemplate[] = [];
  selectedMemorialTemplateId: number | null = null;
  generatingMemorial = false;
  memorialError = '';

  constructor(
    private route: ActivatedRoute,
    private caseService: CaseService,
    private memorialService: MemorialService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.caseId = Number(this.route.snapshot.paramMap.get('id'));
    this.memorialService.getTemplates().subscribe(t => this.memorialTemplates = t);
    this.loadCase();
  }

  loadCase(): void {
    this.caseService.getCaseById(this.caseId).subscribe(c => {
      this.caseData = c;
      this.cdr.detectChanges();

      if (c?.driveFolderId) this.loadDriveFiles();
    });
  }

  loadDriveFiles(): void {
    this.loadingDriveFiles = true;
    this.driveError = '';
    this.caseService.getDriveFiles(this.caseId).subscribe({
      next: (files) => {
        this.driveFiles = files;
        this.loadingDriveFiles = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingDriveFiles = false;
        this.driveError = this.extractDriveError(err);
        this.cdr.detectChanges();
      }
    });
  }

  createDriveFolder(): void {
    this.creatingDriveFolder = true;
    this.driveError = '';
    this.caseService.createDriveFolder(this.caseId).subscribe({
      next: () => {
        this.creatingDriveFolder = false;
        this.loadCase();
      },
      error: (err) => {
        this.creatingDriveFolder = false;
        this.driveError = this.extractDriveError(err);
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.uploadingDriveFile = true;
    this.driveError = '';
    this.caseService.uploadDriveFile(this.caseId, file).subscribe({
      next: () => {
        this.uploadingDriveFile = false;
        this.loadCase();
      },
      error: (err) => {
        this.uploadingDriveFile = false;
        this.driveError = this.extractDriveError(err);
        this.cdr.detectChanges();
      }
    });
  }

  private extractDriveError(err: any): string {
    return err?.error?.detail || err?.error?.message || 'No se pudo completar la operación con Google Drive.';
  }

  volver(): void {
    this.location.back();
  }

  get canGenerateMemorial(): boolean {
    return !!this.selectedMemorialTemplateId && !this.generatingMemorial;
  }

  generateMemorial(): void {
    if (!this.canGenerateMemorial || !this.selectedMemorialTemplateId) return;

    this.generatingMemorial = true;
    this.memorialError = '';

    this.memorialService.generate(this.selectedMemorialTemplateId, [this.caseId]).subscribe({
      next: (response) => {
        this.generatingMemorial = false;
        const fileName = MemorialService.extractFileName(response, 'memorial.docx');
        const url = window.URL.createObjectURL(response.body!);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.generatingMemorial = false;
        this.memorialError = err?.error?.message || 'No se pudo generar el memorial.';
      }
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

  editStage(row: CaseProcessStage): void {
    const ref = this.dialog.open(ProcessStageDialog, {
      data: { processType: this.caseData?.process?.processType ?? '', stage: row }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      const stage: CaseProcessStage = {
        id: row.id,
        createdAt: result.stageDate,
        stageName: result.stageName,
        subStageName: result.subStageName ?? '',
        observation: result.observation
      };

      this.caseService.updateProcessStage(this.caseId, stage)
        .subscribe(() => this.loadCase());
    });
  }

  deleteStage(row: CaseProcessStage): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar etapa',
        message: `¿Seguro que deseas eliminar la etapa "${row.stageName}${row.subStageName ? ' / ' + row.subStageName : ''}" del ${row.createdAt}?\nEsta acción NO se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;
      this.caseService.deleteProcessStage(this.caseId, row.id)
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
