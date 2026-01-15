import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObligationTypeService } from '../../../../core/services/obligation-type.service';

@Component({
  selector: 'app-obligation-form',
  standalone: false,
  templateUrl: './obligation-type-form.html',
  styleUrl: './obligation-type-form.css',
})
export class ObligationTypeForm implements OnInit {
  id: string | null = null;
    isEdit = false;
    form!: FormGroup;

    constructor(
      private fb: FormBuilder,
      private svc: ObligationTypeService,
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
        if (!item) return void this.router.navigate(['/parametrics/obligationType']);
        this.form.patchValue({ name: item.name, active: item.active });
      }
    }

    get nameCtrl() { return this.form.get('name'); }

    save(): void {
      if (this.form.invalid) { this.form.markAllAsTouched(); return; }
      const value = this.form.getRawValue();
      if (this.isEdit && this.id) this.svc.update(this.id, value);
      else this.svc.create(value);
      this.router.navigate(['/parametrics/obligationType']);
    }

    cancel(): void {
      this.router.navigate(['/parametrics/obligationType']);
    }
}
