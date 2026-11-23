import { Component, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { CaseBulkImportService } from '../../../core/services/case-bulk-import.service';
import { CaseBulkImportReport } from '../../../core/models/case-bulk-import.model';

@Component({
  selector: 'app-case-bulk-import',
  standalone: false,
  templateUrl: './case-bulk-import.html',
  styleUrl: './case-bulk-import.css',
})
export class CaseBulkImport {
  file: File | null = null;
  report: CaseBulkImportReport | null = null;

  downloadingTemplate = false;
  uploading = false;
  committing = false;
  error = '';

  displayedColumns = ['rowNumber', 'folderNumber', 'demandado', 'status', 'stagesCount'];

  constructor(
    private service: CaseBulkImportService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  downloadTemplate(): void {
    this.downloadingTemplate = true;
    this.service.downloadTemplate().subscribe({
      next: (blob) => {
        this.downloadingTemplate = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Plantilla_Carga_Masiva_Casos.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.cdr.detectChanges();
      },
      error: () => { this.downloadingTemplate = false; this.cdr.detectChanges(); }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
    this.report = null;
    this.error = '';
  }

  // Vista previa: valida contra la base de datos pero no guarda nada todavía.
  preview(): void {
    if (!this.file) return;

    this.uploading = true;
    this.error = '';
    this.report = null;
    this.service.import(this.file, false).subscribe({
      next: (r) => { this.uploading = false; this.report = r; this.cdr.detectChanges(); },
      error: (e) => { this.uploading = false; this.error = this.extractError(e); this.cdr.detectChanges(); }
    });
  }

  // Confirmar: sube el mismo archivo otra vez con commit=true — recién acá
  // se crean los casos que hayan pasado la validación.
  confirm(): void {
    if (!this.file || !this.report) return;

    this.committing = true;
    this.error = '';
    this.service.import(this.file, true).subscribe({
      next: (r) => { this.committing = false; this.report = r; this.cdr.detectChanges(); },
      error: (e) => { this.committing = false; this.error = this.extractError(e); this.cdr.detectChanges(); }
    });
  }

  get canConfirm(): boolean {
    return !!this.report && !this.report.committed && this.report.validCases > 0 && !this.committing;
  }

  volver(): void {
    this.location.back();
  }

  private extractError(e: any): string {
    return e?.error?.message || 'No se pudo procesar el archivo.';
  }
}
