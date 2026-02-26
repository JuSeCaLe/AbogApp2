import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ObligationType } from '../models/obligation-type.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ObligationTypeService {
  private apiBase = environment.apiUrl;
  //private readonly base = 'https://localhost:44341/api/TiposObligacion';

  private readonly _items$ = new BehaviorSubject<ObligationType[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): Observable<ObligationType[]> {
    return this.http.get<ObligationType[]>(`${this.apiBase}/TiposObligacion`).pipe(
      tap(list => this._items$.next(list))
    );
  }

  getByIdFromApi(id: string) {
    return this.http.get<ObligationType>(`${this.apiBase}/TiposObligacion/${id}`);
  }

  create(payload: ObligationType) {
    return this.http.post<ObligationType>(`${this.apiBase}/TiposObligacion`, payload).pipe(
      tap(created => this._items$.next([created, ...this._items$.value]))
    );
  }

  update(id: string, payload: ObligationType) {
    return this.http.put<void>(`${this.apiBase}/TiposObligacion/${id}`, payload).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], ...payload };
        this._items$.next(curr);
      })
    );
  }

  toggleActive(id: string) {
    return this.http.patch<void>(`${this.apiBase}/TiposObligacion/${id}/toggle-active`, {}).pipe(
      tap(() => {
        const curr = this._items$.value.slice();
        const idx = curr.findIndex(x => x.id === id);
        if (idx >= 0) curr[idx] = { ...curr[idx], active: !curr[idx].active };
        this._items$.next(curr);
      })
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiBase}/TiposObligacion/${id}`).pipe(
      tap(() => this._items$.next(this._items$.value.filter(x => x.id !== id)))
    );
  }
}
