import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../../services/roles.service';
import { Role } from '../../../../../models/role.model';


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

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1️⃣ Inicializar form AQUÍ
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      active: [true],
    });

    // 2️⃣ Leer params
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    // 3️⃣ Cargar datos si es edición
    if (this.isEdit && this.id) {
      const role: Role | undefined = this.rolesService.getById(this.id);
      if (!role) {
        this.router.navigate(['/security/roles']);
        return;
      }

      this.form.patchValue({
        name: role.name,
        description: role.description ?? '',
        active: role.active,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.rolesService.update(this.id, value);
    } else {
      this.rolesService.create(value);
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
