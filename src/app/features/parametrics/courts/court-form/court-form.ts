// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CourtsService } from '../../../../core/services/court.service';

// @Component({
//   selector: 'app-court-form',
//   standalone: false,
//   templateUrl: './court-form.html',
//   styleUrl: './court-form.css',
// })
// export class CourtForm implements OnInit {
//   id: string | null = null;
//   isEdit = false;
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private svc: CourtsService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       city: ['', [Validators.required, Validators.minLength(2)]],
//       active: [true],
//     });

//     this.id = this.route.snapshot.paramMap.get('id');
//     this.isEdit = !!this.id;

//     if (this.isEdit && this.id) {
//       const item = this.svc.getById(this.id);
//       if (!item) return void this.router.navigate(['/parametrics/courts']);
//       this.form.patchValue({ name: item.name, city: item.city, active: item.active });
//     }
//   }

//   get nameCtrl() { return this.form.get('name'); }
//   get cityCtrl() { return this.form.get('city'); }

//   save(): void {
//     if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//     const value = this.form.getRawValue();
//     if (this.isEdit && this.id) this.svc.update(this.id, value);
//     else this.svc.create(value);
//     this.router.navigate(['/parametrics/courts']);
//   }

//   cancel(): void {
//     this.router.navigate(['/parametrics/courts']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourtsService } from '../../../../core/services/court.service';
import { Court } from '../../../../core/models/court.model';
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
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private service: CourtsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      active: [true],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.loading = true;
      this.service.getByIdFromApi(this.id).subscribe({
        next: (x: Court) => {
          this.loading = false;
          this.form.patchValue({
            name: x.name,
            city: x.city,
            description: x.description ?? '',
            active: x.active,
          });
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/parametrics/courts']);
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
          this.router.navigate(['/parametrics/courts']);
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
          this.router.navigate(['/parametrics/courts']);
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.message || 'No se pudo crear';
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/parametrics/courts']);
  }

  get nameCtrl() { return this.form.get('name'); }
  get cityCtrl() { return this.form.get('city'); }
}
