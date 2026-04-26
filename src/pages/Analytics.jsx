import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, TrendingDown, Zap, Target, Star, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { fetchAnalyticsData } from '../data/api';
import { formatNumber } from '../utils/formatters';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORMS   = ['All Platforms', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];
const TIME_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 6 Months'];

const PLATFORM_COLORS = {
  Instagram: '#E1306C',
  Twitter:   '#1DA1F2',
  LinkedIn:  '#0077B5',
  Facebook:  '#4267B2',
  TikTok:    '#06B6D4',
};

const BAR_COLORS = ['#2DD4BF', '#6366F1', '#D946EF'];

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  <div className="relative flex items-center group w-full sm:w-auto">
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

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel px-4 py-3 rounded-2xl border border-white/10 shadow-2xl min-w-[160px] backdrop-blur-3xl">
      <p className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">{label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{e.name}</span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            {formatNumber(e.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const SkeletonBlock = ({ h = 280 }) => (
  <div className="w-full rounded-[2.5rem] bg-white/5 animate-pulse" style={{ height: h }} />
);

const InsightCard = ({ icon: Icon, label, value, sub, color, delay, isPositive, badge }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group cursor-default"
  >
    {/* High-intensity neon glow */}
    <div
      className="absolute -right-10 -top-10 w-28 h-28 rounded-full blur-[60px] opacity-10 dark:opacity-30 group-hover:opacity-50 transition-opacity duration-700"
      style={{ backgroundColor: color }}
    />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="relative">
        <div 
          className="absolute -inset-3 rounded-2xl blur-xl opacity-30 dark:opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: color }}
        />
        <div
          className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-2xl border border-white/20 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${color}, ${color}dd)`, 
            color: '#fff' 
          }}
        >
          <Icon size={24} className="relative z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-white/10" />
          <div className="absolute top-1 right-1 opacity-60">
             <Sparkles size={8} />
          </div>
        </div>
      </div>
      
      {badge && (
        <div className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-500 text-[10px] font-black border border-primary-500/20">
           {badge}
        </div>
      )}
    </div>

    <div className="relative z-10 mt-auto">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">{label}</p>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {sub}
        </span>
      </div>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Analytics = () => {
  const { timeRange, setTimeRange, platform, setPlatform } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
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
    fetchAnalyticsData(timeRange, platform, conn).then((d) => {
      setData(d);
      setLoading(false);
    });

    const handleStorageChange = () => checkConnections();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [timeRange, platform]);

  const isAnyConnected = Object.values(connections).some(v => v);
  const isCurrentConnected = platform === 'All Platforms' 
    ? isAnyConnected 
    : connections[platform.toLowerCase()];

  const accentColor = platform === 'All Platforms'
    ? '#3B82F6'
    : (PLATFORM_COLORS[platform] || '#3B82F6');

  const g = data?.growth ?? {};
  const hasComparison = (data?.platformComparison ?? []).length > 0;

  // ─── Render ────────────────────────────────────────────────────────────────
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
            Advanced <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-primary-500">Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Deep-dive metrics for <span className="text-primary-500 font-bold">{platform}</span> across <span className="text-primary-500 font-bold">{timeRange}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto glass-panel p-2 sm:p-1.5 rounded-3xl border border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <FilterSelect value={platform} onChange={setPlatform} options={PLATFORMS} connections={connections} />
            <FilterSelect value={timeRange} onChange={setTimeRange} options={TIME_RANGES} />
          </div>
          <div className="hidden sm:block w-px h-6 bg-black/5 dark:bg-white/10 mx-1" />
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 transition-all font-bold text-sm w-full sm:w-auto">
            Export Report
          </button>
        </div>
      </div>

      {!isCurrentConnected && !loading ? (
        <EmptyState 
          platform={platform} 
          onConnect={() => navigate('/settings?tab=Integrations')} 
        />
      ) : (
        <>
          {/* ── AI Insights ── */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-black/5 dark:bg-white/10" />
          <Zap size={14} className="text-amber-500 dark:text-amber-400 animate-pulse" /> AI Insights
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <SkeletonBlock key={i} h={140} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              icon={TrendingUp}
              label="Eng. Growth"
              value={`+${g.engagement ?? 0}%`}
              sub="↑ Positive"
              color="#10B981"
              delay={0.05}
              isPositive={true}
              badge="Peak performance"
            />
            <InsightCard
              icon={Target}
              label="Reach Expansion"
              value={`+${g.reach ?? 0}%`}
              sub="↑ High"
              color="#3B82F6"
              delay={0.1}
              isPositive={true}
              badge="1.2M impressions"
            />
            <InsightCard
              icon={Star}
              label="Top Channel"
              value={data?.topPlatform ?? '—'}
              sub="↑ Dominant"
              color="#F59E0B"
              delay={0.15}
              isPositive={true}
              badge="9.4% Rate"
            />
            <InsightCard
              icon={Clock}
              label="Golden Window"
              value={data?.bestPeriod ?? '—'}
              sub="↑ Optimal"
              color="#8B5CF6"
              delay={0.2}
              isPositive={true}
              badge="Best time to post"
            />
          </div>
        )}
      </div>

      {/* ── Charts Row 1: Engagement Line + Reach Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Engagement Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black border border-primary-500/20">
                ACTIVE TRACKING
             </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Engagement Intensity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Interaction density over time</p>
          </div>

          <div style={{ height: 320 }} className="relative z-10 w-full">
            {loading ? <SkeletonBlock h={320} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.engagementTrend ?? []}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(var(--text-muted), 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dx={-10} tickFormatter={v => formatNumber(v)} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(var(--text-muted), 0.2)', strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2DD4BF"
                    strokeWidth={6}
                    dot={{ fill: '#2DD4BF', r: 6, strokeWidth: 3, stroke: 'rgb(var(--bg-main))' }}
                    activeDot={{ r: 10, fill: '#2DD4BF', stroke: '#fff', strokeWidth: 4 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Reach Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reach & Impact</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Impression volume and audience expansion</p>
          </div>

          <div style={{ height: 320 }} className="relative z-10 w-full">
            {loading ? <SkeletonBlock h={320} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.reachTrend ?? []}>
                  <defs>
                    <linearGradient id="areaNeon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(var(--text-muted), 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dx={-10} tickFormatter={v => formatNumber(v)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={6}
                    fill="url(#areaNeon)"
                    activeDot={{ r: 10, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 4 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Charts Row 2: Post Performance Bar + Platform Comparison ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Post Performance Grouped Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Content Quality</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Average performance by interaction type</p>
          </div>

          <div style={{ height: 320 }} className="relative z-10 w-full">
            {loading ? <SkeletonBlock h={320} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.postPerf ?? []} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(var(--text-muted), 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} dx={-10} tickFormatter={v => formatNumber(v)} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(var(--text-muted), 0.05)' }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', color: 'rgba(var(--text-main))' }} />
                  <Bar dataKey="likes"    name="Likes"    fill={BAR_COLORS[0]} radius={[6,6,0,0]} barSize={12} animationDuration={1000} />
                  <Bar dataKey="comments" name="Comments" fill={BAR_COLORS[1]} radius={[6,6,0,0]} barSize={12} animationDuration={1200} />
                  <Bar dataKey="shares"   name="Shares"   fill={BAR_COLORS[2]} radius={[6,6,0,0]} barSize={12} animationDuration={1400} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Platform Comparison OR Engagement rate table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {hasComparison ? 'Network Dominance' : `${platform} Growth`}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Relative performance index
            </p>
          </div>

          <div style={{ height: 320 }} className="relative z-10 w-full">
            {loading ? <SkeletonBlock h={320} /> : (
              hasComparison ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.platformComparison} layout="vertical" margin={{ left: -10 }}>
                    <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="rgba(var(--text-muted), 0.1)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} width={90} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="followers" name="Followers" radius={[0, 10, 10, 0]} barSize={26} animationDuration={1000}>
                      {data.platformComparison.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid grid-cols-1 gap-4 py-2">
                  {[
                    { label: 'Engagement Growth', val: g.engagement, icon: <TrendingUp size={16} />, color: '#10B981' },
                    { label: 'Audience Reach',    val: g.reach,      icon: <Target size={16} />,     color: '#3B82F6' },
                    { label: 'New Followers',     val: g.followers,  icon: <Star size={16} />,       color: accentColor },
                    { label: 'Post Volume',       val: g.posts,      icon: <Zap size={16} />,        color: '#F59E0B' },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="p-4 rounded-3xl glass-panel border border-white/5 flex items-center justify-between group hover:border-primary-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/5 text-white group-hover:scale-110 transition-transform"
                             style={{ color: row.color }}>
                          {row.icon}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{row.label}</p>
                           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Performance Index</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-slate-900 dark:text-white">+{row.val}%</p>
                         <div className="mt-1 h-1 w-24 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(row.val * 2, 100)}%` }}
                              transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                              className="h-full rounded-full" 
                              style={{ backgroundColor: row.color }} 
                            />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Summary Footer ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-accent-blue/10 pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center lg:text-left space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Growth Milestone</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">
              You've reached <span className="text-primary-500 font-black">{formatNumber(data?.currentReach ?? 0)}</span> people this period. 
              Keep up the content velocity to maintain this momentum!
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 rounded-3xl glass-panel border border-white/10 text-center">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Eng. Rate</p>
               <p className="text-xl font-black text-slate-900 dark:text-white">9.4%</p>
            </div>
            <div className="px-6 py-4 rounded-3xl bg-primary-600 border border-primary-500 text-center shadow-xl shadow-primary-600/20">
               <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1">Growth</p>
               <p className="text-xl font-black text-white">+{g.engagement}%</p>
            </div>
          </div>
        </div>
      </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
