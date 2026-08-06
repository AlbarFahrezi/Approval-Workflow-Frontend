export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  created_at: string;
  updated_at: string;
}