import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CatalogItem {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  // getProcessTypes(): Observable<CatalogItem[]> {
  //   return of([
  //     { id: 1, name: 'Ejecutivo' },
  //     { id: 2, name: 'Ordinario' },
  //     { id: 3, name: 'Hipotecario' },
  //     { id: 4, name: 'Laboral' }
  //   ]);
  // }

  // getCourts(): Observable<CatalogItem[]> {
  //   return of([
  //     { id: 1, name: 'Juzgado 1 Civil' },
  //     { id: 2, name: 'Juzgado 5 Civil' },
  //     { id: 3, name: 'Juzgado 10 Municipal' }
  //   ]);
  // }

  getProcessRoles(): Observable<CatalogItem[]> {
    return of([
      { id: 1, name: 'Demandante' },
      { id: 2, name: 'Demandado' },
      { id: 3, name: 'Avalista' },
      { id: 4, name: 'Deudor solidario' }
    ]);
  }
}
