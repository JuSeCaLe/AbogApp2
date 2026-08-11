import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Case, CaseProcessStage, CaseProceduralNote } from '../models/case.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly baseUrl = `${environment.apiUrl}/cases`;

  constructor(private http: HttpClient) {}

  getCases(): Observable<Case[]> {
    return this.http.get<Case[]>(this.baseUrl).pipe(map(cases => this.enrich(cases)));
  }

  getCaseById(id: number): Observable<Case | undefined> {
    return this.http.get<Case>(`${this.baseUrl}/${id}`).pipe(map(c => this.enrich([c])[0]));
  }

  searchByRadicado(radicado: string): Observable<Case[]> {
    const params = new HttpParams().set('radicado', radicado.trim());
    return this.http.get<Case[]>(`${this.baseUrl}/search`, { params }).pipe(map(cases => this.enrich(cases)));
  }

  createCase(c: Case): Observable<Case> {
    return this.http.post<Case>(this.baseUrl, this.toRequest(c)).pipe(map(created => this.enrich([created])[0]));
  }

  updateCase(c: Case): Observable<Case> {
    return this.http.put<Case>(`${this.baseUrl}/${c.id}`, this.toRequest(c)).pipe(map(updated => this.enrich([updated])[0]));
  }

  addProcessStage(caseId: number, stage: CaseProcessStage): Observable<Case | undefined> {
    return this.http.post<Case>(`${this.baseUrl}/${caseId}/stages`, {
      stageDate: stage.createdAt,
      stageName: stage.stageName,
      subStageName: stage.subStageName,
      observation: stage.observation
    }).pipe(map(c => this.enrich([c])[0]));
  }

  addProceduralNote(caseId: number, note: CaseProceduralNote): Observable<Case | undefined> {
    return this.http.post<Case>(`${this.baseUrl}/${caseId}/notes`, {
      text: note.text
    }).pipe(map(c => this.enrich([c])[0]));
  }

  // Exporta a Excel los casos visibles para el usuario actual (el backend
  // aplica el mismo filtro por rol-demandante que usa el listado).
  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, { responseType: 'blob' });
  }

  // ===============================
  // ALERT LOGIC (computed on frontend)
  // ===============================
  //
  // Reference date = date of the most recent process stage,
  // or the case's own createdAt if no stages exist yet.
  //
  // Days elapsed = today − reference date.
  // daysInMonth  = number of days in the reference date's calendar month.
  //
  //   green  (Al día)          : elapsed ≤ 25
  //   orange (Próximos a vencer): 25 < elapsed ≤ daysInMonth
  //   red    (Vencido)         : elapsed > daysInMonth
  //
  // nextDueDate is set to (refDate + daysInMonth) so callers can compute
  // days-until-expiry (positive = days left; negative = days overdue).

  private enrich(cases: Case[]): Case[] {
    return cases.map(c => ({
      ...c,
      alertColor: this.getAlertColor(c),
      nextDueDate: this.getNextDate(c)
    }));
  }

  private getRefDate(c: Case): Date | null {
    const stages = c.processStages;
    if (stages && stages.length > 0) {
      const latest = [...stages].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      )[0];
      const d = new Date(latest.createdAt);
      return isNaN(d.getTime()) ? null : d;
    }
    if (c.createdAt) {
      const d = new Date(c.createdAt);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  private getNextDate(c: Case): Date | null {
    const ref = this.getRefDate(c);
    if (!ref) return null;
    const daysInMonth = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
    return new Date(ref.getTime() + daysInMonth * 86400000);
  }

  private getAlertColor(c: Case): 'red' | 'orange' | 'green' {
    const ref = this.getRefDate(c);
    if (!ref) return 'green';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const refDay = new Date(ref);
    refDay.setHours(0, 0, 0, 0);

    const elapsed = Math.floor((today.getTime() - refDay.getTime()) / 86400000);
    const daysInMonth = new Date(refDay.getFullYear(), refDay.getMonth() + 1, 0).getDate();

    if (elapsed <= 25) return 'green';
    if (elapsed <= daysInMonth) return 'orange';
    return 'red';
  }

  // ===============================
  // HELPERS
  // ===============================

  private toRequest(c: Case) {
    return {
      demandanteRoleId: c.demandanteRoleId,
      process: c.process,
      partiesInfo: c.partiesInfo,
      financialInfo: c.financialInfo ?? null,
      measures: c.measures ?? null,
      stages: c.stages ?? null,
      auction: c.auction ?? null,
      closure: c.closure ?? null
    };
  }
}
