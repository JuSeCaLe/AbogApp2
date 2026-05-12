import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Case } from '../models/case.model';
import { CaseProcessStage, CaseProceduralNote } from '../models/case.model';
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

  addProcessStage(caseId: number, stage: CaseProcessStage): Observable<Case | undefined> {
    const current = this.cases$.value;

    const updated = current.map(c => {
      if (c.id !== caseId) return c;

      return {
        ...c,
        processStages: [...(c.processStages ?? []), stage]
      };
    });

    this.cases$.next(updated);
    return this.getCaseById(caseId);
  }

  addProceduralNote(caseId: number, note: CaseProceduralNote): Observable<Case | undefined> {
    const current = this.cases$.value;

    const updated = current.map(c => {
      if (c.id !== caseId) return c;

      return {
        ...c,
        proceduralNotes: [...(c.proceduralNotes ?? []), note]
      };
    });

    this.cases$.next(updated);
    return this.getCaseById(caseId);
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
        partiesInfo: [
          {
            processRole: 'DEMANDADO',
            person: 'Juan Pérez Gómez | CC | 1012345678'
          }
        ],
        financialInfo: {
          capital: 15000000,
          obligations: 'Pagaré: PG-2025-001',
          fngFag: false
        },
        measures: {
          embargo: true,
          embargoDate: addDays(5)
        },
        stages: {
          paymentOrder: true,
          firstInstanceDate: addDays(20)
        },
        auction: {},
        closure: {},
        processStages: [
          {
            id: 1,
            createdAt: addDays(-10),
            stageName: 'Mandamiento de pago',
            subStageName: 'Admisión',
            observation: 'Se registra mandamiento de pago y se valida información inicial del expediente.'
          },
          {
            id: 2,
            createdAt: addDays(-5),
            stageName: 'Notificación',
            subStageName: 'Pendiente notificación personal',
            observation: 'Se encuentra pendiente la notificación del demandado.'
          }
        ],
        proceduralNotes: [
          {
            id: 1,
            createdAt: addDays(-3),
            text: 'Se revisó el estado del proceso y queda pendiente seguimiento a notificación.'
          }
        ]
      },
      {
        id: 2,
        process: {
          radicado: '76001234500220230002',
          processType: 'Ordinario',
          court: 'Juzgado 5',
          city: 'Cali'
        },
        partiesInfo: [
          {
            processRole: 'DEMANDADO',
            person: 'María Rodríguez López | CC | 52999888'
          }
        ],
        financialInfo: {
          capital: 5000000,
          obligations: 'Contrato: CT-2024-778',
          fngFag: false
        },
        measures: {},
        stages: {
          firstInstanceDate: addDays(20)
        },
        auction: {},
        closure: {},
        processStages: [
          {
            id: 1,
            createdAt: addDays(-12),
            stageName: 'Presentación demanda',
            subStageName: 'Radicación',
            observation: 'Demanda presentada y radicada correctamente.'
          }
        ],
        proceduralNotes: []
      },
      {
        id: 3,
        process: {
          radicado: '05001234500320230003',
          processType: 'Ejecutivo',
          court: 'Juzgado 3',
          city: 'Medellín'
        },
        partiesInfo: [
          {
            processRole: 'DEMANDADO',
            person: 'Carlos Alberto Mejía | CE | 88776655'
          }
        ],
        financialInfo: {
          capital: 9000000,
          obligations: 'Letra: LT-2023-459',
          fngFag: true
        },
        measures: {},
        stages: {},
        auction: {
          auctionDate: addDays(60)
        },
        closure: {},
        processStages: [],
        proceduralNotes: [
          {
            id: 1,
            createdAt: addDays(-1),
            text: 'Se solicitó verificación de medidas cautelares.'
          },
          {
            id: 2,
            createdAt: addDays(-1),
            text: 'Pendiente confirmar respuesta del despacho.'
          }
        ]
      }
    ];
  }
}
