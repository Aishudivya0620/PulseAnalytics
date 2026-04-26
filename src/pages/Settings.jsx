import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Bell, Shield, User, Clock, CreditCard, Users, Sparkles, Trash2, AlertCircle, ChevronRight, Edit3, X, ZoomIn, ZoomOut, Move } from 'lucide-react';

const CropModal = ({ image, onCrop, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);
  const imageRef = React.useRef(null);

  const handleApply = () => {
    const canvas = document.createElement('canvas');
    const img = imageRef.current;
    const container = containerRef.current;
    
    // Set fixed output size
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    const sourceX = (containerRect.left - imgRect.left) * scaleX;
    const sourceY = (containerRect.top - imgRect.top) * scaleY;
    const sourceWidth = containerRect.width * scaleX;
    const sourceHeight = containerRect.height * scaleY;

    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, 400, 400
    );

    onCrop(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full overflow-hidden shadow-2xl border-white/20"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-black text-white tracking-tight">Crop Profile Image</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div 
            ref={containerRef}
            className="relative w-64 h-64 mx-auto rounded-[2rem] overflow-hidden bg-slate-900 border-2 border-primary-500/50 shadow-2xl shadow-primary-500/20"
          >
            <motion.img
              ref={imageRef}
              src={image}
              drag
              dragConstraints={containerRef}
              style={{ x: crop.x, y: crop.y, scale: zoom }}
              onDragEnd={(_, info) => setCrop(prev => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }))}
              className="max-w-none cursor-move"
            />
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3">
              {[...Array(8)].map((_, i) => <div key={i} className="border border-white/10" />)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
              <ZoomOut size={18} className="text-slate-400" />
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-primary-500"
              />
              <ZoomIn size={18} className="text-slate-400" />
            </div>
            <p className="text-[10px] font-black text-slate-500 text-center uppercase tracking-widest flex items-center justify-center gap-2">
              <Move size={12} /> Drag to reposition image
            </p>
          </div>
        </div>

        <div className="p-6 bg-black/20 flex gap-4">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleApply} className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-600/20 transition-all active:scale-95">Apply Crop</button>
        </div>
      </motion.div>
    </div>
  );
};
const IntegrationCard = ({ platform, onStatusChange }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = localStorage.getItem(`${platform.id}_connected`) === 'true';


  const toggleConnect = () => {
    if (isConnected) {
      localStorage.removeItem(`${platform.id}_connected`);
      window.dispatchEvent(new Event('storage'));
      onStatusChange();
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        localStorage.setItem(`${platform.id}_connected`, 'true');
        setIsConnecting(false);
        window.dispatchEvent(new Event('storage'));
        onStatusChange();
      }, 1500);
    }
  };

  return (
    <div 
      className={`p-5 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${
        isConnected 
          ? 'bg-white/5 border-white/20 shadow-2xl' 
          : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
      }`}
    >
      {/* Neon Glow */}
      {isConnected && (
        <div 
          className="absolute -inset-10 blur-[50px] opacity-20 pointer-events-none"
          style={{ background: platform.bg }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-white/20 transition-transform group-hover:scale-110 group-hover:rotate-3"
            style={{ background: platform.bg }}
          >
            {platform.icon}
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{platform.name}</h4>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
              {isConnecting ? 'Connecting...' : (isConnected ? 'Connected ✓' : 'Not Connected')}
            </p>
          </div>
        </div>

        <button
          onClick={toggleConnect}
          disabled={isConnecting}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 ${
            isConnected 
              ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' 
              : 'bg-primary-600 text-white hover:shadow-lg hover:shadow-primary-600/20'
          }`}
        >
          {isConnecting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            isConnected ? 'Disconnect' : 'Connect'
          )}
        </button>
      </div>

      {isConnected && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <Clock size={12} />
            Last synced: 2m ago
          </div>
          <button className="text-[10px] font-black uppercase text-primary-500 hover:underline">Reconnect</button>
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Johnson',
      email: 'alex@pulseanalytics.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
  });
  const [initialProfile] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('General');
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = React.useRef(null);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('storage'));
      setIsSaving(false);
      window.location.reload(); // Refresh to update all components
    }, 1000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onCropComplete = (croppedImage) => {
    setProfile(prev => ({ ...prev, avatar: croppedImage }));
    setTempImage(null);
  };

  const tabs = [
    { name: 'General', icon: User },
    { name: 'Integrations', icon: Sparkles },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Team', icon: Users },
    { name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {tempImage && (
          <CropModal 
            image={tempImage} 
            onCrop={onCropComplete} 
            onCancel={() => setTempImage(null)} 
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Manage your account preferences, team members, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs - Horizontal on Mobile */}
        <div className="lg:col-span-1 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.name 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </div>
                {activeTab === tab.name && <ChevronRight size={16} className="hidden lg:block ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{activeTab} Settings</h3>
              </div>

              <div className="p-8 space-y-8">
                {activeTab === 'General' && (
                  <>
                    <section className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-primary-500 to-accent-blue p-[3px] shadow-xl overflow-hidden">
                            <img 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="w-full h-full rounded-[1.4rem] bg-slate-100 dark:bg-slate-800 object-cover"
                            />
                            <input 
                              type="file" 
                              id="avatar-upload" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                          </div>
                          <label 
                            htmlFor="avatar-upload"
                            className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-primary-600 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                              <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl glass-panel border border-black/5 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-bold" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                              <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl glass-panel border border-black/5 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-bold" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <hr className="border-slate-200 dark:border-slate-700/50" />

                    <section className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Appearance</h4>
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-primary-500/10 text-primary-500' : 'bg-primary-600/10 text-primary-600'}`}>
                            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Dark Mode</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Switch between light and dark themes</p>
                          </div>
                        </div>
                        <button 
                          onClick={toggleTheme}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none ${isDarkMode ? 'bg-primary-600' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'Integrations' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-start gap-4">
                      <AlertCircle className="text-primary-500 shrink-0" size={20} />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Social Account Connections</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Connect your accounts to start tracking real-time engagement and audience growth across all platforms.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E1306C', bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
                        { id: 'twitter', name: 'Twitter / X', icon: '🐦', color: '#1DA1F2', bg: '#1DA1F2' },
                        { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5', bg: '#0077B5' },
                        { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2', bg: '#1877F2' },
                        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', bg: 'linear-gradient(45deg, #010101, #EE1D52, #69C9D0)' }
                      ].map((platform) => (
                        <IntegrationCard 
                          key={platform.id} 
                          platform={platform} 
                          onStatusChange={() => setRefresh(prev => prev + 1)} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 italic">Notification preferences will be saved automatically.</p>
                    {[
                      { title: "Push Notifications", desc: "Receive real-time alerts on your browser" },
                      { title: "Email Digest", desc: "Weekly summary of your analytics performance" },
                      { title: "Security Alerts", desc: "Notifications about new logins or changes" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
                            <Bell size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary-600">
                          <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === 'Team' || activeTab === 'Billing' || activeTab === 'Security') && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Shield size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{activeTab} Module</h4>
                      <p className="text-sm text-slate-500 max-w-xs">This feature is part of the Enterprise plan. Please upgrade to gain access.</p>
                    </div>
                    <button className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/25">Upgrade Now</button>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-6 border-t border-black/5 dark:border-white/5">
                  <button 
                    onClick={() => setProfile(initialProfile)}
                    disabled={!hasChanges || isSaving}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/30 transition-all font-bold text-sm disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card border-rose-500/30 overflow-hidden"
          >
            <div className="p-6 border-b border-rose-500/20 bg-rose-500/5">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle size={20} /> Danger Zone
              </h3>
            </div>
            <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently remove your account and all associated data. This action cannot be undone.</p>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};



export default Settings;
