
import { Turn, TurnStatus } from '../types';
import { INITIAL_TURNS } from '../constants';

class TurnStore {
  private turns: Turn[] = [];

  constructor() {
    const saved = localStorage.getItem('orbiturn_data');
    if (saved) {
      this.turns = JSON.parse(saved);
    } else {
      this.turns = INITIAL_TURNS;
      this.save();
    }
  }

  private save() {
    localStorage.setItem('orbiturn_data', JSON.stringify(this.turns));
  }

  getAll(): Turn[] {
    return [...this.turns];
  }

  add(turn: Omit<Turn, 'id' | 'status'>): Turn {
    // Check for overlap
    const hasOverlap = this.turns.some(t => t.date === turn.date && t.time === turn.time && t.status !== 'CANCELLED');
    if (hasOverlap) {
      throw new Error('Ya existe un turno en este horario galáctico.');
    }

    const newTurn: Turn = {
      ...turn,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING'
    };
    this.turns.push(newTurn);
    this.save();
    return newTurn;
  }

  updateStatus(id: string, status: TurnStatus) {
    this.turns = this.turns.map(t => t.id === id ? { ...t, status } : t);
    this.save();
  }

  delete(id: string) {
    this.turns = this.turns.filter(t => t.id !== id);
    this.save();
  }
  
  getStats() {
    const completed = this.turns.filter(t => t.status === 'COMPLETED').length;
    const pending = this.turns.filter(t => t.status === 'PENDING').length;
    const cancelled = this.turns.filter(t => t.status === 'CANCELLED').length;
    
    // Group by service
    const byService: Record<string, number> = {};
    this.turns.forEach(t => {
      byService[t.service] = (byService[t.service] || 0) + 1;
    });

    return { completed, pending, cancelled, byService };
  }
}

export const turnStore = new TurnStore();
