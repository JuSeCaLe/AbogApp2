export interface Role {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string; // ISO string
  // true si este rol representa un demandante: un usuario con este rol solo ve
  // y crea casos vinculados a él (ver CaseCreate/CasesController).
  isDemandante: boolean;
}
