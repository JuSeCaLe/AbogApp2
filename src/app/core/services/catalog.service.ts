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

  getProcessRoles(): Observable<CatalogItem[]> {
    return of([
      { id: 1, name: 'Demandante' },
      { id: 2, name: 'Demandado' },
      { id: 3, name: 'Avalista' },
      { id: 4, name: 'Deudor solidario' }
    ]);
  }
}
