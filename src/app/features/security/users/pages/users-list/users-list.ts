import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';

import { UsersService } from '../../../../../core/services/users.service';
import { RolesService } from '../../../../../core/services/roles.service';
import { User } from '../../../../../core/models/user.model';
import { Role } from '../../../../../core/models/role.model';

type UserRow = User & { roleNames: string };

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  filter = '';

  users$!: Observable<User[]>;
  roles$!: Observable<Role[]>;
  rows$!: Observable<UserRow[]>;

  displayedColumns: Array<'fullName' | 'email' | 'roles' | 'active' | 'actions'> =
    ['fullName', 'email', 'roles', 'active', 'actions'];

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users$ = this.usersService.users$;
    this.roles$ = this.rolesService.roles$;

    this.rows$ = combineLatest([this.users$, this.roles$]).pipe(
      map(([users, roles]) => {
        const roleMap = new Map(roles.map(r => [r.id, r.name]));
        const q = this.filter.trim().toLowerCase();

        const mapped = users.map(u => {
          const roleNames = u.roleIds.map(id => roleMap.get(id)).filter(Boolean).join(', ');
          return { ...u, roleNames: roleNames || '-' };
        });

        if (!q) return mapped;

        return mapped.filter(r =>
          `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.roleNames.toLowerCase().includes(q)
        );
      })
    );
  }

  goNew() { this.router.navigate(['/security/users/new']); }
  goEdit(id: string) { this.router.navigate(['/security/users', id]); }
  toggle(id: string) { this.usersService.toggleActive(id); }
}
