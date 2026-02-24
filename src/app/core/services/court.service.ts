// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { Court } from '../../core/models/court.model';

// function nowIso() { return new Date().toISOString(); }
// function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

// const SEED: Court[] = [
//   { id: 'c-1', name: 'Juzgado 01 Civil Municipal', city: 'Bogotá', active: true, createdAt: nowIso() },
//   { id: 'c-2', name: 'Juzgado 10 Civil del Circuito', city: 'Medellín', active: true, createdAt: nowIso() },
// ];

// @Injectable({ providedIn: 'root' })
// export class CourtsService {
//   private readonly _items$ = new BehaviorSubject<Court[]>(SEED);
//   readonly items$ = this._items$.asObservable();

//   getCourts(): Observable<Court[]> {
//     return of(this._items$.value);
//   }

//   getById(id: string): Court | undefined {
//     return this._items$.value.find(x => x.id === id);
//   }

//   create(input: Omit<Court, 'id' | 'createdAt'>): Court {
//     const item: Court = { ...input, id: uid(), createdAt: nowIso() };
//     this._items$.next([item, ...this._items$.value]);
//     return item;
//   }

//   update(id: string, patch: Partial<Omit<Court, 'id' | 'createdAt'>>): Court {
//     const list = this._items$.value.map(x => x.id === id ? { ...x, ...patch } : x);
//     const updated = list.find(x => x.id === id);
//     if (!updated) throw new Error('Court not found');
//     this._items$.next(list);
//     return updated;
//   }

//   toggleActive(id: string) {
//     const item = this.getById(id);
//     if (!item) return;
//     this.update(id, { active: !item.active });
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Court } from '../models/court.model';

@Injectable({ providedIn: 'root' })
export class CourtsService {
  private readonly base = 'https://localhost:44341/api/Juzgados';

  private readonly _items$ = new BehaviorSubject<Court[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): Observable<Court[]> {
    return this.http.get<Court[]>(this.base).pipe(
      tap(list => this._items$.next(list))
    );
  }

  getByIdFromApi(id: string) {
    return this.http.get<Court>(`${this.base}/${id}`);
  }

  create(payload: Court) {
    return this.http.post<Court>(this.base, payload).pipe(
      tap(created => this._items$.next([created, ...this._items$.value]))
    );
  }

  update(id: string, payload: Court) {
    return this.http.put<void>(`${this.base}/${id}`, payload).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], ...payload };
        this._items$.next(curr);
      })
    );
  }

  toggleActive(id: string) {
    return this.http.patch<void>(`${this.base}/${id}/toggle-active`, {}).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], active: !curr[idx].active };
        this._items$.next(curr);
      })
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._items$.next(this._items$.value.filter(x => x.id !== id)))
    );
  }
}
