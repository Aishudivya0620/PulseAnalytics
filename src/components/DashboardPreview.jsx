import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Activity, Sparkles, Zap } from 'lucide-react';
import dashboard from "../images/dashboard-preview-new.png"
const DashboardPreview = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-20">
      {/* ── Background Aura ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-40 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] blur-[100px]"
        />
      </div>

      {/* ── Main Perspective Container ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative group perspective-[2000px]"
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateX: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {/* Neon Glow Frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-blue to-accent-green rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          
          {/* Main Display */}
          <div className="relative bg-[#020617]/80 backdrop-blur-3xl rounded-[2.8rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden aspect-[16/10] flex items-center justify-center">
            
            {/* Shimmer Loading */}
            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-[#020617] flex items-center justify-center"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                    />
                    <div className="flex flex-col items-center gap-6 mt-[25%] opacity-50">
                       <Zap size={40} className="text-primary-500 animate-pulse" />
                       <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.2 }}
                            className="h-full bg-primary-500" 
                          />
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* High Fidelity Dashboard Image */}
            <motion.img
              src={dashboard}
              alt="PulseAnalytics Dashboard Preview"
              initial={{ scale: 1.05, filter: 'blur(10px)' }}
              animate={{ scale: isLoaded ? 1 : 1.05, filter: isLoaded ? 'blur(0px)' : 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Glass Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-accent-blue/10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#020617]/60 to-transparent pointer-events-none" />
          </div>

          {/* ── Floating Badges ── */}
          
          {/* Engagement Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute -left-8 top-1/3 z-30"
          >
            <div className="glass-panel px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/20 hover:-translate-y-2 transition-transform cursor-pointer group/badge">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/badge:scale-110 transition-transform">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-1">Growth Index</p>
                <p className="text-base font-black text-white">+24.8% <span className="text-emerald-400 text-xs ml-1">🚀</span></p>
              </div>
            </div>
          </motion.div>

          {/* Velocity Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute -right-8 bottom-1/4 z-30"
          >
            <div className="glass-panel px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/20 hover:-translate-y-2 transition-transform cursor-pointer group/badge">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover/badge:scale-110 transition-transform">
                <Zap size={22} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-1">Live Signals</p>
                <p className="text-base font-black text-white">4.2M <span className="text-accent-blue text-xs ml-1">✨</span></p>
              </div>
            </div>
          </motion.div>

          {/* AI Insights Tooltip Decor */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-12 left-1/4 text-primary-400 z-30 hidden md:block"
          >
            <Sparkles size={40} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Perspective Ground Shadow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-black/40 blur-[60px] rounded-full -z-20" />
    </div>
  );
};

export default DashboardPreview;
