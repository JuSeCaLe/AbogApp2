import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Case } from '../models/case.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private cases$ = new BehaviorSubject<Case[]>(this.generateCases());

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
      c.process?.radicado?.includes(term)
    );
    return of(this.enrich(filtered));
  }

  createCase(c: Case): Observable<Case> {
    const current = this.cases$.value;

    const nextId =
      current.length > 0 ? Math.max(...current.map(x => x.id), 0) + 1 : 1;

    c.id = nextId;

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
    if ((c.stages as any)?.firstInstanceDate) dates.push((c.stages as any).firstInstanceDate);
    if ((c.stages as any)?.secondInstanceDate) dates.push((c.stages as any).secondInstanceDate);
    if ((c.auction as any)?.auctionDate) dates.push((c.auction as any).auctionDate);
    if ((c.auction as any)?.awardDate) dates.push((c.auction as any).awardDate);
    if ((c.closure as any)?.deliveryDate) dates.push((c.closure as any).deliveryDate);

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
          city: 'Bogotá',
          filedAt: addDays(-60),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 15000000, obligations: 'Hipotecario', fngFag: false } as any,
        measures: { embargo: true, embargoDate: addDays(5) } as any,
        stages: { paymentOrder: true } as any,
        auction: {} as any,
        closure: {} as any
      },
      {
        id: 2,
        process: {
          radicado: '76001234500220230002',
          processType: 'Ordinario',
          court: 'Juzgado 5',
          city: 'Cali',
          filedAt: addDays(-30),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 5000000 } as any,
        measures: {} as any,
        stages: { firstInstanceDate: addDays(20) } as any,
        auction: {} as any,
        closure: {} as any
      },
      {
        id: 3,
        process: {
          radicado: '05001234500320230003',
          processType: 'Ejecutivo',
          court: 'Juzgado 3',
          city: 'Medellín',
          filedAt: addDays(-10),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 9000000 } as any,
        measures: {} as any,
        stages: {} as any,
        auction: { auctionDate: addDays(60) } as any,
        closure: {} as any
      },
      {
        id: 4,
        process: {
          radicado: '08001234500420230004',
          processType: 'Ordinario',
          court: 'Juzgado 2',
          city: 'Barranquilla',
          filedAt: addDays(-5),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 3000000 } as any,
        measures: {} as any,
        stages: {} as any,
        auction: {} as any,
        closure: {} as any
      },
      {
        id: 5,
        process: {
          radicado: '08001234500420260004',
          processType: 'Ordinario',
          court: 'Juzgado 2',
          city: 'Barranquilla',
          filedAt: addDays(-1),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 3000000 } as any,
        measures: {} as any,
        stages: {} as any,
        auction: {} as any,
        closure: {} as any
      },
      {
        id: 6,
        process: {
          radicado: '08001234500420260014',
          processType: 'Ordinario',
          court: 'Juzgado 1',
          city: 'Bogotá',
          filedAt: addDays(-2),
          observations: ''
        } as any,
        partiesInfo: [],
        financialInfo: { capital: 3000000 } as any,
        measures: {} as any,
        stages: {} as any,
        auction: {} as any,
        closure: {} as any
      }
    ];
  }
}
