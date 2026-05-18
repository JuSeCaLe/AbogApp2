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

  // ===============================
  // ALERT LOGIC (computed on frontend)
  // ===============================

  private enrich(cases: Case[]): Case[] {
    return cases.map(c => ({
      ...c,
      alertColor: this.getAlertColor(c),
      nextDueDate: this.getNextDate(c)
    }));
  }

  private getNextDate(c: Case): Date | null {
    const dates: string[] = [];

    if (c.measures?.embargoDate) dates.push(c.measures.embargoDate);
    if ((c.stages as any)?.firstInstanceDate) dates.push((c.stages as any).firstInstanceDate);
    if ((c.stages as any)?.secondInstanceDate) dates.push((c.stages as any).secondInstanceDate);
    if ((c.auction as any)?.auctionDate) dates.push((c.auction as any).auctionDate);
    if ((c.auction as any)?.awardDate) dates.push((c.auction as any).awardDate);
    if ((c.closure as any)?.deliveryDate) dates.push((c.closure as any).deliveryDate);

    if (!dates.length) return null;

    return new Date(
      dates.map(d => new Date(d).getTime()).sort((a, b) => a - b)[0]
    );
  }

  private getAlertColor(c: Case): 'red' | 'orange' | 'green' {
    const next = this.getNextDate(c);
    if (!next) return 'green';

    const days = Math.floor(
      (next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= 7) return 'red';
    if (days <= 30) return 'orange';
    return 'green';
  }

  // ===============================
  // HELPERS
  // ===============================

  private toRequest(c: Case) {
    return {
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
