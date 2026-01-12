export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];
  active: boolean;
  createdAt: string; // ISO string
}
