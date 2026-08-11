import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CaseService } from '../../core/services/case.service';
import { Case } from '../../core/models/case.model';

type RichCase = Case & { alertColor: 'red' | 'orange' | 'green'; nextDueDate: Date | null };
type EstadoFilter = 'all' | 'red' | 'orange' | 'green';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  cases: RichCase[] = [];
  loading = true;

  readonly urgentCols = ['defendant', 'processType', 'radicado', 'nextDate', 'actions'];
  readonly upcomingCols = ['defendant', 'processType', 'radicado', 'nextDate', 'actions'];
  readonly okCols = ['defendant', 'processType', 'radicado', 'actions'];

  // ===== Filtros =====
  estadoFilter: EstadoFilter = 'all';
  processTypeFilter: string | null = null;
  courtFilter: string | null = null;

  constructor(
    private caseService: CaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.caseService.getCases().subscribe(c => {
      this.cases = c as RichCase[];
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  get totalCases(): number { return this.cases.length; }

  // Opciones de los selects, derivadas de los casos cargados (solo muestra
  // valores que realmente existen en los datos).
  get processTypeOptions(): string[] {
    return this.uniqueSorted(this.cases.map(c => c.process?.processType));
  }

  get courtOptions(): string[] {
    return this.uniqueSorted(this.cases.map(c => c.process?.court));
  }

  private uniqueSorted(values: (string | undefined)[]): string[] {
    const set = new Set(values.filter((v): v is string => !!v));
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  // Casos con los filtros de tipo de proceso / juzgado aplicados (el estado
  // decide qué secciones se muestran, no qué filas se recortan).
  private get filteredCases(): RichCase[] {
    return this.cases.filter(c =>
      (!this.processTypeFilter || c.process?.processType === this.processTypeFilter) &&
      (!this.courtFilter || c.process?.court === this.courtFilter)
    );
  }

  get urgentCases(): RichCase[] { return this.filteredCases.filter(c => c.alertColor === 'red'); }
  get upcomingCases(): RichCase[] { return this.filteredCases.filter(c => c.alertColor === 'orange'); }
  get okCases(): RichCase[] { return this.filteredCases.filter(c => c.alertColor === 'green'); }

  get showUrgent(): boolean { return this.estadoFilter === 'all' || this.estadoFilter === 'red'; }
  get showUpcoming(): boolean { return this.estadoFilter === 'all' || this.estadoFilter === 'orange'; }
  get showOk(): boolean { return this.estadoFilter === 'all' || this.estadoFilter === 'green'; }

  get hasActiveFilters(): boolean {
    return this.estadoFilter !== 'all' || !!this.processTypeFilter || !!this.courtFilter;
  }

  clearFilters(): void {
    this.estadoFilter = 'all';
    this.processTypeFilter = null;
    this.courtFilter = null;
  }

  getDefendantName(c: Case): string {
    const parties = c.partiesInfo as any[];
    const d = parties?.find(p => p.processRole === 'DEMANDADO');
    return d?.person?.split('|')[0]?.trim() ?? '-';
  }

  daysUntilExpiry(date: Date | null | undefined): number | null {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  }

  daysOverdue(date: Date | null | undefined): number | null {
    const d = this.daysUntilExpiry(date);
    return d !== null ? -d : null;
  }

  goToCase(c: Case): void {
    this.router.navigate(['/cases', c.id, 'edit']);
  }

  newCase(): void {
    this.router.navigate(['/cases/new']);
  }
}
