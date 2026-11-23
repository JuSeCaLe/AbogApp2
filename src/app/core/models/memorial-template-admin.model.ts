export interface MemorialTemplateAdmin {
  id: number;
  name: string;
  fileName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Nombres de [Corchetes]/{{LEGACY}} detectados la última vez que se subió
  // o reemplazó el archivo (ver MemorialGenerationService.ExtractPlaceholders).
  placeholders: string[];
}

// Catálogo de variables disponibles para usar entre corchetes en una
// plantilla — debe reflejar exactamente lo que arma
// MemorialsController.BuildFieldValues en el backend.
export const MEMORIAL_TEMPLATE_VARIABLES: { token: string; description: string }[] = [
  { token: 'TipoProceso', description: 'Tipo de proceso del caso' },
  { token: 'Radicado', description: 'Número de radicado' },
  { token: 'Juzgado', description: 'Juzgado asignado' },
  { token: 'Ciudad', description: 'Ciudad del proceso' },
  { token: 'NumeroCarpeta', description: 'Número de carpeta física' },
  { token: 'Demandante', description: 'Nombre del demandante' },
  { token: 'Demandado', description: 'Nombre del demandado' },
  { token: 'DemandadoCedula', description: 'Cédula/NIT del demandado' },
  { token: 'FechaPresentacionDemanda', description: 'Fecha de presentación de la demanda (dd/MM/yyyy)' },
  { token: 'Capital', description: 'Capital de la obligación' },
  { token: 'Obligaciones', description: 'Texto de las obligaciones' },
  { token: 'CasoId', description: 'Id interno del caso' },
  { token: 'FechaHoy', description: 'Fecha de generación del memorial (dd/MM/yyyy)' },
];
