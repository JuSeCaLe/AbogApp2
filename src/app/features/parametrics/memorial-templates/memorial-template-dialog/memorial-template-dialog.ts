import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemorialTemplateAdmin, MEMORIAL_TEMPLATE_VARIABLES } from '../../../../core/models/memorial-template-admin.model';

export interface MemorialTemplateDialogResult {
  name: string;
  active: boolean;
  file: File | null;
}

@Component({
  selector: 'app-memorial-template-dialog',
  standalone: false,
  templateUrl: './memorial-template-dialog.html',
  styleUrl: './memorial-template-dialog.css',
})
export class MemorialTemplateDialog {
  form: FormGroup;
  file: File | null = null;
  fileError = '';
  variables = MEMORIAL_TEMPLATE_VARIABLES;

  get isEditing(): boolean {
    return !!this.data?.template;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemorialTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { template?: MemorialTemplateAdmin }
  ) {
    this.form = this.fb.group({
      name: [data?.template?.name ?? '', [Validators.required, Validators.minLength(2)]],
      active: [data?.template?.active ?? true]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0] ?? null;
    this.fileError = '';

    if (selected && !selected.name.toLowerCase().endsWith('.docx')) {
      this.fileError = 'El archivo debe ser un .docx de Word.';
      this.file = null;
      input.value = '';
      return;
    }
    this.file = selected;
  }

  save(): void {
    if (this.form.invalid || (!this.isEditing && !this.file)) {
      this.form.markAllAsTouched();
      if (!this.isEditing && !this.file) this.fileError = 'Selecciona el archivo .docx de la plantilla.';
      return;
    }

    const result: MemorialTemplateDialogResult = {
      name: this.form.value.name.trim(),
      active: this.form.value.active,
      file: this.file
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
