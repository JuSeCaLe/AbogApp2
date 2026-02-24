import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Plaintiff } from '../../../../core/models/plaintiff.model';
import { PlaintiffsService } from '../../../../core/services/plaintiff.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-plaintiffs-list',
  standalone: false,
  templateUrl: './plaintiffs-list.html',
  styleUrl: './plaintiffs-list.css',
})
export class PlaintiffsList implements OnInit {
  items$!: Observable<Plaintiff[]>;
  filtered$!: Observable<Plaintiff[]>;
  search = new FormControl<string>('', { nonNullable: true });

  displayedColumns: string[] = ['name', 'description', 'createdAt', 'active', 'actions'];

  loading = false;
  error = '';

  constructor(
    private service: PlaintiffsService,
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
    this.router.navigate(['/parametrics/plaintiffs/new']);
  }

  goEdit(x: Plaintiff): void {
    this.router.navigate(['/parametrics/plaintiffs', x.id]);
  }

  toggle(x: Plaintiff): void {
    this.service.toggleActive(x.id).subscribe({
      error: (e) => (this.error = e?.error?.message || 'No se pudo cambiar el estado'),
    });
  }

  remove(x: Plaintiff): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar Tipo de Obligación',
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
