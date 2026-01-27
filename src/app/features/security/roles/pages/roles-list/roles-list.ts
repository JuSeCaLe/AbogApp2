import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { RolesService } from '../../../../../core/services/roles.service';
import { Role } from '../../../../../core/models/role.model';

@Component({
  selector: 'app-roles-list',
  standalone: false,
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.css',
})
export class RolesList implements OnInit {
  // fuente principal: stream del service
  roles$!: Observable<Role[]>;

  // filtro reactivo (sin tocar el subject)
  search = new FormControl<string>('', { nonNullable: true });
  filtered$!: Observable<Role[]>;

  // si usas mat-table
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'active', 'actions'];

  loading = false;
  error = '';

  constructor(
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roles$ = this.rolesService.roles$;

    // carga inicial
    this.reload();

    // filtrado reactivo
    this.filtered$ = combineLatest([
      this.roles$,
      this.search.valueChanges.pipe(startWith(this.search.value)),
    ]).pipe(
      map(([roles, q]) => {
        const query = (q ?? '').trim().toLowerCase();
        if (!query) return roles;

        return roles.filter(r =>
          (r.name ?? '').toLowerCase().includes(query) ||
          (r.description ?? '').toLowerCase().includes(query)
        );
      })
    );
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    this.rolesService.refresh().subscribe({
      next: () => (this.loading = false),
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'No se pudieron cargar los roles';
      },
    });
  }

  goNew(): void {
    this.router.navigate(['/security/roles/new']);
  }

  goEdit(role: Role): void {
    this.router.navigate(['/security/roles', role.id]);
  }

  remove(role: Role): void {
    this.rolesService.delete(role.id).subscribe({
      next: () => {},
      error: (e) => (this.error = e?.error?.message || 'No se pudo eliminar el rol'),
    });
  }

  // toggle(role: Role): void {
  //   // si ya tienes toggleActive en el service:
  //   this.rolesService.toggleActive(role).subscribe({
  //     next: () => {},
  //     error: (e) => (this.error = e?.error?.message || 'No se pudo cambiar el estado'),
  //   });
  // }

  trackById(_: number, r: Role) {
    return r.id;
  }
}
