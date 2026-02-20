import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObligationTypeService } from '../../../../core/services/obligation-type.service';
import { ObligationType } from '../../../../core/models/obligation-type.model';

@Component({
  selector: 'app-obligation-form',
  standalone: false,
  templateUrl: './obligation-types-form.html',
  styleUrl: './obligation-types-form.css',
})
export class ObligationTypeForm implements OnInit {
  id: string | null = null;
  isEdit = false;

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private service: ObligationTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      active: [true],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;
      this.service.getByIdFromApi(this.id).subscribe({
        next: (x: ObligationType) => {
          this.loading = false;
          this.form.patchValue({
            name: x.name,
            description: x.description ?? '',
            active: x.active,
          });
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/parametricas/tipos-obligacion']);
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = this.form.getRawValue();

    if (this.isEdit && this.id) {
      this.service.update(this.id, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/parametricas/tipos-obligacion']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo guardar';
        },
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/parametricas/tipos-obligacion']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo crear';
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/parametricas/tipos-obligacion']);
  }

  get nameCtrl() { return this.form.get('name'); }
}
