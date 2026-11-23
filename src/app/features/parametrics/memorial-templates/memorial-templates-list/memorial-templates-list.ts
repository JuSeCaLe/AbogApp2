import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MemorialTemplateAdminService } from '../../../../core/services/memorial-template-admin.service';
import { MemorialTemplateAdmin } from '../../../../core/models/memorial-template-admin.model';
import { MemorialTemplateDialog, MemorialTemplateDialogResult } from '../memorial-template-dialog/memorial-template-dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-memorial-templates-list',
  standalone: false,
  templateUrl: './memorial-templates-list.html',
  styleUrl: './memorial-templates-list.css',
})
export class MemorialTemplatesList implements OnInit {
  templates: MemorialTemplateAdmin[] = [];
  displayedColumns = ['name', 'fileName', 'placeholders', 'active', 'updatedAt', 'actions'];

  loading = false;
  savingId: number | null = null; // fila con una operación (reemplazar/eliminar) en curso
  error = '';

  constructor(
    private service: MemorialTemplateAdminService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    this.service.refresh().subscribe({
      next: (list) => { this.templates = list; this.loading = false; this.cdr.detectChanges(); },
      error: (e) => { this.loading = false; this.error = this.extractError(e); this.cdr.detectChanges(); }
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(MemorialTemplateDialog);
    ref.afterClosed().subscribe((result?: MemorialTemplateDialogResult) => {
      if (!result || !result.file) return;

      this.service.create(result.name, result.file).subscribe({
        next: () => this.reload(),
        error: (e) => { this.error = this.extractError(e); this.cdr.detectChanges(); }
      });
    });
  }

  openEdit(t: MemorialTemplateAdmin): void {
    const ref = this.dialog.open(MemorialTemplateDialog, { data: { template: t } });
    ref.afterClosed().subscribe((result?: MemorialTemplateDialogResult) => {
      if (!result) return;

      this.savingId = t.id;
      // Primero el rename/active; si además eligieron un archivo nuevo, se
      // encadena el reemplazo del contenido.
      this.service.update(t.id, result.name, result.active).subscribe({
        next: () => {
          if (result.file) {
            this.service.replaceFile(t.id, result.file).subscribe({
              next: () => { this.savingId = null; this.reload(); },
              error: (e) => { this.savingId = null; this.error = this.extractError(e); this.cdr.detectChanges(); }
            });
          } else {
            this.savingId = null;
            this.reload();
          }
        },
        error: (e) => { this.savingId = null; this.error = this.extractError(e); this.cdr.detectChanges(); }
      });
    });
  }

  download(t: MemorialTemplateAdmin): void {
    this.service.download(t.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = t.fileName || `${t.name}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (e) => { this.error = this.extractError(e); this.cdr.detectChanges(); }
    });
  }

  remove(t: MemorialTemplateAdmin): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar plantilla',
        message: `¿Seguro que deseas eliminar "${t.name}"?\nEsta acción NO se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;
      this.savingId = t.id;
      this.service.delete(t.id).subscribe({
        next: () => { this.savingId = null; this.cdr.detectChanges(); },
        error: (e) => { this.savingId = null; this.error = this.extractError(e); this.cdr.detectChanges(); }
      });
    });
  }

  private extractError(e: any): string {
    return e?.error?.message || 'No se pudo completar la operación.';
  }
}
