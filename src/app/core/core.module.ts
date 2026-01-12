import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  providers: [
    // Deja vacío por ahora si tus services ya son providedIn: 'root'
    // Aquí solo pondrías providers globales si algún día hace falta
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule ya fue cargado. Importa CoreModule solo en AppModule.');
    }
  }
}
