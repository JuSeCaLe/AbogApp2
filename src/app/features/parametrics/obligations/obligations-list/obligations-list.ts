import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Obligation } from '../../../../core/models/obligation.model';
import { ObligationsService } from '../../../../core/services/obligations.service';

@Component({
  selector: 'app-obligations-list',
  standalone: false,
  templateUrl: './obligations-list.html',
  styleUrl: './obligations-list.css',
})
export class ObligationsList implements OnInit {
  filter = '';
  items$!: Observable<Obligation[]>;
  filtered$!: Observable<Obligation[]>;

  displayedColumns: Array<'type' | 'number' | 'active' | 'actions'> =
    ['type', 'number', 'active', 'actions'];

  constructor(private svc: ObligationsService, private router: Router) {}

  ngOnInit(): void {
    this.items$ = this.svc.items$;
    this.filtered$ = this.items$.pipe(
      map(list => {
        const q = this.filter.trim().toLowerCase();
        if (!q) return list;
        return list.filter(x =>
          x.type.toLowerCase().includes(q) ||
          x.number.toLowerCase().includes(q)
        );
      })
    );
  }

  goNew() { this.router.navigate(['/parametrics/obligations/new']); }
  goEdit(id: string) { this.router.navigate(['/parametrics/obligations', id]); }
  toggle(id: string) { this.svc.toggleActive(id); }
}
