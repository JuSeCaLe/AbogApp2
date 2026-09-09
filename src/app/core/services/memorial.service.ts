import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemorialTemplate } from '../models/memorial.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MemorialService {
  private readonly baseUrl = `${environment.apiUrl}/memorials`;

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<MemorialTemplate[]> {
    return this.http.get<MemorialTemplate[]>(`${this.baseUrl}/templates`);
  }

  // El backend devuelve un .docx (un caso) o un .zip (varios casos); el
  // contenido real llega en el header Content-Disposition, por eso pedimos
  // la respuesta completa (observe: 'response') en vez de solo el body.
  generate(templateId: number, caseIds: number[]) {
    return this.http.post(`${this.baseUrl}/generate`,
      { templateId, caseIds },
      { responseType: 'blob', observe: 'response' }
    );
  }

  // Extrae el nombre de archivo sugerido por el backend (Content-Disposition),
  // con un respaldo por si no viene.
  static extractFileName(response: { headers: { get(name: string): string | null } }, fallback: string): string {
    const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
    if (disposition) {
      const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }
    return fallback;
  }
}
