import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ObligationsService } from '../../../../core/services/obligations.service';
import { Obligation, ObligationType } from '../../../../core/models/obligation.model';

@Component({
  selector: 'app-obligation-form',
  standalone: false,
  templateUrl: './obligation-form.html',
  styleUrl: './obligation-form.css',
})
export class ObligationForm implements OnInit {
  id: string | null = null;
  isEdit = false;

  form!: FormGroup;
  types!: ObligationType[];

  constructor(
    private fb: FormBuilder,
    private svc: ObligationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.types = this.svc.types;

    this.form = this.fb.group({
      type: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(2)]],
      active: [true],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const item: Obligation | undefined = this.svc.getById(this.id);
      if (!item) return void this.router.navigate(['/parametrics/obligations']);
      this.form.patchValue({
        type: item.type,
        number: item.number,
        active: item.active,
      });
    }
  }

  get typeCtrl() { return this.form.get('type'); }
  get numberCtrl() { return this.form.get('number'); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const value = this.dramaticSafeValue();

    if (this.isEdit && this.id) this.svc.update(this.id, value);
    else this.svc.create(value);

    this.router.navigate(['/parametrics/obligations']);
  }

  // evita any raros del getRawValue
  private dramaticSafeValue(): { type: ObligationType; number: string; active: boolean } {
    const v = this.form.getRawValue();
    return {
      type: v.type as ObligationType,
      number: String(v.number ?? '').trim(),
      active: !!v.active,
    };
  }

  cancel(): void {
    this.router.navigate(['/parametrics/obligations']);
  }
}
