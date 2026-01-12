import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../models/role.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED_ROLES: Role[] = [
  { id: 'r-admin', name: 'Administrador', description: 'Acceso total', active: true, createdAt: nowIso() },
  { id: 'r-lawyer', name: 'Abogado', description: 'Gestión de casos', active: true, createdAt: nowIso() },
  { id: 'r-assistant', name: 'Asistente', description: 'Apoyo operativo', active: true, createdAt: nowIso() },
];

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly _roles$ = new BehaviorSubject<Role[]>(SEED_ROLES);
  readonly roles$ = this._roles$.asObservable();

  getSnapshot(): Role[] {
    return this._roles$.value;
  }

  getById(id: string): Role | undefined {
    return this._roles$.value.find(r => r.id === id);
  }

  create(input: Omit<Role, 'id' | 'createdAt'>): Role {
    const role: Role = { ...input, id: uid(), createdAt: nowIso() };
    this._roles$.next([role, ...this._roles$.value]);
    return role;
  }

  update(id: string, patch: Partial<Omit<Role, 'id' | 'createdAt'>>): Role {
    const roles = this._roles$.value.map(r => r.id === id ? { ...r, ...patch } : r);
    const updated = roles.find(r => r.id === id);
    if (!updated) throw new Error('Role not found');
    this._roles$.next(roles);
    return updated;
  }

  toggleActive(id: string): void {
    const role = this.getById(id);
    if (!role) return;
    this.update(id, { active: !role.active });
  }
}
