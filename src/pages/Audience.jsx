import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Globe, PieChart as PieIcon, Activity, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { fetchDashboardData } from '../data/api';
import { formatNumber } from '../utils/formatters';

const PLATFORMS   = ['All Platforms', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];

const PLATFORM_COLORS = {
  Instagram: '#E1306C',
  Twitter:   '#1DA1F2',
  LinkedIn:  '#0077B5',
  Facebook:  '#4267B2',
  TikTok:    '#06B6D4',
};

const AGE_COLORS = ['#2DD4BF', '#6366F1', '#D946EF', '#F59E0B'];
const GENDER_DATA = [
  { name: 'Female', value: 54, color: '#D946EF' },
  { name: 'Male',   value: 40, color: '#2DD4BF' },
  { name: 'Other',  value: 6,  color: '#6366F1' },
];

const LOCATION_DATA = [
  { country: '🇺🇸 United States', pct: 38 },
  { country: '🇬🇧 United Kingdom', pct: 14 },
  { country: '🇮🇳 India',          pct: 12 },
  { country: '🇧🇷 Brazil',         pct: 8  },
  { country: '🇨🇦 Canada',         pct: 6  },
  { country: '🌍 Others',           pct: 22 },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel px-4 py-3 rounded-2xl border border-white/10 shadow-2xl min-w-[140px] backdrop-blur-3xl">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em]">{label || payload[0]?.name}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.payload?.color || e.color }} />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">{e.name}</span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            {e.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ platform, onConnect }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card p-8 sm:p-20 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] mt-10"
  >
    <div className="relative">
      <div className="absolute -inset-10 bg-primary-600/20 blur-[60px] rounded-full animate-pulse" />
      <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center shadow-2xl">
        <Sparkles size={48} className="text-white" />
      </div>
    </div>
    
    <div className="space-y-3 max-w-md">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        Connect {platform === 'All Platforms' ? 'your Social Accounts' : platform}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium">
        Experience a flawless analytics journey. Connect your {platform === 'All Platforms' ? 'profiles' : platform} account now to unlock real-time tracking, AI-powered insights, and comprehensive audience growth metrics.
      </p>
    </div>

    <button 
      onClick={onConnect}
      className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-3xl font-black text-lg shadow-2xl shadow-primary-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
    >
      <RefreshCw size={24} />
      Go to Integrations
    </button>
  </motion.div>
);

const FilterSelect = ({ value, onChange, options, connections = {} }) => (
  <div className="relative group w-full sm:w-auto">
    <div className="absolute left-4 z-20 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
      <div className={`w-1.5 h-1.5 rounded-full ${value === 'All Platforms' ? 'bg-primary-500' : (connections[value.toLowerCase()] ? 'bg-emerald-500' : 'bg-slate-500')}`} />
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full pl-8 pr-10 py-2.5 rounded-2xl glass-panel border border-white/10 text-sm font-black text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer bg-transparent transition-all duration-300 hover:border-primary-500/30"
    >
      {options.map((o) => {
        const isConnected = o === 'All Platforms' || connections[o.toLowerCase()];
        return (
          <option key={o} value={o} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
            {o} {!isConnected && '(Not Connected)'}
          </option>
        );
      })}
    </select>
    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
  </div>
);

const Audience = () => {
  const { platform, setPlatform } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(true);
  const [data, setData]           = useState(null);
  const [connections, setConnections] = useState({});

  const checkConnections = () => {
    const status = {
      instagram: localStorage.getItem('instagram_connected') === 'true',
      twitter: localStorage.getItem('twitter_connected') === 'true',
      linkedin: localStorage.getItem('linkedin_connected') === 'true',
      facebook: localStorage.getItem('facebook_connected') === 'true',
      tiktok: localStorage.getItem('tiktok_connected') === 'true',
    };
    setConnections(status);
    return status;
  };

  useEffect(() => {
    const conn = checkConnections();
    setLoading(true);
    fetchDashboardData('Last 30 Days', platform, conn).then((d) => {
      setData(d);
      setLoading(false);
    });

    const handleStorageChange = () => checkConnections();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [platform]);

  const isAnyConnected = Object.values(connections).some(v => v);
  const isCurrentConnected = platform === 'All Platforms' 
    ? isAnyConnected 
    : connections[platform.toLowerCase()];

  const audienceData = data?.audienceData ?? [];
  const accentColor  = platform === 'All Platforms' ? '#3B82F6' : (PLATFORM_COLORS[platform] || '#3B82F6');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 max-w-[1600px] mx-auto pb-12"
    >
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1 w-full lg:w-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Audience <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-green">Intelligence</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Demographic breakdown for <span className="text-primary-500 font-bold">{platform}</span> audience
          </p>
        </div>
        <div className="flex flex-wrap gap-3 glass-panel p-1.5 rounded-3xl border border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 w-full lg:w-auto">
          <FilterSelect value={platform} onChange={setPlatform} options={PLATFORMS} connections={connections} />
        </div>
      </div>

      {!isCurrentConnected && !loading ? (
        <EmptyState 
          platform={platform} 
          onConnect={() => navigate('/settings?tab=Integrations')} 
        />
      ) : (
        <>
          {/* ── Top row: Age pie + Gender pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                <Users size={24} />
             </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Age Distribution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Age group segmentation across the platform</p>
          </div>

          <div style={{ height: 420 }} className="relative z-10 w-full">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-48 h-48 rounded-full border-8 border-white/5 border-t-primary-500 animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`age-${platform}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1500}
                      >
                        {audienceData.map((_, i) => (
                          <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                    {audienceData.map((seg, i) => {
                      const total = audienceData.reduce((s, d) => s + d.value, 0);
                      const pct = total ? Math.round((seg.value / total) * 100) : 0;
                      return (
                        <div key={seg.name} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col items-center gap-1 shadow-inner">
                          <span className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: AGE_COLORS[i % AGE_COLORS.length] }} />
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{seg.name}</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Gender Split */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                <Activity size={24} />
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Gender Dynamics</h3>
            <p className="text-sm text-slate-400 mt-1">Estimated gender split based on activity</p>
          </div>

          <div style={{ height: 420 }} className="relative z-10 w-full flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={GENDER_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {GENDER_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(val) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex justify-around mt-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                {GENDER_DATA.map(g => (
                   <div key={g.name} className="text-center">
                      <p className="text-sm font-black text-white">{g.value}%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{g.name}</p>
                   </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom row: Age progress bars + Top locations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Age Segments Detailed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Segment Growth</h3>
            <p className="text-sm text-slate-400 mt-1">Detailed percentage breakdown per category</p>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" />)
            ) : (
              audienceData.map((seg, i) => {
                const total = audienceData.reduce((s, d) => s + d.value, 0);
                const pct = total ? Math.round((seg.value / total) * 100) : 0;
                return (
                  <div key={seg.name} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-black text-white group-hover:text-primary-400 transition-colors">{seg.name}</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Audience</p>
                      </div>
                      <span className="text-lg font-black text-white">{pct}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: AGE_COLORS[i % AGE_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Top locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Globe size={24} />
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Geographic Reach</h3>
            <p className="text-sm text-slate-400 mt-1">Top performing regions by volume</p>
          </div>

          <div className="space-y-5">
            {LOCATION_DATA.map((loc, i) => (
              <div key={loc.country} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-slate-200">{loc.country}</span>
                   <span className="text-xs font-black text-white bg-white/5 px-2 py-1 rounded-lg border border-white/5">{loc.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loc.pct}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor, opacity: 0.5 + (i * 0.1) }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="text-center flex-1">
                <p className="text-2xl font-black text-white">142</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Countries</p>
             </div>
             <div className="w-px h-10 bg-white/5" />
             <div className="text-center flex-1">
                <p className="text-2xl font-black text-white">3.2M</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Reach</p>
             </div>
          </div>
        </motion.div>
      </div>
        </>
      )}
    </motion.div>
  );
};

export default Audience;
