// Instalación local (Windows Service): el backend sirve este mismo build de
// Angular desde su propio proceso, en el mismo origen — por eso apiUrl es
// relativo ("/api"), no una URL absoluta como en environment.prod.ts.
export const environment = {
  production: true,
  apiUrl: '/api'
};
