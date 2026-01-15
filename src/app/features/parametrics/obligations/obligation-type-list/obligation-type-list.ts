import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ObligationType } from '../../../../core/models/obligation-type.model';
import { ObligationTypeService } from '../../../../core/services/obligation-type.service';

@Component({
  selector: 'app-obligation-type-list',
  standalone: false,
  templateUrl: './obligation-type-list.html',
  styleUrl: './obligation-type-list.css',
})
export class ObligationTypeList implements OnInit {
  filter = '';
    items$!: Observable<ObligationType[]>;
    filtered$!: Observable<ObligationType[]>;

    constructor(
      private svc: ObligationTypeService,
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

    goNew() { this.router.navigate(['/parametrics/obligationType/new']); }
    goEdit(id: string) { this.router.navigate(['/parametrics/obligationType', id]); }
    toggle(id: string) { this.svc.toggleActive(id); }
}
