export type ObligationType = 'CONTRATO' | 'PAGARE' | 'OBLIGACION' | 'LETRA';

export interface Obligation {
  id: string;
  type: ObligationType;
  number: string; // número de obligación
  active: boolean;
  createdAt: string; // ISO
}
