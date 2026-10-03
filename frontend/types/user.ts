export type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}
