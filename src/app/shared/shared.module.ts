import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { Forbidden } from './components/forbidden/forbidden';

@NgModule({
  declarations: [
    Forbidden
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    Forbidden
  ],
})
export class SharedModule {}
