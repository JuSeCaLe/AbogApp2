import { Component, OnInit } from '@angular/core';
import { CaseService } from '../../core/services/case.service';
import { Case } from '../../core/models/case.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  cases: Case[] = [];

  constructor(private caseService: CaseService) {}

  ngOnInit() {
    this.caseService.getCases().subscribe(c => {
      this.cases = c;
    });
  }
}
