import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Role } from '../models/role.model';

type ApiRole = { id: string; name: string };

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly base = 'https://localhost:44341/api/Roles';

  private readonly _roles$ = new BehaviorSubject<Role[]>([]);
  readonly roles$ = this._roles$.asObservable();

  constructor(private http: HttpClient) {}

  get snapshot(): Role[] {
    return this._roles$.value;
  }

  refresh(): Observable<Role[]> {
    return this.getAll().pipe(
      tap(list => this._roles$.next(list))
    );
  }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.base);
  }

  getById(id: string): Role | undefined {
    return this._roles$.value.find(r => r.id === id);
  }

  getByIdFromApi(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.base}/${id}`);
  }

  create(payload: Pick<Role, 'name' | 'description' | 'active'>): Observable<Role> {
    return this.http.post<Role>(this.base, payload).pipe(
      tap(created => this._roles$.next([created, ...this._roles$.value]))
    );
  }

  update(id: string, role: Pick<Role, 'name' | 'description' | 'active'>): Observable<void> {
      return this.http.put<void>(`${this.base}/${id}`, role).pipe(
      tap(() => this.refresh().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this._roles$.next(this._roles$.value.filter(r => r.id !== id)))
    );
  }

  //   toggleActive(id: string): void {
  //   const role = this.getById(id);
  //   if (!role) return;
  //   this.update(id, { name: role.name, description: role.description, active: !role.active });
  // }
}
