import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { UsersService } from '../../../../../core/services/users.service';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  users$!: Observable<User[]>;
  filtered$!: Observable<User[]>;
  search = new FormControl<string>('', { nonNullable: true });

  displayedColumns: string[] = ['fullName', 'email', 'roles', 'createdAt','active', 'actions'];

  loading = false;
  error = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users$ = this.usersService.users$;
    this.reload();

    this.filtered$ = combineLatest([
      this.users$,
      this.search.valueChanges.pipe(startWith(this.search.value)),
    ]).pipe(
      map(([users, q]) => {
        const query = (q ?? '').trim().toLowerCase();
        if (!query) return users;

        return users.filter(u => {
          const fullName = `${u.firstName} ${u.lastName}`.trim().toLowerCase();
          const email = (u.email ?? '').toLowerCase();
          const roles = (u.roleIds ?? []).join(', ').toLowerCase();
          return fullName.includes(query) || email.includes(query) || roles.includes(query);
        });
      })
    );
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    this.usersService.refresh().subscribe({
      next: () => (this.loading = false),
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'No se pudieron cargar los usuarios';
      },
    });
  }

  goNew(): void {
    this.router.navigate(['/security/users/new']);
  }

  goEdit(id: string): void {
    this.router.navigate(['/security/users', id]);
  }

  toggleActive(u: User): void {
    this.usersService.update(u.id, { active: !u.active }).subscribe({
      error: (e) => (this.error = e?.error?.message || 'No se pudo cambiar el estado'),
    });
  }

  remove(u: User): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar usuario',
        message:
          `¿Seguro que deseas eliminar a ${u.firstName} ${u.lastName} (${u.email})?\n` +
          `Esta acción NO se puede deshacer.`,
      },
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;

      this.usersService.delete(u.id).subscribe({
        error: (e) => (this.error = e?.error?.message || 'No se pudo eliminar el usuario'),
      });
    });
  }

  trackById(_: number, u: User) {
    return u.id;
  }
}
