
export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type TurnStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Turn {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  status: TurnStatus;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
