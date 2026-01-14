import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaintiffsService } from '../../../../core/services/plaintiff.service';

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

  constructor(
    private fb: FormBuilder,
    private svc: PlaintiffsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      active: [true],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const item = this.svc.getById(this.id);
      if (!item) return void this.router.navigate(['/parametrics/plaintiffs']);
      this.form.patchValue({ name: item.name, active: item.active });
    }
  }

  get nameCtrl() { return this.form.get('name'); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    if (this.isEdit && this.id) this.svc.update(this.id, value);
    else this.svc.create(value);
    this.router.navigate(['/parametrics/plaintiffs']);
  }

  cancel(): void {
    this.router.navigate(['/parametrics/plaintiffs']);
  }
}
