import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsersService } from '../../../../../core/services/users.service';
import { RolesService } from '../../../../../core/services/roles.service';
import { User } from '../../../../../core/models/user.model';
import { Role } from '../../../../../core/models/role.model';

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
  roles$!: Observable<Role[]>;

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
      roleIds: [[], [Validators.required]],
      active: [true],
    });

    this.roles$ = this.rolesService.roles$;

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const user: User | undefined = this.usersService.getById(this.id);
      if (!user) {
        this.router.navigate(['/security/users']);
        return;
      }
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleIds: user.roleIds,
        active: user.active,
      });
    }
  }

  get firstNameCtrl() { return this.form.get('firstName'); }
  get lastNameCtrl() { return this.form.get('lastName'); }
  get emailCtrl() { return this.form.get('email'); }
  get roleIdsCtrl() { return this.form.get('roleIds'); }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.usersService.update(this.id, value);
    } else {
      this.usersService.create(value);
    }

    this.router.navigate(['/security/users']);
  }

  cancel(): void {
    this.router.navigate(['/security/users']);
  }
}
