import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { Forbidden } from './components/forbidden/forbidden';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

@NgModule({
  declarations: [
    Forbidden,
    ConfirmDialog
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    Forbidden,
    ConfirmDialog
  ],
})
export class SharedModule {}
