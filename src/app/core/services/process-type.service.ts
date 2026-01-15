import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProcessType } from '../models/process-type.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED: ProcessType[] = [
  { id: 'o-1', name: 'EJECUTIVO SINGULAR', active: true, createdAt: nowIso() },
  { id: 'o-2', name: 'EJECUTIVO HIPOTECARIO', active: true, createdAt: nowIso() },
  { id: 'o-3', name: 'MIXTO', active: true, createdAt: nowIso() },
  { id: 'o-4', name: 'PRENDARIO', active: true, createdAt: nowIso() },
  { id: 'o-5', name: 'RESTITUCIÓN', active: true, createdAt: nowIso() },
  { id: 'o-6', name: 'LEASING', active: true, createdAt: nowIso() }
];

@Injectable({ providedIn: 'root' })
export class ProcessTypeService {
  private readonly _items$ = new BehaviorSubject<ProcessType[]>(SEED);
    readonly items$ = this._items$.asObservable();

    getById(id: string): ProcessType | undefined {
      return this._items$.value.find(x => x.id === id);
    }

    create(input: Omit<ProcessType, 'id' | 'createdAt'>): ProcessType {
      const item: ProcessType = { ...input, id: uid(), createdAt: nowIso() };
      this._items$.next([item, ...this._items$.value]);
      return item;
    }

    update(id: string, patch: Partial<Omit<ProcessType, 'id' | 'createdAt'>>): ProcessType {
      const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
      const updated = list.find(x => x.id === id);
      if (!updated) throw new Error('ProcessType not found');
      this._items$.next(list);
      return updated;
    }

    toggleActive(id: string) {
      const item = this.getById(id);
      if (!item) return;
      this.update(id, { active: !item.active });
    }
}
