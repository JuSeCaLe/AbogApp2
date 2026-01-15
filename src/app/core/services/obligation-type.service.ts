import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObligationType } from '../models/obligation-type.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED: ObligationType[] = [
  { id: 'o-1', name: 'PAGARE', active: true, createdAt: nowIso() },
  { id: 'o-2', name: 'CONTRATO', active: true, createdAt: nowIso() },
  { id: 'o-3', name: 'LETRA', active: true, createdAt: nowIso() }
];

@Injectable({ providedIn: 'root' })
export class ObligationTypeService {
  private readonly _items$ = new BehaviorSubject<ObligationType[]>(SEED);
    readonly items$ = this._items$.asObservable();

    getById(id: string): ObligationType | undefined {
      return this._items$.value.find(x => x.id === id);
    }

    create(input: Omit<ObligationType, 'id' | 'createdAt'>): ObligationType {
      const item: ObligationType = { ...input, id: uid(), createdAt: nowIso() };
      this._items$.next([item, ...this._items$.value]);
      return item;
    }

    update(id: string, patch: Partial<Omit<ObligationType, 'id' | 'createdAt'>>): ObligationType {
      const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
      const updated = list.find(x => x.id === id);
      if (!updated) throw new Error('ObligationType not found');
      this._items$.next(list);
      return updated;
    }

    toggleActive(id: string) {
      const item = this.getById(id);
      if (!item) return;
      this.update(id, { active: !item.active });
    }
}
