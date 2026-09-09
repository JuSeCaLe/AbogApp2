import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { CaseService } from '../../core/services/case.service';
import { MemorialService } from '../../core/services/memorial.service';
import { Case } from '../../core/models/case.model';
import { MemorialTemplate } from '../../core/models/memorial.model';

@Component({
  selector: 'app-memorials',
  standalone: false,
  templateUrl: './memorials.html',
  styleUrls: ['./memorials.css']
})
export class Memorials implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'defendantName', 'radicado', 'processType', 'alert'];
  dataSource = new MatTableDataSource<Case>([]);
  selection = new SelectionModel<Case>(true, []);

  templates: MemorialTemplate[] = [];
  selectedTemplateId: number | null = null;

  filterRadicado = '';
  loading = true;
  generating = false;
  error = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private caseService: CaseService,
    private memorialService: MemorialService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.caseService.getCases().subscribe(cases => {
      this.dataSource.data = cases;
      this.loading = false;
    });

    this.memorialService.getTemplates().subscribe(t => this.templates = t);

    this.dataSource.filterPredicate = (c: Case, filter: string) =>
      (c.process.radicado?.toLowerCase() || '').includes(filter);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterRadicado.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getDefendantName(c: Case): string {
    const parties = c.partiesInfo as any[];
    const defendant = Array.isArray(parties) ? parties.find(p => p.processRole === 'DEMANDADO') : null;
    if (!defendant?.person) return '-';
    return String(defendant.person).split('|')[0]?.trim() || '-';
  }

  getAlertLabel(c: Case): string {
    const color = (c as any).alertColor;
    if (color === 'red') return 'Vencido';
    if (color === 'orange') return 'Por vencer';
    return 'Al día';
  }

  // ── selección (checkboxes) ──
  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.filteredData.length && this.dataSource.filteredData.length > 0;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.filteredData);
    }
  }

  // ── generar ──
  get canGenerate(): boolean {
    return !!this.selectedTemplateId && this.selection.selected.length > 0 && !this.generating;
  }

  generate(): void {
    if (!this.canGenerate || !this.selectedTemplateId) return;

    this.generating = true;
    this.error = '';
    const caseIds = this.selection.selected.map(c => c.id);

    this.memorialService.generate(this.selectedTemplateId, caseIds).subscribe({
      next: (response) => {
        this.generating = false;
        const fallback = caseIds.length > 1 ? 'memoriales.zip' : 'memorial.docx';
        const fileName = MemorialService.extractFileName(response, fallback);
        this.downloadBlob(response.body!, fileName);
      },
      error: (err) => {
        this.generating = false;
        this.error = err?.error?.message || 'No se pudo generar el memorial.';
      }
    });
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  volver(): void {
    this.location.back();
  }
}
