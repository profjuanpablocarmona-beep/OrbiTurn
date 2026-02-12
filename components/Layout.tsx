
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Rocket, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { APP_NAME, FOOTER_TEXT } from '../constants';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onViewChange: (view: 'dashboard' | 'turns') => void;
  activeView: 'dashboard' | 'turns';
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onViewChange, activeView }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-space tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-6 mr-6">
                <button 
                  onClick={() => onViewChange('dashboard')}
                  className={`flex items-center gap-2 transition-colors ${activeView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 hover:text-indigo-500'}`}
                >
                  <LayoutDashboard size={18} />
                  Panel
                </button>
                <button 
                  onClick={() => onViewChange('turns')}
                  className={`flex items-center gap-2 transition-colors ${activeView === 'turns' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 hover:text-indigo-500'}`}
                >
                  <Calendar size={18} />
                  Turnos
                </button>
              </div>
            )}

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
              aria-label="Cambiar modo"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user && (
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 {APP_NAME} Corporation. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 font-space tracking-widest text-indigo-500 dark:text-indigo-400 uppercase font-bold text-[10px] sm:text-xs">
            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            {FOOTER_TEXT}
            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
