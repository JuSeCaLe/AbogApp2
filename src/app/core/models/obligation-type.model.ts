export interface ObligationType {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string; // ISO
}
