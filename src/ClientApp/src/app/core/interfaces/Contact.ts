import { Department } from "./Department";

export interface Contact {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email?: string;
  fullName: string;
  department: Department;
}

