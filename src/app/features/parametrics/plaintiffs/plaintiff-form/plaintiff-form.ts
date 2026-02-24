import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaintiffsService } from '../../../../core/services/plaintiff.service';
import { Plaintiff } from '../../../../core/models/plaintiff.model';

@Component({
  selector: 'app-plaintiff-form',
  standalone: false,
  templateUrl: './plaintiff-form.html',
  styleUrl: './plaintiff-form.css',
})
export class PlaintiffForm implements OnInit {
  id: string | null = null;
  isEdit = false;

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private service: PlaintiffsService,
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
        next: (x: Plaintiff) => {
          this.loading = false;
          this.form.patchValue({
            name: x.name,
            description: x.description ?? '',
            active: x.active,
          });
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/parametrics/plaintiffs']);
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
          this.router.navigate(['/parametrics/plaintiffs']);
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
          this.router.navigate(['/parametrics/plaintiffs']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo crear';
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/parametrics/plaintiffs']);
  }

  get nameCtrl() { return this.form.get('name'); }
}
