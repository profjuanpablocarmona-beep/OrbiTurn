
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CheckCircle2, Clock, XCircle, Users, Activity, TrendingUp } from 'lucide-react';
import { turnStore } from './turnStore';

const Dashboard: React.FC = () => {
  const turns = turnStore.getAll();
  const stats = turnStore.getStats();

  const pieData = [
    { name: 'Completados', value: stats.completed, color: '#10b981' },
    { name: 'Pendientes', value: stats.pending, color: '#6366f1' },
    { name: 'Cancelados', value: stats.cancelled, color: '#ef4444' },
  ];

  const serviceData = useMemo(() => {
    return Object.entries(stats.byService).map(([name, value]) => ({ name, value }));
  }, [stats]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold font-space text-slate-900 dark:text-white transition-colors">Centro de Comando</h2>
        <p className="text-slate-500 dark:text-slate-400">Visión panorámica de tus operaciones institucionales.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Pendientes</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Completados</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl text-rose-600 dark:text-rose-400">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Cancelados</p>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Turnos</p>
            <p className="text-2xl font-bold">{turns.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-500" size={20} />
            <h3 className="font-bold text-lg">Servicios más Solicitados</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" fontSize={10} stroke="#64748b" />
                <YAxis fontSize={12} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-indigo-500" size={20} />
            <h3 className="font-bold text-lg">Estado de Turnos</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
