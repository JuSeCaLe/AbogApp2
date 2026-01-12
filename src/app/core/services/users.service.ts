import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

function nowIso() { return new Date().toISOString(); }
function uid() { return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

const SEED_USERS: User[] = [
  {
    id: 'u-1',
    firstName: 'Juan',
    lastName: 'Sepúlveda',
    email: 'juan@example.com',
    roleIds: ['r-admin'],
    active: true,
    createdAt: nowIso(),
  },
  {
    id: 'u-2',
    firstName: 'María',
    lastName: 'Gómez',
    email: 'maria@example.com',
    roleIds: ['r-lawyer'],
    active: true,
    createdAt: nowIso(),
  }
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly _users$ = new BehaviorSubject<User[]>(SEED_USERS);
  readonly users$ = this._users$.asObservable();

  getSnapshot(): User[] {
    return this._users$.value;
  }

  getById(id: string): User | undefined {
    return this._users$.value.find(u => u.id === id);
  }

  create(input: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = { ...input, id: uid(), createdAt: nowIso() };
    this._users$.next([user, ...this._users$.value]);
    return user;
  }

  update(id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>): User {
    const users = this._users$.value.map(u => u.id === id ? { ...u, ...patch } : u);
    const updated = users.find(u => u.id === id);
    if (!updated) throw new Error('User not found');
    this._users$.next(users);
    return updated;
  }

  toggleActive(id: string): void {
    const user = this.getById(id);
    if (!user) return;
    this.update(id, { active: !user.active });
  }
}
