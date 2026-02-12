
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TurnManager from './components/TurnManager';
import Chatbot from './components/Chatbot';
import { User, UserRole } from './types';
import { Rocket, Shield, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'turns'>('turns');

  // Sincronización inicial del tema guardado
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: role === 'ADMIN' ? 'admin-1' : 'client-1',
      name: role === 'ADMIN' ? 'Administrador Institucional' : 'Usuario Registrado',
      email: role === 'ADMIN' ? 'admin@orbiturn.com' : 'user@orbiturn.com',
      phone: '+123456789',
      role: role
    });
    setActiveView(role === 'ADMIN' ? 'dashboard' : 'turns');
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Elementos de Fondo Animados - Estética Original Galáctica */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="w-full max-w-md glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 text-center">
          <div className="mb-8 inline-block bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-500/20">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold font-space mb-2 tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            OrbiTurn
          </h1>
          <p className="text-slate-400 mb-8">Gestión Profesional para Instituciones Modernas.</p>

          <div className="grid gap-4">
            <button 
              onClick={() => handleLogin('ADMIN')}
              className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
            >
              <Shield size={20} className="text-indigo-600" />
              Acceso Administrador
            </button>
            <button 
              onClick={() => handleLogin('CLIENT')}
              className="flex items-center justify-center gap-3 w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              <UserIcon size={20} />
              Acceso Cliente
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-[10px] text-slate-500 font-space tracking-[0.3em] uppercase font-bold">In Orbit With JP</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onViewChange={setActiveView} 
      activeView={activeView}
    >
      {activeView === 'dashboard' ? (
        <Dashboard />
      ) : (
        <TurnManager user={user} />
      )}
      <Chatbot />
    </Layout>
  );
};

export default App;
