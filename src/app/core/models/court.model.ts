export interface Court {
  id: string;
  name: string;
  description: string | null;
  city: string;
  active: boolean;
  createdAt: string; // ISO
}
