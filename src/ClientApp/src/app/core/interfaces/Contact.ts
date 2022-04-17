export interface Contact {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email?: string;
  readonly fullName: string;
}

