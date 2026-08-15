import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleDriveAdminService, GoogleDriveStatus } from '../../../core/services/google-drive-admin.service';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: 'La solicitud expiró o no es válida. Intenta conectar de nuevo.',
  missing_code: 'Google no envió el código de autorización. Intenta de nuevo.',
  access_denied: 'Se canceló la autorización en Google.'
};

@Component({
  selector: 'app-google-drive',
  standalone: false,
  templateUrl: './google-drive.html',
  styleUrls: ['./google-drive.css']
})
export class GoogleDrive implements OnInit {
  status: GoogleDriveStatus | null = null;
  loading = true;
  connecting = false;
  disconnecting = false;

  banner: { type: 'success' | 'error'; text: string } | null = null;

  constructor(
    private driveService: GoogleDriveAdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const email = params.get('email');
    const error = params.get('error');

    if (params.get('connected') && email) {
      this.banner = { type: 'success', text: `Cuenta conectada correctamente: ${email}` };
    } else if (error) {
      this.banner = { type: 'error', text: ERROR_MESSAGES[error] ?? `No se pudo conectar: ${error}` };
    }

    if (this.banner) {
      // Limpia los query params para que un refresh no repita el mensaje.
      this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }

    this.load();
  }

  load(): void {
    this.loading = true;
    this.driveService.getStatus().subscribe({
      next: (s) => { this.status = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  connect(): void {
    this.connecting = true;
    this.driveService.start().subscribe({
      next: (r) => { window.location.href = r.url; },
      error: () => { this.connecting = false; }
    });
  }

  disconnect(): void {
    if (!confirm('¿Desconectar la cuenta de Google Drive del despacho? Ya no se podrán subir ni ver documentos hasta reconectar una cuenta.')) return;

    this.disconnecting = true;
    this.driveService.disconnect().subscribe({
      next: () => { this.disconnecting = false; this.load(); },
      error: () => { this.disconnecting = false; }
    });
  }
}
