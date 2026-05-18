import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CaseService } from '../../core/services/case.service';
import { Router } from '@angular/router';
import { Case } from '../../core/models/case.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cases',
  standalone: false,
  templateUrl: './cases.html',
  styleUrls: ['./cases.css']
})
export class Cases implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  displayedColumns: string[] = ['defendantName', 'document', 'observationsCount', 'alert', 'actions'];
  dataSource = new MatTableDataSource<Case>([]);

  filterRadicado = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private caseService: CaseService, private router: Router) { }

  ngOnInit() {
    this.caseService.getCases().subscribe(cases => {
      this.dataSource.data = cases;
    });

    this.dataSource.filterPredicate = (c: Case, filter: string) => {
      const radicado = c.process.radicado?.toLowerCase() || '';

      return radicado.includes(filter);
    };

    this.dataSource.sortingDataAccessor = (c: Case, column: string) => {
      switch (column) {
        case 'defendantName':
          return this.getDefendantName(c).toLowerCase();
        case 'document':
          return this.getDocument(c).toLowerCase();
        case 'observationsCount':
          return this.getObservationsCount(c);
        default:
          return '';
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    this.dataSource.filter = this.filterRadicado.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.filterRadicado = '';
    this.applyFilters();
  }

  getDefendant(c: Case): any | null {
    const parties = c.partiesInfo as any[];

    if (!Array.isArray(parties)) return null;

    return parties.find(p => p.processRole === 'DEMANDADO') ?? null;
  }

  getDefendantName(c: Case): string {
    const defendant = this.getDefendant(c);
    if (!defendant?.person) return '-';

    const [name] = String(defendant.person).split('|');
    return name?.trim() || '-';
  }

  getDocument(c: Case): string {
    const defendant = this.getDefendant(c);
    if (!defendant?.person) return '-';

    const parts = String(defendant.person).split('|').map(x => x.trim());
    const type = parts[1] || 'CC';
    const number = parts[2] || '';

    return `${type} ${number}`.trim();
  }

  getObservationsCount(c: Case): number {
    return c.processStages?.length ?? 0;
  }

  getAlertClass(c: Case): 'red' | 'orange' | 'green' {
    return (c as any).alertColor ?? 'green';
  }

  getAlertLabel(c: Case): string {
    const color = (c as any).alertColor;
    if (color === 'red') return 'Vencido';
    if (color === 'orange') return 'Por vencer';
    return 'Al día';
  }

  editCase(c: Case) {
    this.router.navigate(['/cases', c.id, 'edit']);
  }

  newCase() {
    this.router.navigate(['/cases/new']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
