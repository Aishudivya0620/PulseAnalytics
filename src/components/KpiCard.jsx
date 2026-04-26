import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useCountUp } from '../utils/useCountUp';

const KpiCard = ({
  title,
  value,
  formatFn = (v) => Math.round(v).toLocaleString(),
  suffix = '',
  change,
  isPositive,
  icon: Icon,
  delay = 0,
  isLoading = false,
  accentColor = '#3B82F6',
  insightBadge = null,
}) => {
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1.4);
  const display = typeof value === 'number' ? `${formatFn(animated)}${suffix}` : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass-card p-6 relative overflow-hidden group cursor-default"
    >
      {/* Background Neon Glow */}
      <div
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[60px] opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-700"
        style={{ backgroundColor: accentColor }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {title}
            </p>
            {isLoading ? (
              <div className="h-8 w-24 bg-black/5 dark:bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {display}
              </h3>
            )}
          </div>

          <div className="relative shrink-0">
            <div 
              className="absolute -inset-3 rounded-2xl blur-xl opacity-30 dark:opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: accentColor }}
            />
            <div
              className="relative p-3.5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-2xl border border-white/20 overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, 
                color: '#fff',
              }}
            >
              <Icon size={24} className="relative z-10" />
              <div className="absolute top-0 left-0 w-full h-full bg-white/10" />
              <div className="absolute top-1 right-1 opacity-60">
                 <Sparkles size={8} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-4 w-16 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
            ) : (
              <>
                <span
                  className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'
                  }`}
                >
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {change}
                </span>
                <span className="text-[10px] font-bold text-slate-400">vs last period</span>
              </>
            )}
          </div>

          {/* Floating Insight Badge */}
          {insightBadge && (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-500 text-[10px] font-black border border-primary-500/20"
            >
              <Sparkles size={10} />
              {insightBadge}
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ color: accentColor, width: '100%' }}
      />
    </motion.div>
  );
};

export default KpiCard;
