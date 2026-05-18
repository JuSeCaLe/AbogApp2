import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService, CatalogProcessType, CatalogStage, CatalogSubStage } from '../../../../core/services/catalog.service';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcessStageDialog>,
    private catalogService: CatalogService,
    @Inject(MAT_DIALOG_DATA) public data: { processType: string }
  ) {
    this.form = this.fb.group({
      stageDate: [new Date(), Validators.required],
      stageId: [null, Validators.required],
      subStageId: [null],
      observation: ['']
    });
  }

  ngOnInit(): void {
    this.catalogService.getStageCatalog().subscribe(catalog => {
      this.processTypes = catalog;
      const catalogName = this.mapToCatalogName(this.data?.processType ?? '');
      const pt = catalog.find(p => p.name === catalogName);
      this.filteredStages = pt?.stages ?? [];
    });

    this.form.get('stageId')!.valueChanges.subscribe((stageId: number) => {
      const stage = this.filteredStages.find(s => s.id === stageId);
      this.filteredSubStages = stage?.subStages ?? [];
      this.form.get('subStageId')!.setValue(null, { emitEvent: false });
    });
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
