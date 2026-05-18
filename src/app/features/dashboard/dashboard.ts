import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CaseService } from '../../core/services/case.service';
import { Case } from '../../core/models/case.model';

type RichCase = Case & { alertColor: 'red' | 'orange' | 'green'; nextDueDate: Date | null };

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
  get urgentCases(): RichCase[] { return this.cases.filter(c => c.alertColor === 'red'); }
  get upcomingCases(): RichCase[] { return this.cases.filter(c => c.alertColor === 'orange'); }
  get okCases(): RichCase[] { return this.cases.filter(c => c.alertColor === 'green'); }

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
