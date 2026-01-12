import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../../../../../core/services/roles.service';
import { Role } from '../../../../../core/models/role.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-roles-list',
  standalone: false,
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.css',
})
export class RolesList {
  filter = '';

  roles$!: Observable<Role[]>;
  filtered$!: Observable<Role[]>;

  displayedColumns: Array<keyof Role | 'actions'> = [
    'name',
    'description',
    'active',
    'actions'
  ];

  constructor(
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roles$ = this.rolesService.roles$;

    this.filtered$ = this.roles$.pipe(
      map(list => {
        const q = this.filter.trim().toLowerCase();
        if (!q) return list;
        return list.filter(r =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
        );
      })
    );
  }

  goNew() {
    this.router.navigate(['/security/roles/new']);
  }

  goEdit(id: string) {
    this.router.navigate(['/security/roles', id]);
  }

  toggle(id: string) {
    this.rolesService.toggleActive(id);
  }
}
