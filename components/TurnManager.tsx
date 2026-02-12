
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle, XCircle, Search, AlertCircle } from 'lucide-react';
import { turnStore } from './turnStore';
import { SERVICES } from '../constants';
import { Turn, TurnStatus, User } from '../types';

interface TurnManagerProps {
  user: User;
}

const TurnManager: React.FC<TurnManagerProps> = ({ user }) => {
  const [turns, setTurns] = useState<Turn[]>(turnStore.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [suggestedTime, setSuggestedTime] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: user.role === 'CLIENT' ? user.name : '',
    date: '',
    time: '',
    service: SERVICES[0].name,
    notes: ''
  });

  const filteredTurns = turns.filter(t => {
    const matchesSearch = t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.service.toLowerCase().includes(searchTerm.toLowerCase());
    if (user.role === 'CLIENT') {
      return matchesSearch && t.clientId === user.id;
    }
    return matchesSearch;
  });

  const findNextAvailableTime = (date: string, requestedTime: string) => {
    const allTurnsOnDate = turnStore.getAll()
      .filter(t => t.date === date && t.status !== 'CANCELLED')
      .sort((a, b) => a.time.localeCompare(b.time));

    let [hours, minutes] = requestedTime.split(':').map(Number);
    
    const addTwoHours = (h: number, m: number) => {
      let newH = h + 2;
      if (newH >= 20) return null;
      return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    let nextPossible = addTwoHours(hours, minutes);
    
    while (nextPossible) {
      const isOccupied = allTurnsOnDate.some(t => t.time === nextPossible);
      if (!isOccupied) return nextPossible;
      
      const [nH, nM] = nextPossible.split(':').map(Number);
      nextPossible = addTwoHours(nH, nM);
    }
    return null;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);
    setSuggestedTime(null);

    try {
      turnStore.add({
        clientId: user.id,
        clientName: formData.clientName,
        date: formData.date,
        time: formData.time,
        service: formData.service,
        notes: formData.notes
      });
      
      setTurns(turnStore.getAll());
      setIsModalOpen(false);
      setFormData({ ...formData, date: '', time: '', notes: '' });
      alert('Turno confirmado exitosamente.');
    } catch (err: any) {
      setConflictError("El horario solicitado no se encuentra disponible.");
      const suggestion = findNextAvailableTime(formData.date, formData.time);
      if (suggestion) {
        setSuggestedTime(suggestion);
      }
    }
  };

  const acceptSuggestion = () => {
    if (suggestedTime) {
      setFormData({ ...formData, time: suggestedTime });
      setConflictError(null);
      setSuggestedTime(null);
    }
  };

  const updateStatus = (id: string, status: TurnStatus) => {
    turnStore.updateStatus(id, status);
    setTurns(turnStore.getAll());
  };

  const deleteTurn = (id: string) => {
    if (confirm('¿Confirma la cancelación de este turno?')) {
      turnStore.delete(id);
      setTurns(turnStore.getAll());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-space text-slate-900 dark:text-white transition-colors">Gestión de Citas</h2>
          <p className="text-slate-500 dark:text-slate-400">Administración profesional de la agenda institucional.</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setConflictError(null);
            setSuggestedTime(null);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Agendar Nuevo Turno
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o servicio..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Titular</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Cronograma</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredTurns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No existen registros de turnos en el sistema para este criterio.
                  </td>
                </tr>
              ) : (
                filteredTurns.map((turn) => (
                  <tr key={turn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{turn.clientName}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold uppercase">
                        {turn.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <CalendarIcon size={14} className="text-indigo-500" /> {turn.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock size={14} /> {turn.time} hs
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        turn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        turn.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {turn.status === 'COMPLETED' ? 'Finalizado' : turn.status === 'PENDING' ? 'En Agenda' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'ADMIN' && turn.status === 'PENDING' && (
                          <button 
                            onClick={() => updateStatus(turn.id, 'COMPLETED')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="Marcar como finalizado"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteTurn(turn.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Remover de agenda"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-space dark:text-white">Nuevo Agendamiento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                  <XCircle size={24} />
                </button>
              </div>

              {conflictError && (
                <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex flex-col gap-3">
                  <div className="flex items-start gap-3 text-rose-700 dark:text-rose-400">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{conflictError}</p>
                      <p className="text-xs opacity-90">Por favor, seleccione otro horario para evitar solapamientos.</p>
                    </div>
                  </div>
                  {suggestedTime && (
                    <div className="pt-2 border-t border-rose-200/50 dark:border-rose-800/50">
                      <p className="text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">Horario sugerido disponible:</p>
                      <button 
                        onClick={acceptSuggestion}
                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        <Clock size={14} /> Usar {suggestedTime} hs
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                {user.role === 'ADMIN' && (
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-200">Nombre del Solicitante</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-200">Categoría de Servicio</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-200">Fecha</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-200">Hora</label>
                    <input 
                      type="time" 
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-slate-200">Observaciones</label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Detalles administrativos relevantes..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                  Confirmar Agendamiento
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnManager;
