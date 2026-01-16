import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Plaintiff } from '../../core/models/plaintiff.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED: Plaintiff[] = [
  { id: 'p-1', name: 'Bancolombia', active: true, createdAt: nowIso() },
  { id: 'p-2', name: 'Banco de Bogotá', active: true, createdAt: nowIso() },
];

@Injectable({ providedIn: 'root' })
export class PlaintiffsService {
  private readonly _items$ = new BehaviorSubject<Plaintiff[]>(SEED);
  readonly items$ = this._items$.asObservable();

  getPlaintiffs(): Observable<Plaintiff[]> {
    return of(this._items$.value);
  }

  getById(id: string): Plaintiff | undefined {
    return this._items$.value.find(x => x.id === id);
  }

  create(input: Omit<Plaintiff, 'id' | 'createdAt'>): Plaintiff {
    const item: Plaintiff = { ...input, id: uid(), createdAt: nowIso() };
    this._items$.next([item, ...this._items$.value]);
    return item;
  }

  update(id: string, patch: Partial<Omit<Plaintiff, 'id' | 'createdAt'>>): Plaintiff {
    const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
    const updated = list.find(x => x.id === id);
    if (!updated) throw new Error('Plaintiff not found');
    this._items$.next(list);
    return updated;
  }

  toggleActive(id: string) {
    const item = this.getById(id);
    if (!item) return;
    this.update(id, { active: !item.active });
  }
}
