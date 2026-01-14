import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CourtsService } from '../../../../core/services/court.service';
import { Court } from '../../../../core/models/court.model';

@Component({
  selector: 'app-courts-list',
  standalone: false,
  templateUrl: './courts-list.html',
  styleUrl: './courts-list.css',
})
export class CourtsList implements OnInit {
  filter = '';
  items$!: Observable<Court[]>;
  filtered$!: Observable<Court[]>;

  displayedColumns: Array<'name' | 'city' | 'active' | 'actions'> =
    ['name', 'city', 'active', 'actions'];

  constructor(private svc: CourtsService, private router: Router) {}

  ngOnInit(): void {
    this.items$ = this.svc.items$;
    this.filtered$ = this.items$.pipe(
      map(list => {
        const q = this.filter.trim().toLowerCase();
        if (!q) return list;
        return list.filter(x =>
          x.name.toLowerCase().includes(q) || x.city.toLowerCase().includes(q)
        );
      })
    );
  }

  goNew() { this.router.navigate(['/parametrics/courts/new']); }
  goEdit(id: string) { this.router.navigate(['/parametrics/courts', id]); }
  toggle(id: string) { this.svc.toggleActive(id); }
}
