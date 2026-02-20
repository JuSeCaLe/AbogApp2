export interface ProcessType {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string; // ISO
}
