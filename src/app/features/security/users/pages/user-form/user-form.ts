import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UsersService } from '../../../../../core/services/users.service';
import { RolesService } from '../../../../../core/services/roles.service';
import { Role } from '../../../../../core/models/role.model';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  id: string | null = null;
  isEdit = false;

  form!: FormGroup;

  // Roles
  roles$!: Observable<Role[]>;
  roleSearch = new FormControl<string>('', { nonNullable: true });
  filteredRoles$!: Observable<Role[]>;

  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      // aquí van NOMBRES de roles (string[])
      roleIds: [<string[]>[], [Validators.required]],
      active: [true],
      password: [''],
    });

    // cargar roles
    this.roles$ = this.rolesService.roles$;
    this.rolesService.refresh().subscribe();

    // filtro de roles
    this.filteredRoles$ = combineLatest([
      this.roles$,
      this.roleSearch.valueChanges.pipe(startWith(this.roleSearch.value)),
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

    // modo edit/create
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit) {
      // password NO aplica en editar
      this.passwordCtrl?.clearValidators();
      this.passwordCtrl?.updateValueAndValidity();

      // cache -> api fallback
      const cached = this.id ? this.usersService.getById(this.id) : undefined;
      if (cached) {
        this.patch(cached);
      } else if (this.id) {
        this.loading = true;
        this.usersService.getByIdFromApi(this.id).subscribe({
          next: (u) => {
            this.loading = false;
            this.patch(u);
          },
          error: () => {
            this.loading = false;
            this.router.navigate(['/security/users']);
          },
        });
      }
    } else {
      // create: password requerido
      this.passwordCtrl?.setValidators([Validators.required, Validators.minLength(6)]);
      this.passwordCtrl?.updateValueAndValidity();
    }
  }

  private patch(user: User) {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleIds: user.roleIds ?? [],
      active: user.active,
    });
  }

  // chips helpers
  get selectedRoleNames(): string[] {
    return (this.roleIdsCtrl?.value as string[]) ?? [];
  }

  removeRole(roleName: string) {
    const current = new Set(this.selectedRoleNames);
    current.delete(roleName);
    this.roleIdsCtrl?.setValue(Array.from(current));
    this.roleIdsCtrl?.markAsDirty();
    this.roleIdsCtrl?.markAsTouched();
  }

  clearRoleSearch() {
    this.roleSearch.setValue('');
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const value = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.usersService.update(this.id, {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        roleIds: value.roleIds,
        active: value.active,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/security/users']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo guardar el usuario';
        },
      });
    } else {
      this.usersService.create({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        roleIds: value.roleIds,
        active: value.active,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/security/users']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo crear el usuario';
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/security/users']);
  }

  // getters
  get firstNameCtrl() { return this.form.get('firstName'); }
  get lastNameCtrl() { return this.form.get('lastName'); }
  get emailCtrl() { return this.form.get('email'); }
  get roleIdsCtrl() { return this.form.get('roleIds'); }
  get passwordCtrl() { return this.form.get('password'); }
}
