// // import { Component, OnInit } from '@angular/core';
// // import { Router } from '@angular/router';
// // import { Observable, map } from 'rxjs';
// // import { CourtsService } from '../../../../core/services/court.service';
// // import { Court } from '../../../../core/models/court.model';

// // @Component({
// //   selector: 'app-courts-list',
// //   standalone: false,
// //   templateUrl: './courts-list.html',
// //   styleUrl: './courts-list.css',
// // })
// // export class CourtsList implements OnInit {
// //   filter = '';
// //   items$!: Observable<Court[]>;
// //   filtered$!: Observable<Court[]>;

// //   displayedColumns: Array<'name' | 'city' | 'active' | 'actions'> =
// //     ['name', 'city', 'active', 'actions'];

// //   constructor(private svc: CourtsService, private router: Router) {}

// //   ngOnInit(): void {
// //     this.items$ = this.svc.items$;
// //     this.filtered$ = this.items$.pipe(
// //       map(list => {
// //         const q = this.filter.trim().toLowerCase();
// //         if (!q) return list;
// //         return list.filter(x =>
// //           x.name.toLowerCase().includes(q) || x.city.toLowerCase().includes(q)
// //         );
// //       })
// //     );
// //   }

// //   goNew() { this.router.navigate(['/parametrics/courts/new']); }
// //   goEdit(id: string) { this.router.navigate(['/parametrics/courts', id]); }
// //   toggle(id: string) { this.svc.toggleActive(id); }
// // }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Court } from '../../../../core/models/court.model';
import { CourtsService } from '../../../../core/services/court.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-courts-list',
  standalone: false,
  templateUrl: './courts-list.html',
  styleUrl: './courts-list.css',
})
export class CourtsList implements OnInit {
  items$!: Observable<Court[]>;
  filtered$!: Observable<Court[]>;
  search = new FormControl<string>('', { nonNullable: true });

  displayedColumns: string[] = ['name', 'city', 'description', 'createdAt', 'active', 'actions'];

  loading = false;
  error = '';

  constructor(
    private service: CourtsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.items$ = this.service.items$;
    this.reload();

    this.filtered$ = combineLatest([
      this.items$,
      this.search.valueChanges.pipe(startWith(this.search.value)),
    ]).pipe(
      map(([items, q]) => {
        const query = (q ?? '').trim().toLowerCase();
        if (!query) return items;
        return items.filter(x =>
          (x.name ?? '').toLowerCase().includes(query) ||
          (x.description ?? '').toLowerCase().includes(query)
        );
      })
    );
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    this.service.refresh().subscribe({
      next: () => (this.loading = false),
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'No se pudieron cargar los tipos de obligación';
      },
    });
  }

  goNew(): void {
    this.router.navigate(['/parametrics/courts/new']);
  }

  goEdit(x: Court): void {
    this.router.navigate(['/parametrics/courts', x.id]);
  }

  toggle(x: Court): void {
    this.service.toggleActive(x.id).subscribe({
      error: (e) => (this.error = e?.error?.message || 'No se pudo cambiar el estado'),
    });
  }

  remove(x: Court): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar Juzgado',
        message: `¿Seguro que deseas eliminar "${x.name}"?\nEsta acción NO se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;
      this.service.delete(x.id).subscribe({
        error: (e) => (this.error = e?.error?.message || 'No se pudo eliminar'),
      });
    });
  }
}
