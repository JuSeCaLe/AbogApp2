import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseBulkImportReport } from '../models/case-bulk-import.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CaseBulkImportService {
  private readonly baseUrl = `${environment.apiUrl}/case-bulk-import`;

  constructor(private http: HttpClient) {}

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/template`, { responseType: 'blob' });
  }

  // commit=false: solo valida y devuelve el reporte (nada se guarda).
  // commit=true: misma validación, y lo que pasó se guarda.
  import(file: File, commit: boolean): Observable<CaseBulkImportReport> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CaseBulkImportReport>(`${this.baseUrl}?commit=${commit}`, formData);
  }
}
