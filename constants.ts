
import { Service, Turn } from './types';

export const SERVICES: Service[] = [
  { id: '1', name: 'Consultoría Técnica', duration: 120, price: 50 },
  { id: '2', name: 'Gestión Administrativa', duration: 90, price: 30 },
  { id: '3', name: 'Análisis Especializado', duration: 120, price: 85 },
  { id: '4', name: 'Mantenimiento de Infraestructura', duration: 120, price: 200 },
];

export const INITIAL_TURNS: Turn[] = [
  {
    id: 't1',
    clientId: 'c1',
    clientName: 'Juan Pérez',
    date: '2024-05-20',
    time: '10:00',
    service: 'Consultoría Técnica',
    status: 'COMPLETED'
  },
  {
    id: 't2',
    clientId: 'c2',
    clientName: 'Elena Marte',
    date: '2024-05-21',
    time: '14:30',
    service: 'Gestión Administrativa',
    status: 'PENDING'
  },
  {
    id: 't3',
    clientId: 'c3',
    clientName: 'Roberto Gómez',
    date: '2024-05-22',
    time: '09:00',
    service: 'Análisis Especializado',
    status: 'PENDING'
  }
];

export const APP_NAME = "OrbiTurn";
export const FOOTER_TEXT = "In Orbit With JP";
