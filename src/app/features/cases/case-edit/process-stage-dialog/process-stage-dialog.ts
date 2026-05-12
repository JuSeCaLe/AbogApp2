import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-process-stage-dialog',
  standalone: false,
  templateUrl: './process-stage-dialog.html',
  styleUrl: './process-stage-dialog.css',
})
export class ProcessStageDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcessStageDialog>
  ) {
    this.form = this.fb.group({
      stageName: ['', Validators.required],
      subStageName: ['', Validators.required],
      observation: ['']
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
