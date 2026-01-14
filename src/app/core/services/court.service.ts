import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Court } from '../../core/models/court.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED: Court[] = [
  { id: 'c-1', name: 'Juzgado 01 Civil Municipal', city: 'Bogotá', active: true, createdAt: nowIso() },
  { id: 'c-2', name: 'Juzgado 10 Civil del Circuito', city: 'Medellín', active: true, createdAt: nowIso() },
];

@Injectable({ providedIn: 'root' })
export class CourtsService {
  private readonly _items$ = new BehaviorSubject<Court[]>(SEED);
  readonly items$ = this._items$.asObservable();

  getById(id: string): Court | undefined {
    return this._items$.value.find(x => x.id === id);
  }

  create(input: Omit<Court, 'id' | 'createdAt'>): Court {
    const item: Court = { ...input, id: uid(), createdAt: nowIso() };
    this._items$.next([item, ...this._items$.value]);
    return item;
  }

  update(id: string, patch: Partial<Omit<Court, 'id' | 'createdAt'>>): Court {
    const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
    const updated = list.find(x => x.id === id);
    if (!updated) throw new Error('Court not found');
    this._items$.next(list);
    return updated;
  }

  toggleActive(id: string) {
    const item = this.getById(id);
    if (!item) return;
    this.update(id, { active: !item.active });
  }
}
