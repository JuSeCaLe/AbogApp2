import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-procedural-note-dialog',
  standalone: false,
  templateUrl: './procedural-note-dialog.html'
})
export class ProceduralNoteDialog {
  form;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProceduralNoteDialog>
  ) {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancel() {
    this.dialogRef.close();
  }
}
