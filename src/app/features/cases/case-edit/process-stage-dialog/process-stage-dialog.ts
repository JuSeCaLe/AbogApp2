import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService, CatalogProcessType, CatalogStage, CatalogSubStage } from '../../../../core/services/catalog.service';
import { CaseProcessStage } from '../../../../core/models/case.model';

@Component({
  selector: 'app-process-stage-dialog',
  standalone: false,
  templateUrl: './process-stage-dialog.html',
  styleUrl: './process-stage-dialog.css',
})
export class ProcessStageDialog implements OnInit {
  form: FormGroup;

  processTypes: CatalogProcessType[] = [];
  filteredStages: CatalogStage[] = [];
  filteredSubStages: CatalogSubStage[] = [];

  get isEditing(): boolean {
    return !!this.data?.stage;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcessStageDialog>,
    private catalogService: CatalogService,
    @Inject(MAT_DIALOG_DATA) public data: { processType: string; stage?: CaseProcessStage }
  ) {
    const stage = data?.stage;
    this.form = this.fb.group({
      stageDate: [stage ? new Date(stage.createdAt) : new Date(), Validators.required],
      stageId: [null, Validators.required],
      subStageId: [null],
      observation: [stage?.observation ?? '']
    });
  }

  ngOnInit(): void {
    this.catalogService.getStageCatalog().subscribe(catalog => {
      this.processTypes = catalog;
      const catalogName = this.mapToCatalogName(this.data?.processType ?? '');
      const pt = catalog.find(p => p.name === catalogName);
      this.filteredStages = pt?.stages ?? [];

      // En modo edición, preselecciona la etapa/subetapa que ya tenía el
      // registro buscándolas por nombre (el modelo solo guarda el texto,
      // no los ids del catálogo).
      const stage = this.data?.stage;
      if (stage) {
        const matchedStage = this.filteredStages.find(s => this.sameName(s.name, stage.stageName));
        if (matchedStage) {
          this.filteredSubStages = matchedStage.subStages;
          const matchedSub = matchedStage.subStages.find(ss => this.sameName(ss.name, stage.subStageName));
          this.form.patchValue({ stageId: matchedStage.id, subStageId: matchedSub?.id ?? null }, { emitEvent: false });
        }
      }
    });

    this.form.get('stageId')!.valueChanges.subscribe((stageId: number) => {
      const stage = this.filteredStages.find(s => s.id === stageId);
      this.filteredSubStages = stage?.subStages ?? [];
      this.form.get('subStageId')!.setValue(null, { emitEvent: false });
    });
  }

  private sameName(a: string, b: string): boolean {
    return (a ?? '').trim().toUpperCase() === (b ?? '').trim().toUpperCase();
  }

  private mapToCatalogName(processType: string): string {
    const pt = (processType ?? '').toUpperCase();
    if (pt.includes('INSOLVENCIA')) return 'INSOLVENCIA';
    if (pt.includes('RESTITU')) return 'RESTITUCIÓN';
    return 'HIPOTECARIO';
  }

  get hasSubStages(): boolean {
    return this.filteredSubStages.length > 0;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { stageDate, stageId, subStageId, observation } = this.form.getRawValue();

    const stage = this.filteredStages.find(s => s.id === stageId);
    const subStage = this.filteredSubStages.find(ss => ss.id === subStageId);

    const dateStr = stageDate instanceof Date
      ? stageDate.toISOString().substring(0, 10)
      : String(stageDate).substring(0, 10);

    this.dialogRef.close({
      stageDate: dateStr,
      stageName: stage?.name ?? '',
      subStageName: subStage?.name ?? '',
      observation
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
