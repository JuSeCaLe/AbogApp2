import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CatalogItem {
  id: number;
  name: string;
}

export interface CatalogSubStage {
  id: number;
  name: string;
}

export interface CatalogStage {
  id: number;
  name: string;
  subStages: CatalogSubStage[];
}

export interface CatalogProcessType {
  id: number;
  name: string;
  stages: CatalogStage[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly baseUrl = environment.apiUrl;
  private stageCache$?: Observable<CatalogProcessType[]>;

  constructor(private http: HttpClient) {}

  getProcessRoles(): Observable<CatalogItem[]> {
    return of([
      { id: 1, name: 'Demandante' },
      { id: 2, name: 'Demandado' },
      { id: 3, name: 'Avalista' },
      { id: 4, name: 'Deudor solidario' }
    ]);
  }

  getStageCatalog(): Observable<CatalogProcessType[]> {
    if (!this.stageCache$) {
      this.stageCache$ = this.http
        .get<CatalogProcessType[]>(`${this.baseUrl}/catalog`)
        .pipe(shareReplay(1));
    }
    return this.stageCache$;
  }
}
