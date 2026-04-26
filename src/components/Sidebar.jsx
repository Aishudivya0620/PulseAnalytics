import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, MessageSquare, Users, Settings, Activity, LogOut, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

const Sidebar = ({ isMobile, onNavClick }) => {
  const { logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboard();
  const navigate = useNavigate();
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Posts', path: '/posts', icon: MessageSquare },
    { name: 'Audience', path: '/audience', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    if (onNavClick) onNavClick();
    navigate('/');
  };

  const handleLinkClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };

  return (
    <motion.aside 
      initial={isMobile ? { width: 280 } : { width: sidebarCollapsed ? 88 : 280 }}
      animate={isMobile ? { width: 280 } : { width: sidebarCollapsed ? 88 : 280 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${isMobile ? 'flex' : 'hidden md:flex'} flex-col h-screen fixed top-0 left-0 glass-panel border-r border-white/10 z-50 shadow-2xl bg-white dark:bg-slate-950`}
    >
      {/* Collapse Toggle - Only on Desktop */}
      {!isMobile && (
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-12 -right-4 w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary-500 transition-all z-[100] shadow-xl hover:scale-110 active:scale-95 bg-white dark:bg-slate-900"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      <div className="flex flex-col h-full w-full overflow-hidden">

      {/* Logo Section */}
      <div className={`flex items-center gap-3 py-10 transition-all duration-500 ${sidebarCollapsed && !isMobile ? 'px-5' : 'px-8'}`}>
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-accent-blue rounded-2xl blur opacity-20 dark:opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 flex items-center justify-center text-white font-bold shadow-2xl">
            <Activity size={26} className="text-primary-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col whitespace-nowrap"
          >
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Pulse<span className="text-primary-500">Analytics</span>
            </h1>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Enterprise</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
        <div className={`transition-all duration-500 ${sidebarCollapsed && !isMobile ? 'px-2 flex justify-center' : 'px-5 mb-4'}`}>
           <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
             {sidebarCollapsed && !isMobile ? '...' : 'Platform'}
           </p>
        </div>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `nav-item transition-all duration-300 ${isActive ? 'active' : ''} ${sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-5'}`
              }
              title={sidebarCollapsed && !isMobile ? link.name : ''}
            >
              <Icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
              {(!sidebarCollapsed || isMobile) && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-bold whitespace-nowrap"
                >
                  {link.name}
                </motion.span>
              )}
              {(!sidebarCollapsed || isMobile) && link.name === 'Analytics' && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className={`p-6 transition-all duration-500 ${sidebarCollapsed && !isMobile ? 'px-2' : 'px-6'}`}>
        {(!sidebarCollapsed || isMobile) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl p-5 overflow-hidden group border border-white/10 bg-primary-500/[0.03] dark:bg-white/[0.03] backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
               <Sparkles size={16} className="text-amber-500 dark:text-amber-400" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-sm font-black text-slate-900 dark:text-white mb-4">Pro Business</p>
              <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden">
                 <div className="bg-primary-500 h-full w-2/3 rounded-full" />
              </div>
              <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[11px] font-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors uppercase tracking-widest">
                Upgrade Now
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center mb-6">
            <button className="w-12 h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-primary-500 hover:bg-primary-500/10 transition-colors">
              <Sparkles size={20} />
            </button>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 py-3.5 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300 font-bold text-sm group ${sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-4'}`}
          title={sidebarCollapsed && !isMobile ? 'Sign Out' : ''}
        >
          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors shrink-0">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          {(!sidebarCollapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
