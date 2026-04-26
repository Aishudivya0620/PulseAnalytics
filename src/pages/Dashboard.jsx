import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../components/KpiCard';
import { Users, Activity, FileText, MousePointerClick, ChevronDown, RefreshCw, Sparkles } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDashboardData, fetchRecentPosts } from '../data/api';
import { formatNumber } from '../utils/formatters';
import { useDashboard } from '../context/DashboardContext';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
const PLATFORMS = ['All Platforms', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok'];
const TIME_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 6 Months'];

const PLATFORM_COLORS = {
  Instagram: '#E1306C',
  Twitter:   '#1DA1F2',
  LinkedIn:  '#0077B5',
  Facebook:  '#4267B2',
  TikTok:    '#06B6D4',
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-3 rounded-2xl border border-white/10 shadow-2xl text-xs backdrop-blur-3xl">
        <p className="font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-slate-200 font-medium">
              {entry.name}: <span className="font-bold text-white">{formatNumber(entry.value)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Filter Select Component
const FilterSelect = ({ value, onChange, options, connections = {} }) => (
  <div className="relative flex items-center group">
    <div className="absolute left-4 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
      <div className={`w-1.5 h-1.5 rounded-full ${value === 'All Platforms' ? 'bg-primary-500' : (connections[value.toLowerCase()] ? 'bg-emerald-500' : 'bg-slate-500')}`} />
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-8 pr-10 py-2.5 rounded-2xl glass-panel border border-white/10 text-sm font-semibold text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer bg-transparent transition-all duration-300 hover:border-white/20"
    >
      {options.map((opt) => {
        const isConnected = opt === 'All Platforms' || connections[opt.toLowerCase()];
        return (
          <option key={opt} value={opt} className="bg-slate-900">
            {opt} {!isConnected && '(Not Connected)'}
          </option>
        );
      })}
    </select>
    <ChevronDown size={14} className="absolute right-4 text-slate-500 pointer-events-none group-hover:text-slate-300 transition-colors" />
  </div>
);

const EmptyState = ({ platform, onConnect }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]"
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

const Dashboard = () => {
  const { timeRange, setTimeRange, platform, setPlatform } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData]         = useState(null);
  const [posts, setPosts]       = useState([]);
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
    checkConnections();
    const handleStorageChange = () => checkConnections();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAnyConnected = Object.values(connections).some(v => v);
  const isCurrentConnected = platform === 'All Platforms' 
    ? isAnyConnected 
    : connections[platform.toLowerCase()];

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const conn = checkConnections();
      const [dashboardData, recentPosts] = await Promise.all([
        fetchDashboardData(timeRange, platform, conn),
        fetchRecentPosts(platform, timeRange, conn),
      ]);
      setData(dashboardData);
      setPosts(recentPosts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, platform]);

  const stats = data?.kpistats || {};
  const accentColor = platform === 'All Platforms' ? '#3B82F6' : (PLATFORM_COLORS[platform] || '#3B82F6');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">

      {/* ── Page Header ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-blue">Overview</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Real-time analytics for <span className="text-primary-500 font-bold">{platform}</span> across <span className="text-primary-500 font-bold">{timeRange}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 glass-panel p-1.5 rounded-3xl border border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20">
          <FilterSelect value={platform} onChange={setPlatform} options={PLATFORMS} connections={connections} />
          <FilterSelect value={timeRange} onChange={setTimeRange} options={TIME_RANGES} />
          <div className="w-px h-6 bg-black/5 dark:bg-white/10 mx-1" />
          <button
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-2xl glass-panel border border-white/10 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
            title="Refresh data"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 transition-all font-bold text-sm hover:scale-105 active:scale-95">
            Export Data
          </button>
        </div>
      </motion.div>

      {!isCurrentConnected && !loading ? (
        <EmptyState 
          platform={platform} 
          onConnect={() => navigate('/settings?tab=Integrations')} 
        />
      ) : (
        <>
          {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Audience"
          value={stats.followers ?? 0}
          formatFn={formatNumber}
          change={stats.followersDelta ?? '+0%'}
          isPositive={(stats.followersDelta ?? '').startsWith('+')}
          icon={Users}
          delay={0.05}
          isLoading={loading}
          accentColor={accentColor}
          insightBadge="+12.4k this month"
        />
        <KpiCard
          title="Engagement Rate"
          value={stats.rate ?? 0}
          suffix="%"
          change={stats.rateDelta ?? '+0%'}
          isPositive={(stats.rateDelta ?? '').startsWith('+')}
          icon={Activity}
          delay={0.1}
          isLoading={loading}
          accentColor="#10B981"
          insightBadge="Peak at 9:00 PM"
        />
        <KpiCard
          title="Content Output"
          value={stats.posts ?? 0}
          change={stats.postsDelta ?? '0%'}
          isPositive={(stats.postsDelta ?? '+0%').startsWith('+')}
          icon={FileText}
          delay={0.15}
          isLoading={loading}
          accentColor="#F59E0B"
          insightBadge="3 drafts ready"
        />
        <KpiCard
          title="Total Impressions"
          value={stats.reach ?? 0}
          formatFn={formatNumber}
          change={stats.reachDelta ?? '+0%'}
          isPositive={(stats.reachDelta ?? '').startsWith('+')}
          icon={MousePointerClick}
          delay={0.2}
          isLoading={loading}
          accentColor="#8B5CF6"
          insightBadge="1.2M Reach ✨"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Engagement Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-8 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold border border-emerald-500/20 animate-pulse">
                <Sparkles size={12} />
                +18.4% Growth detected
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Engagement Trend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Growth analysis over the selected period</p>
          </div>

          <div className="h-80 w-full">
            {loading ? (
              <div className="w-full h-full rounded-[2rem] bg-black/5 dark:bg-white/5 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.engagementData ?? []}>
                  <defs>
                    <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.6} />
                      <stop offset="40%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(var(--text-muted), 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 12 }} dx={-10} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2DD4BF"
                    strokeWidth={5}
                    fill="url(#neonGradient)"
                    activeDot={{ r: 10, fill: '#2DD4BF', stroke: '#fff', strokeWidth: 4 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Platform Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8 flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Network Breakdown</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Performance across platforms</p>
          </div>

          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="w-full h-full rounded-[2rem] bg-black/5 dark:bg-white/5 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.platformData ?? []} layout="vertical" margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="rgba(var(--text-muted), 0.1)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(var(--text-muted), 1)', fontSize: 11 }} width={80} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(var(--text-muted), 0.05)' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                    {(data?.platformData ?? []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color ?? COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
               <span>Efficiency</span>
               <span className="text-emerald-500">+12%</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '75%' }}
                 transition={{ duration: 1, delay: 1 }}
                 className="h-full bg-gradient-to-r from-primary-500 to-accent-blue rounded-full" 
               />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Content & Audience ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Audience Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Demographics</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Age group distribution</p>
          </div>

          <div className="h-64 relative">
            {loading ? (
              <div className="w-full h-full rounded-full border-[16px] border-black/5 dark:border-white/5 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.audienceData ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {(data?.audienceData ?? []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-slate-900 dark:text-white">18-24</span>
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Top Segment</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {(data?.audienceData ?? []).slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                 <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-8 lg:col-span-2 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Content</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Performance of latest posts</p>
            </div>
            <button className="text-sm font-bold text-primary-500 dark:text-primary-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
              Manage Content <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border-b border-black/5 dark:border-white/5">
                  <th className="pb-4">Content</th>
                  <th className="pb-4">Platform</th>
                  <th className="pb-4 text-right">Engagement</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {loading ? (
                  [1,2,3,4].map(i => (
                    <tr key={i}>
                      <td className="py-4"><div className="h-4 w-40 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></td>
                      <td className="py-4"><div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></td>
                      <td className="py-4"><div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded ml-auto animate-pulse" /></td>
                      <td className="py-4"><div className="h-4 w-16 bg-black/5 dark:bg-white/5 rounded ml-auto animate-pulse" /></td>
                    </tr>
                  ))
                ) : posts.slice(0, 5).map((post, index) => (
                  <motion.tr 
                    key={post.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-5 pr-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[240px] group-hover:text-primary-500 transition-colors">{post.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 uppercase tracking-wider">{post.date}</p>
                    </td>
                    <td className="py-5">
                       <span className="px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                          {post.platform}
                       </span>
                    </td>
                    <td className="py-5 text-right font-black text-slate-900 dark:text-white text-sm">
                       {formatNumber(post.likes + post.comments)}
                    </td>
                    <td className="py-5 text-right">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${
                         post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                       }`}>
                         <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${post.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                         {post.status}
                       </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
