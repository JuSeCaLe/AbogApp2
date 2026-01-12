import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CaseService } from '../../services/case.service';
import { Router } from '@angular/router';
import { Case } from '../../models/case.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cases',
  standalone: false,
  templateUrl: './cases.html',
  styleUrls: ['./cases.css']
})
export class Cases implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['radicado', 'processType', 'court', 'city', 'alert', 'actions'];
  dataSource = new MatTableDataSource<Case>([]);

  filterRadicado = '';
  filterProcessType = '';
  filterCity = '';
  filterCourt = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit() {
    this.caseService.getCases().subscribe(cases => {
      this.dataSource.data = cases;
    });

    this.dataSource.filterPredicate = (c: Case, filter: string) => {
      const f = JSON.parse(filter);

      const radicado = c.process.radicado?.toLowerCase() || '';
      const processType = c.process.processType?.toLowerCase() || '';
      const city = c.process.city?.toLowerCase() || '';
      const court = c.process.court?.toLowerCase() || '';

      return (
        radicado.includes(f.radicado) &&
        processType.includes(f.processType) &&
        city.includes(f.city) &&
        court.includes(f.court)
      );
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {
    const filter = {
      radicado: this.filterRadicado.toLowerCase(),
      processType: this.filterProcessType.toLowerCase(),
      city: this.filterCity.toLowerCase(),
      court: this.filterCourt.toLowerCase()
    };

    this.dataSource.filter = JSON.stringify(filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAlertColor(c: Case): string {
    const capital = c.financialInfo?.capital ?? 0;

    if (capital >= 10_000_000) return 'red';
    if (capital >= 5_000_000) return 'orange';
    return 'green';
  }

  getAlertLabel(c: Case): string {
    const capital = c.financialInfo?.capital ?? 0;

    if (capital >= 10_000_000) return 'CRÍTICO';
    if (capital >= 5_000_000) return 'ALERTA';
    return 'NORMAL';
  }

  editCase(c: Case) {
    this.router.navigate(['/cases', c.id]);
  }

  newCase() {
    this.router.navigate(['/cases/new']);
  }
}
