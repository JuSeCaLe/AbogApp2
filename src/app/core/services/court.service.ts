import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Court } from '../models/court.model';
import { environment } from '../../../environments/environment';

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
