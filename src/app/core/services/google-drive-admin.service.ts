import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GoogleDriveStatus {
  connected: boolean;
  email?: string;
  connectedAt?: string;
}

// Administra la ÚNICA cuenta de Google (Gmail del despacho) conectada por
// OAuth — no es "cada usuario con su cuenta"; ver GoogleDriveService en el
// backend. Los usuarios normales de la App no usan este servicio.
@Injectable({ providedIn: 'root' })
export class GoogleDriveAdminService {
  private readonly baseUrl = `${environment.apiUrl}/googledrive`;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<GoogleDriveStatus> {
    return this.http.get<GoogleDriveStatus>(`${this.baseUrl}/status`);
  }

  start(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/oauth/start`);
  }

  disconnect(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/disconnect`, {});
  }
}
