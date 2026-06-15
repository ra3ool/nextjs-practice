export interface MockUser {
  createdAt: string;
  name: string;
  avatar: string;
  dateOfBirth: string;
  country: string;
  city: string;
  street: string;
  zipcode: string;
  company: string;
  email: string;
  phoneNumber: string;
  id: number;
  age: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
