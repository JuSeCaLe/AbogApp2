import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProcessType } from '../models/process-type.model';

@Injectable({ providedIn: 'root' })
export class ProcessTypeService {
  private readonly base = 'https://localhost:44341/api/TiposObligacion';

  private readonly _items$ = new BehaviorSubject<ProcessType[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): Observable<ProcessType[]> {
    return this.http.get<ProcessType[]>(this.base).pipe(
      tap(list => this._items$.next(list))
    );
  }

  getByIdFromApi(id: string) {
    return this.http.get<ProcessType>(`${this.base}/${id}`);
  }

  create(payload: ProcessType) {
    return this.http.post<ProcessType>(this.base, payload).pipe(
      tap(created => this._items$.next([created, ...this._items$.value]))
    );
  }

  update(id: string, payload: ProcessType) {
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
