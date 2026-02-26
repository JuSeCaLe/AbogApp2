import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

type ApiUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  active: boolean;
  createdAt: string;
  roles: string[];
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiBase = environment.apiUrl;
  // private readonly base = 'https://localhost:44341/api/Users';

  private readonly _users$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users$.asObservable();

  constructor(private http: HttpClient) {}

  private toVm(u: ApiUserDto): User {
    return {
      id: u.id,
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      email: u.email,
      roleIds: u.roles ?? [],  // role names
      active: u.active,
      createdAt: u.createdAt,
    };
  }

  // -------- read ----------
  refresh(): Observable<User[]> {
    return this.http.get<ApiUserDto[]>(`${this.apiBase}/Users`).pipe(
      map(list => list.map(x => this.toVm(x))),
      tap(list => this._users$.next(list))
    );
  }

  get snapshot(): User[] {
    return this._users$.value;
  }

  getById(id: string): User | undefined {
    return this._users$.value.find(u => u.id === id);
  }

  getByIdFromApi(id: string): Observable<User> {
    return this.http.get<ApiUserDto>(`${this.apiBase}/Users/${id}`).pipe(
      map(x => this.toVm(x))
    );
  }

  // -------- create ----------
  create(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleIds: string[]; // role names
    active: boolean;
  }): Observable<User> {
    return this.http.post<ApiUserDto>(`${this.apiBase}/Users`, {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      // userName lo puede construir el back; si es requerido por tu DTO, lo mandamos:
      userName: input.email,
      password: input.password,
      active: input.active,
      roles: input.roleIds ?? [],
    }).pipe(
      map(x => this.toVm(x)),
      tap(created => this._users$.next([created, ...this._users$.value]))
    );
  }

  // -------- update (user + roles) ----------
  update(id: string, patch: Partial<User> & { roleIds?: string[] }): Observable<void> {
    const current = this.getById(id);

    const firstName = patch.firstName ?? current?.firstName ?? '';
    const lastName = patch.lastName ?? current?.lastName ?? '';
    const email = patch.email ?? current?.email ?? '';
    const active = patch.active ?? current?.active ?? true;
    const roles = patch.roleIds ?? current?.roleIds ?? [];

    const updateUser$ = this.http.put<void>(`${this.apiBase}/Users/${id}`, {
      email,
      firstName,
      lastName,
      userName: email,
      active,
    });

    const setRoles$ = this.http.put<void>(`${this.apiBase}/Users/${id}/roles`, {
      roles,
    });

    return updateUser$.pipe(
      switchMap(() => setRoles$),
      tap(() => {
        const curr = this._users$.value.slice();
        const idx = curr.findIndex(u => u.id === id);
        if (idx >= 0) {
          curr[idx] = {
            ...curr[idx],
            ...patch,
            firstName,
            lastName,
            email,
            active,
            roleIds: roles,
          };
          this._users$.next(curr);
        }
      })
    );
  }

  // -------- delete (hard) ----------
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/Users/${id}`).pipe(
      tap(() => this._users$.next(this._users$.value.filter(u => u.id !== id)))
    );
  }
}
