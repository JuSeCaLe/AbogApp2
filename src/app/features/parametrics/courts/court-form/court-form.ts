import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourtsService } from '../../../../core/services/court.service';

@Component({
  selector: 'app-court-form',
  standalone: false,
  templateUrl: './court-form.html',
  styleUrl: './court-form.css',
})
export class CourtForm implements OnInit {
  id: string | null = null;
  isEdit = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: CourtsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      active: [true],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const item = this.svc.getById(this.id);
      if (!item) return void this.router.navigate(['/parametrics/courts']);
      this.form.patchValue({ name: item.name, city: item.city, active: item.active });
    }
  }

  get nameCtrl() { return this.form.get('name'); }
  get cityCtrl() { return this.form.get('city'); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    if (this.isEdit && this.id) this.svc.update(this.id, value);
    else this.svc.create(value);
    this.router.navigate(['/parametrics/courts']);
  }

  cancel(): void {
    this.router.navigate(['/parametrics/courts']);
  }
}
