import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProcessType } from '../../../../core/models/process-type.model';
import { ProcessTypeService } from '../../../../core/services/process-type.service';

@Component({
  selector: 'app-process-type-list',
  standalone: false,
  templateUrl: './process-types-list.html',
  styleUrl: './process-types-list.css',
})
export class ProcessTypeList implements OnInit {
  filter = '';
    items$!: Observable<ProcessType[]>;
    filtered$!: Observable<ProcessType[]>;

    constructor(
      private svc: ProcessTypeService,
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

    goNew() { this.router.navigate(['/parametrics/processType/new']); }
    goEdit(id: string) { this.router.navigate(['/parametrics/processType', id]); }
    toggle(id: string) { this.svc.toggleActive(id); }
}
