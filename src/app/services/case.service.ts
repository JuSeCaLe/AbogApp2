// src/app/services/case.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Case } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  private cases: Case[] = [
    {
      id: 1,
      process: { radicado: '001-2026', processType: 'Ordinario', court: 'Juzgado 1', city: 'Bogotá' },
      partiesInfo: [
        { person: 'Juan', processRole: 'Demandante' },
        { person: 'Ana', processRole: 'Demandado' }
      ],
      financialInfo: { capital: 1000000, obligations: 'Obligación ejemplo', fngFag: true },
      measures: { embargo: true, embargoDate: '2026-01-15', remanentEmbargo: false, remanentEntity: '' },
      stages: { paymentOrder: true, personalNotification: true },
      auction: { appraisalStatus: 'SI', auctionStatus: 'N/A' },
      closure: { terminationDate: '2026-12-31', terminationReason: 'Finalizado' }
    }
  ];

  private cases$ = new BehaviorSubject<Case[]>(this.cases);

  constructor() {}

  // Listar todos los casos
  getCases(): Observable<Case[]> {
    return this.cases$.asObservable();
  }

  // Obtener un caso por ID
  getCaseById(id: number): Observable<Case | undefined> {
    const c = this.cases.find(x => x.id === id);
    return of(c);
  }

  // Crear caso
  createCase(newCase: Case): Observable<Case> {
    newCase.id = this.cases.length + 1;
    this.cases.push(newCase);
    this.cases$.next(this.cases);
    return of(newCase);
  }

  // Editar caso
  updateCase(updatedCase: Case): Observable<Case> {
    const index = this.cases.findIndex(x => x.id === updatedCase.id);
    if (index !== -1) {
      this.cases[index] = updatedCase;
      this.cases$.next(this.cases);
    }
    return of(updatedCase);
  }
}
