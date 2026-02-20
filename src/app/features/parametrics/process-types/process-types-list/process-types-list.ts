import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ProcessType } from '../../../../core/models/process-type.model';
import { ProcessTypeService } from '../../../../core/services/process-type.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-process-type-list',
  standalone: false,
  templateUrl: './process-types-list.html',
  styleUrl: './process-types-list.css',
})
export class ProcessTypeList implements OnInit {
  items$!: Observable<ProcessType[]>;
  filtered$!: Observable<ProcessType[]>;
  search = new FormControl<string>('', { nonNullable: true });

  displayedColumns: string[] = ['name', 'description', 'createdAt', 'active', 'actions'];

  loading = false;
  error = '';

  constructor(
    private service: ProcessTypeService,
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
        this.error = e?.error?.message || 'No se pudieron cargar los tipos de proceso';
      },
    });
  }

  goNew(): void {
    this.router.navigate(['/parametrics/processType/new']);
  }

  goEdit(x: ProcessType): void {
    this.router.navigate(['/parametrics/processType', x.id]);
  }

  toggle(x: ProcessType): void {
    this.service.toggleActive(x.id).subscribe({
      error: (e) => (this.error = e?.error?.message || 'No se pudo cambiar el estado'),
    });
  }

  remove(x: ProcessType): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar Tipo de Proceso',
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
