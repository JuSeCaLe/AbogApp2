// src/app/services/case.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Case } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private cases$ = new BehaviorSubject<Case[]>(this.generateCases());

  // ===============================
  // PUBLIC API
  // ===============================

  getCases(): Observable<Case[]> {
    return of(this.enrich(this.cases$.value));
  }

  getCaseById(id: number): Observable<Case | undefined> {
    const found = this.cases$.value.find(c => c.id === id);
    return of(found ? this.enrich([found])[0] : undefined);
  }

  searchByRadicado(radicado: string): Observable<Case[]> {
    const term = radicado.trim();
    const filtered = this.cases$.value.filter(c =>
      c.process.radicado.includes(term)
    );
    return of(this.enrich(filtered));
  }

  createCase(c: Case): Observable<Case> {
    const current = this.cases$.value;
    c.id = Math.max(...current.map(x => x.id), 0) + 1;
    this.cases$.next([...current, c]);
    return of(c);
  }

  updateCase(c: Case): Observable<Case> {
    const updated = this.cases$.value.map(x => x.id === c.id ? c : x);
    this.cases$.next(updated);
    return of(c);
  }

  // ===============================
  // ALERT LOGIC
  // ===============================

  private enrich(cases: Case[]): Case[] {
    return cases.map(c => ({
      ...c,
      alertColor: this.getAlertColor(c),
      nextDueDate: this.getNextDate(c)
    }));
  }

  private getNextDate(c: Case): Date | null {
    const dates: string[] = [];

    if (c.measures?.embargoDate) dates.push(c.measures.embargoDate);
    if (c.stages?.firstInstanceDate) dates.push(c.stages.firstInstanceDate);
    if (c.stages?.secondInstanceDate) dates.push(c.stages.secondInstanceDate);
    if (c.auction?.auctionDate) dates.push(c.auction.auctionDate);
    if (c.auction?.awardDate) dates.push(c.auction.awardDate);
    if (c.closure?.deliveryDate) dates.push(c.closure.deliveryDate);

    if (!dates.length) return null;

    return new Date(
      dates.map(d => new Date(d).getTime()).sort((a, b) => a - b)[0]
    );
  }

  private getAlertColor(c: Case): 'red' | 'orange' | 'green' {
    const next = this.getNextDate(c);
    if (!next) return 'green';

    const days = Math.floor(
      (next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 7) return 'red';
    if (days <= 30) return 'orange';
    return 'green';
  }

  // ===============================
  // DATA GENERATOR
  // ===============================

  private generateCases(): Case[] {
    const today = new Date();

    const addDays = (d: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      return date.toISOString().substring(0, 10);
    };

    return [
      {
        id: 1,
        process: {
          radicado: '11001234500120230001',
          processType: 'Ejecutivo',
          court: 'Juzgado 1',
          city: 'Bogotá'
        },
        partiesInfo: [],
        financialInfo: { capital: 15000000, obligations: 'Hipotecario', fngFag: false },
        measures: { embargo: true, embargoDate: addDays(5) },
        stages: { paymentOrder: true },
        auction: {},
        closure: {}
      },
      {
        id: 2,
        process: {
          radicado: '76001234500220230002',
          processType: 'Ordinario',
          court: 'Juzgado 5',
          city: 'Cali'
        },
        partiesInfo: [],
        financialInfo: { capital: 5000000 },
        measures: {},
        stages: { firstInstanceDate: addDays(20) },
        auction: {},
        closure: {}
      },
      {
        id: 3,
        process: {
          radicado: '05001234500320230003',
          processType: 'Ejecutivo',
          court: 'Juzgado 3',
          city: 'Medellín'
        },
        partiesInfo: [],
        financialInfo: { capital: 9000000 },
        measures: {},
        stages: {},
        auction: { auctionDate: addDays(60) },
        closure: {}
      },
      {
        id: 4,
        process: {
          radicado: '08001234500420230004',
          processType: 'Ordinario',
          court: 'Juzgado 2',
          city: 'Barranquilla'
        },
        partiesInfo: [],
        financialInfo: { capital: 3000000 },
        measures: {},
        stages: {},
        auction: {},
        closure: {}
      },
      {
        id: 5,
        process: {
          radicado: '08001234500420260004',
          processType: 'Ordinario',
          court: 'Juzgado 2',
          city: 'Barranquilla'
        },
        partiesInfo: [],
        financialInfo: { capital: 3000000 },
        measures: {},
        stages: {},
        auction: {},
        closure: {}
      },
      {
        id: 6,
        process: {
          radicado: '08001234500420260014',
          processType: 'Ordinario',
          court: 'Juzgado 1',
          city: 'Bogotá'
        },
        partiesInfo: [],
        financialInfo: { capital: 3000000 },
        measures: {},
        stages: {},
        auction: {},
        closure: {}
      }
    ];
  }
}
