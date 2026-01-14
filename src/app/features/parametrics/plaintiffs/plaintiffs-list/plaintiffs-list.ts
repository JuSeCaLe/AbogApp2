import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PlaintiffsService } from '../../../../core/services/plaintiff.service';
import { Plaintiff } from '../../../../core/models/plaintiff.model';

@Component({
  selector: 'app-plaintiffs-list',
  standalone: false,
  templateUrl: './plaintiffs-list.html',
  styleUrl: './plaintiffs-list.css',
})
export class PlaintiffsList implements OnInit {
  filter = '';
  items$!: Observable<Plaintiff[]>;
  filtered$!: Observable<Plaintiff[]>;

  constructor(
    private svc: PlaintiffsService,
    private router: Router
  ) {}

  displayedColumns: Array<'name' | 'active' | 'actions'> =
    ['name', 'active', 'actions'];

  ngOnInit(): void {
    this.items$ = this.svc.items$;
    this.filtered$ = this.items$.pipe(
      map(list => {
        const q = this.filter.trim().toLowerCase();
        if (!q) return list;
        return list.filter(x =>
          x.name.toLowerCase().includes(q) || x.name.toLowerCase().includes(q)
        );
      })
    );
  }

  goNew() { this.router.navigate(['/parametrics/plaintiffs/new']); }
  goEdit(id: string) { this.router.navigate(['/parametrics/plaintiffs', id]); }
  toggle(id: string) { this.svc.toggleActive(id); }
}
