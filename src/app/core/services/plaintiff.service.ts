import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Plaintiff } from '../models/plaintiff.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlaintiffsService {
  private apiBase = environment.apiUrl;

  private readonly _items$ = new BehaviorSubject<Plaintiff[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): Observable<Plaintiff[]> {
    return this.http.get<Plaintiff[]>(`${this.apiBase}/Demandante`).pipe(
      tap(list => this._items$.next(list))
    );
  }

  getByIdFromApi(id: string) {
    return this.http.get<Plaintiff>(`${this.apiBase}/Demandante/${id}`);
  }

  create(payload: Plaintiff) {
    return this.http.post<Plaintiff>(`${this.apiBase}/Demandante`, payload).pipe(
      tap(created => this._items$.next([created, ...this._items$.value]))
    );
  }

  update(id: string, payload: Plaintiff) {
    return this.http.put<void>(`${this.apiBase}/Demandante/${id}`, payload).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], ...payload };
        this._items$.next(curr);
      })
    );
  }

  toggleActive(id: string) {
    return this.http.patch<void>(`${this.apiBase}/Demandante/${id}/toggle-active`, {}).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], active: !curr[idx].active };
        this._items$.next(curr);
      })
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiBase}/Demandante/${id}`).pipe(
      tap(() => this._items$.next(this._items$.value.filter(x => x.id !== id)))
    );
  }
}
