import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../../core/services/roles.service';
import { Role } from '../../../../../core/models/role.model';

const SYSTEM_ROLE_NAMES = ['r-admin', 'r-user'];

@Component({
  selector: 'app-role-form',
  standalone: false,
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm implements OnInit {
  id: string | null = null;
  isEdit = false;

  form!: FormGroup;

  isSystemRole = false;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      active: [true],
      isDemandante: [false],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const cached = this.rolesService.getById(this.id);

      if (cached) {
        this.patch(cached);
        return;
      }

      // ✅ 2) si no está en cache, tráelo del API
      this.rolesService.getByIdFromApi(this.id).subscribe({
        next: (role) => this.patch(role),
        error: () => this.router.navigate(['/security/roles']),
      });
    }
  }

  private patch(role: Role) {
    this.form.patchValue({
      name: role.name,
      description: role.description ?? '',
      active: role.active,
      isDemandante: role.isDemandante,
    });

    this.isSystemRole = SYSTEM_ROLE_NAMES.includes(role.name);
    if (this.isSystemRole) {
      this.form.disable();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.rolesService.update(this.id, value).subscribe({
      next: () => this.router.navigate(['/security/roles']),
      error: (e) => console.error('PUT error', e)
    });
    } else {
      this.rolesService.create(value).subscribe({
      next: () => this.router.navigate(['/security/roles']),
      error: (e) => console.error('POST error', e)
    });
    }

    this.router.navigate(['/security/roles']);
  }

  cancel(): void {
    this.router.navigate(['/security/roles']);
  }

  get nameCtrl() {
    return this.form.get('name');
  }
}
