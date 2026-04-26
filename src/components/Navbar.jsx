import React from 'react';
import { Search, Bell, Sun, Moon, Menu, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [profile] = React.useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
  });

  return (
    <header className="h-20 w-full glass-panel border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40 shadow-xl shadow-black/5 dark:shadow-black/20">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-3 rounded-2xl glass-panel hover:bg-primary-500/10 text-primary-500 transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>
        
        <div className="hidden sm:flex items-center gap-3 max-w-lg w-full bg-white/5 dark:bg-black/10 px-5 py-3 rounded-2xl border border-black/5 dark:border-white/5 transition-all focus-within:border-primary-500/50 focus-within:bg-white/20 dark:focus-within:bg-white/10 group">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Quick search (⌘+K)" 
            className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Actions */}
        <div className="flex items-center gap-2 glass-panel p-1 rounded-2xl border border-white/10">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-primary-500/10 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all active:scale-90"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button className="p-2.5 rounded-xl hover:bg-primary-500/10 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all active:scale-90">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            </button>
          </div>
        </div>

        <div className="w-px h-8 bg-black/5 dark:bg-white/10 mx-1"></div>

        {/* User Profile */}
        <button className="flex items-center gap-4 hover:opacity-80 transition-all p-1 rounded-2xl hover:bg-white/10 group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{profile.name}</p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
               <Sparkles size={10} className="text-amber-500 dark:text-amber-400" />
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-blue rounded-full blur opacity-20 dark:opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-white dark:bg-slate-900 overflow-hidden border border-black/5 dark:border-white/10">
              <img 
                src={profile.avatar} 
                alt="User profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
