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
      noteDate: [new Date(), Validators.required],
      text: ['', Validators.required]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { noteDate, text } = this.form.getRawValue();

    const dateStr = noteDate instanceof Date
      ? noteDate.toISOString().substring(0, 10)
      : String(noteDate).substring(0, 10);

    this.dialogRef.close({ noteDate: dateStr, text });
  }

  cancel() {
    this.dialogRef.close();
  }
}
