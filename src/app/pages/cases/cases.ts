// src/app/pages/cases/cases.ts
import { Component, OnInit } from '@angular/core';
import { CaseService } from '../../services/case.service';
import { Router } from '@angular/router';
import { Case } from '../../models/case.model';

@Component({
  selector: 'app-cases',
  standalone: false,
  templateUrl: './cases.html',
  styleUrls: ['./cases.css']
})
export class Cases implements OnInit {

  cases: Case[] = [];
  displayedColumns: string[] = ['radicado', 'processType', 'court', 'city', 'alert', 'actions'];

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit() {
    this.caseService.getCases().subscribe(c => this.cases = c);
  }

  getAlertColor(c: Case): string {
    // Simulación: rojo si capital > 1_000_000, amarillo si capital > 500_000, verde si menor
    const capital = c.financialInfo?.capital || 0;
    if (capital > 1_000_000) return 'red';
    if (capital > 500_000) return 'orange';
    return 'green';
  }

  editCase(c: Case) {
    this.router.navigate(['/cases', c.id]);
  }

  newCase() {
    this.router.navigate(['/cases/new']);
  }
}
