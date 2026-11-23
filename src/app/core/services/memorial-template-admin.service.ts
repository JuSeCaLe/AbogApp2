import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { MemorialTemplateAdmin } from '../models/memorial-template-admin.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MemorialTemplateAdminService {
  private readonly baseUrl = `${environment.apiUrl}/memorial-templates`;

  private readonly _items$ = new BehaviorSubject<MemorialTemplateAdmin[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): Observable<MemorialTemplateAdmin[]> {
    return this.http.get<MemorialTemplateAdmin[]>(this.baseUrl).pipe(
      tap(list => this._items$.next(list))
    );
  }

  create(name: string, file: File): Observable<MemorialTemplateAdmin> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return this.http.post<MemorialTemplateAdmin>(this.baseUrl, formData).pipe(
      tap(created => this._items$.next([...this._items$.value, created]))
    );
  }

  update(id: number, name: string, active: boolean): Observable<MemorialTemplateAdmin> {
    return this.http.put<MemorialTemplateAdmin>(`${this.baseUrl}/${id}`, { name, active }).pipe(
      tap(updated => this.replaceInList(updated))
    );
  }

  replaceFile(id: number, file: File): Observable<MemorialTemplateAdmin> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MemorialTemplateAdmin>(`${this.baseUrl}/${id}/replace`, formData).pipe(
      tap(updated => this.replaceInList(updated))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this._items$.next(this._items$.value.filter(x => x.id !== id)))
    );
  }

  // El backend exige rol admin, así que no sirve un <a href> plano (no lleva
  // el Bearer token) — se pide como blob y se dispara la descarga a mano.
  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }

  private replaceInList(updated: MemorialTemplateAdmin): void {
    const curr = this._items$.value.slice();
    const idx = curr.findIndex(x => x.id === updated.id);
    if (idx >= 0) curr[idx] = updated;
    this._items$.next(curr);
  }
}
