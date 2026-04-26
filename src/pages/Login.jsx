import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart2, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 selection:bg-primary-500/30 overflow-hidden relative font-sans">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-blue flex items-center justify-center shadow-2xl shadow-primary-600/20 group-hover:scale-110 transition-transform">
              <BarChart2 className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">Pulse<span className="text-primary-400">Analytics</span></span>
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight">Identity Verification</h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px] tracking-[0.2em]">Secure Node Access Required</p>
        </div>

        <div className="glass-card p-10 relative border border-white/10 overflow-visible">
          {/* Decorative Sparkle */}
          <div className="absolute -top-6 -right-6 text-primary-400 animate-pulse">
             <Sparkles size={48} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Quantum Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  required
                  type="email" 
                  placeholder="name@nexus.com"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary-500/50 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-white placeholder:text-slate-600 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Key</label>
                <a href="#" className="text-[10px] font-black text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-widest">Reset Hash</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary-500/50 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all text-white placeholder:text-slate-600 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                 <div className="relative flex items-center">
                    <input type="checkbox" id="remember" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" />
                    <div className="w-5 h-5 rounded-md border-2 border-white/10 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                 </div>
                 <label htmlFor="remember" className="text-xs font-bold text-slate-400 cursor-pointer select-none tracking-wide">Maintain persistent session</label>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                 <ShieldCheck size={12} /> ENCRYPTED
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary-600 hover:bg-primary-500 disabled:opacity-70 text-white rounded-2xl text-xs font-black shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Authorizing...
                </>
              ) : (
                <>
                  Initiate Sync <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-xs font-bold text-slate-500">
              New to the ecosystem?{' '}
              <a href="#" className="font-black text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-widest ml-2">Request Invite</a>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="text-lg">←</span> Return to Base
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
