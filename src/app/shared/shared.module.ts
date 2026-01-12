import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    // aquí van tus componentes/pipes/directives compartidos
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    // exporta aquí lo compartido para que features lo puedan usar
  ],
})
export class SharedModule {}
