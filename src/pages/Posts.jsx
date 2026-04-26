import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, X, Plus, Calendar, MessageCircle, Heart, Share2, Edit3, Trash2, Eye, Sparkles, ChevronDown } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { formatNumber } from '../utils/formatters';
import { POSTS_DATA, PLATFORMS, STATUSES, SORT_OPTIONS, PLATFORM_META } from '../data/postsData';

const Posts = () => {
  const { platform, setPlatform } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [posts, setPosts] = useState(POSTS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: '',
    platform: 'Instagram',
    content: '',
    status: 'Draft',
  });

  // Filtering and Sorting Logic
  const processedPosts = useMemo(() => {
    let result = [...posts];

    // Platform Filter
    if (platform !== 'All Platforms') {
      result = result.filter(post => post.platform === platform);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(post => post.status === statusFilter);
    }

    // Search Filter
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      const engA = (a.likes || 0) + (a.comments || 0);
      const engB = (b.likes || 0) + (b.comments || 0);

      switch (sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'eng-desc': return engB - engA;
        case 'eng-asc': return engA - engB;
        default: return 0;
      }
    });

    return result;
  }, [posts, platform, statusFilter, searchTerm, sortBy]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const postToAdd = {
      ...newPost,
      id: posts.length + 1,
      likes: 0,
      comments: 0,
      shares: 0,
      date: new Date().toISOString().split('T')[0],
    };
    setPosts([postToAdd, ...posts]);
    setIsModalOpen(false);
    setNewPost({ title: '', platform: 'Instagram', content: '', status: 'Draft' });
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    setActionMenuId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Scheduled': return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
      case 'Draft': return 'text-slate-400 bg-white/5 border-white/10';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

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
            Content <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-blue">Command</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Orchestrate and analyze your <span className="text-primary-500 font-bold">{processedPosts.length}</span> active posts
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="w-full lg:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-primary-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
           >
             <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
             CREATE POST
           </button>
        </div>
      </div>

      {/* ── Filters & Actions ── */}
      <div className="glass-card p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title or content (⌘+F)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-panel border border-white/10 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary-500/50 transition-all shadow-inner bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {/* Platform Filter */}
          <div className="relative group w-full">
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full appearance-none glass-panel border border-white/10 pl-4 pr-10 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:bg-primary-500/10 transition-all bg-transparent"
            >
              {PLATFORMS.map(p => <option key={p} value={p} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative group w-full">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 pl-4 pr-10 py-3 rounded-2xl text-sm font-bold text-slate-300 outline-none cursor-pointer hover:bg-white/10 transition-all bg-transparent"
            >
              {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative group w-full">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 pl-4 pr-10 py-3 rounded-2xl text-sm font-bold text-slate-300 outline-none cursor-pointer hover:bg-white/10 transition-all bg-transparent"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Posts Table ── */}
      <div className="glass-card !overflow-visible">
        <div className="overflow-x-auto pb-32">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Post Details</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Network</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Metrics</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timeline</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedPosts.length > 0 ? (
                processedPosts.map((post, i) => (
                  <motion.tr 
                    key={post.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors group relative ${actionMenuId === post.id ? 'z-30' : 'z-10'}`}
                  >
                    <td className="py-6 px-8 max-w-xs">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors truncate">{post.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold line-clamp-1">{post.content}</p>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-lg">
                           {PLATFORM_META[post.platform]?.emoji}
                        </div>
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{post.platform}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-rose-500 mb-1">
                              <Heart size={14} className="fill-current" />
                              <span className="text-sm font-black text-slate-900 dark:text-white">{formatNumber(post.likes)}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-primary-500">
                              <MessageCircle size={14} className="fill-current" />
                              <span className="text-xs font-black text-slate-400 dark:text-slate-500">{formatNumber(post.comments)}</span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs font-black tracking-tight">{post.date}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-center relative">
                      <button 
                        onClick={() => setActionMenuId(actionMenuId === post.id ? null : post.id)}
                        className="p-3 text-slate-400 hover:text-primary-500 transition-all rounded-xl hover:bg-primary-500/10 active:scale-90"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* Actions Dropdown */}
                      <AnimatePresence>
                        {actionMenuId === post.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 z-[100] w-48 glass-panel rounded-2xl shadow-2xl border border-white/10 p-1.5 overflow-hidden backdrop-blur-3xl"
                          >
                            <button 
                              onClick={() => { setSelectedPost(post); setActionMenuId(null); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                 <Eye size={14} />
                              </div>
                              VIEW INSIGHTS
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                 <Edit3 size={14} />
                              </div>
                              EDIT POST
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                 <Trash2 size={14} />
                              </div>
                              DELETE
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl animate-bounce">
                        🛰️
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-black text-white">No signals found</p>
                        <p className="text-sm text-slate-500 font-medium">Try adjusting your spectral filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create New Post Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-card w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                      <Plus size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white">Draft Strategy</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Content Creation Engine</p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Post Campaign Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="E.g. Summer Launch 2024"
                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-primary-500/50 transition-all"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Network Target</label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl text-sm font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                        value={newPost.platform}
                        onChange={(e) => setNewPost({...newPost, platform: e.target.value})}
                      >
                        {PLATFORMS.filter(p => p !== 'All Platforms').map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lifecycle Status</label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl text-sm font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                        value={newPost.status}
                        onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                      >
                        {STATUSES.filter(s => s !== 'All').map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Creative Content</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Write the future of your brand..."
                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-2xl text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-primary-500/50 transition-all resize-none"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-xl shadow-primary-600/20 transition-all font-black text-[11px] uppercase tracking-widest"
                  >
                    Deploy Strategy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── View Details Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-card w-full max-w-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-accent-blue to-emerald-500"></div>
              
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                       {PLATFORM_META[selectedPost.platform]?.emoji}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">{selectedPost.title}</h2>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{selectedPost.platform}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-600" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedPost.date}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-3 text-slate-500 hover:text-white transition-all rounded-2xl bg-white/5"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                  <Sparkles size={16} className="absolute top-4 right-4 text-primary-500 opacity-40" />
                  <p className="text-lg font-medium leading-relaxed text-slate-300 italic">
                    "{selectedPost.content}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5 border border-white/5 group hover:border-rose-500/30 transition-all">
                    <span className="text-3xl mb-3 group-hover:scale-125 transition-transform">❤️</span>
                    <span className="text-2xl font-black text-white">{formatNumber(selectedPost.likes)}</span>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Likes</span>
                  </div>
                  <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5 border border-white/5 group hover:border-primary-500/30 transition-all">
                    <span className="text-3xl mb-3 group-hover:scale-125 transition-transform">💬</span>
                    <span className="text-2xl font-black text-white">{formatNumber(selectedPost.comments)}</span>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Comments</span>
                  </div>
                  <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
                    <span className="text-3xl mb-3 group-hover:scale-125 transition-transform">🚀</span>
                    <span className="text-2xl font-black text-white">{formatNumber(selectedPost.shares || 0)}</span>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Viral Score</span>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-4">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all"
                  >
                    Dismiss
                  </button>
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl shadow-2xl transition-all font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 active:scale-95">
                    VIEW ON {selectedPost.platform.toUpperCase()}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Posts;

