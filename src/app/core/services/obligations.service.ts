import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Obligation, ObligationType } from '../../core/models/obligation.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED: Obligation[] = [
  { id: 'o-1', type: 'PAGARE', number: 'PG-2025-001', active: true, createdAt: nowIso() },
  { id: 'o-2', type: 'CONTRATO', number: 'CT-2024-778', active: true, createdAt: nowIso() },
];

@Injectable({ providedIn: 'root' })
export class ObligationsService {
  private readonly _items$ = new BehaviorSubject<Obligation[]>(SEED);
  readonly items$ = this._items$.asObservable();

  readonly types: ObligationType[] = ['CONTRATO', 'PAGARE', 'OBLIGACION', 'LETRA'];

  getById(id: string): Obligation | undefined {
    return this._items$.value.find(x => x.id === id);
  }

  create(input: Omit<Obligation, 'id' | 'createdAt'>): Obligation {
    const item: Obligation = { ...input, id: uid(), createdAt: nowIso() };
    this._items$.next([item, ...this._items$.value]);
    return item;
  }

  update(id: string, patch: Partial<Omit<Obligation, 'id' | 'createdAt'>>): Obligation {
    const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
    const updated = list.find(x => x.id === id);
    if (!updated) throw new Error('Obligation not found');
    this._items$.next(list);
    return updated;
  }

  toggleActive(id: string) {
    const item = this.getById(id);
    if (!item) return;
    this.update(id, { active: !item.active });
  }
}
