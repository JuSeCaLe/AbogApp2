import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from '../../../environments/environment';

type ApiRole = { id: string; name: string };

@Injectable({ providedIn: 'root' })
export class RolesService {
  private apiBase = environment.apiUrl;

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
    return this.http.get<Role[]>(`${this.apiBase}/Roles`);
  }

  getById(id: string): Role | undefined {
    return this._roles$.value.find(r => r.id === id);
  }

  getByIdFromApi(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiBase}/Roles/${id}`);
  }

  create(payload: Pick<Role, 'name' | 'description' | 'active' | 'isDemandante'>): Observable<Role> {
    return this.http.post<Role>(`${this.apiBase}/Roles`, payload).pipe(
      tap(created => this._roles$.next([created, ...this._roles$.value]))
    );
  }

  update(id: string, role: Pick<Role, 'name' | 'description' | 'active' | 'isDemandante'>): Observable<void> {
      return this.http.put<void>(`${this.apiBase}/Roles/${id}`, role).pipe(
      tap(() => this.refresh().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/Roles/${id}`).pipe(
      tap(() => this._roles$.next(this._roles$.value.filter(r => r.id !== id)))
    );
  }

  //   toggleActive(id: string): void {
  //   const role = this.getById(id);
  //   if (!role) return;
  //   this.update(id, { name: role.name, description: role.description, active: !role.active });
  // }
}
