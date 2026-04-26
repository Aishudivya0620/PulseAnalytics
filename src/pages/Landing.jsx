import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, BarChart2, Users, FileText, ArrowRight, Zap, Shield, Globe, Sparkles, TrendingUp, Activity } from 'lucide-react';
import DashboardPreview from '../components/DashboardPreview';

const Landing = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-primary-500/30 font-sans">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-blue/5 blur-[100px] rounded-full" />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-blue flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                <BarChart2 className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Pulse<span className="text-primary-400">Analytics</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
               {['Features', 'Intelligence', 'Pricing', 'Resources'].map(item => (
                 <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">{item}</a>
               ))}
            </div>

            <div className="flex items-center gap-6">
              {isAuth ? (
                <Link to="/dashboard" className="px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl text-sm font-black transition-all active:scale-95 shadow-xl shadow-white/10">
                  DASHBOARD
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-black text-slate-400 hover:text-white transition-colors tracking-widest uppercase">
                    Login
                  </Link>
                  <Link to="/login" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-black transition-all active:scale-95 shadow-xl shadow-primary-600/20 uppercase tracking-widest">
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-40 px-6 overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto text-center space-y-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Platform V2.0 Now Live
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] max-w-5xl mx-auto">
            Decipher Your <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-blue to-accent-green">Social DNA</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The next-generation intelligence layer for creators and brands. Real-time metrics, predictive growth patterns, and cross-platform synergy.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link 
              to={isAuth ? "/dashboard" : "/login"} 
              className="w-full sm:w-auto px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-sm font-black shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isAuth ? "Enter Dashboard" : "Initiate Growth"} <ArrowRight size={18} />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-black hover:bg-white/10 transition-all shadow-xl backdrop-blur-xl uppercase tracking-widest">
              View Blueprint
            </button>
          </motion.div>

          {/* Live Dashboard Preview */}
          <motion.div variants={itemVariants} className="pt-12">
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Trusted By ── */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Powering Next-Gen Media Houses</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale invert">
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" alt="Google" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-6" alt="IBM" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" className="h-8" alt="Samsung" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_2014_logo_detail.svg" className="h-5" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" className="h-8" alt="Nike" />
            </div>
         </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Engineered for <br /><span className="text-primary-400">Hyper-Growth.</span></h2>
              <p className="text-slate-400 text-lg font-medium">We've eliminated the noise. Get direct, actionable insights that translate to real-world performance.</p>
            </div>
            <div className="pb-2">
               <button className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest group">
                  Explore all features <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={28} />,
                title: "Velocity Tracking",
                desc: "Identify viral potential before it peaks. Our proprietary algorithms detect trend shifts in real-time.",
                color: "text-primary-400 bg-primary-500/10",
                delay: 0
              },
              {
                icon: <Users size={28} />,
                title: "Persona Mapping",
                desc: "Beyond demographics. Understand the psychographics and behavioral patterns of your audience.",
                color: "text-accent-blue bg-accent-blue/10",
                delay: 0.1
              },
              {
                icon: <Globe size={28} />,
                title: "Omni-Channel Sync",
                desc: "Unified attribution for all your social endpoints. Compare cross-platform ROI in one view.",
                color: "text-accent-green bg-accent-green/10",
                delay: 0.2
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                className="glass-card p-10 group"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.color} border border-white/5`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-sm">{feature.desc}</p>
                <div className="mt-8 h-1 w-0 bg-primary-500 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intelligence Section (Interactive-like) ── */}
      <section id="intelligence" className="py-32 px-6 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em]">
                  AI Engine
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9]">Predicting the <span className="text-accent-blue">Unpredictable.</span></h2>
               <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Our neural networks process billions of data points to provide you with a 'Success Probability' score for every draft you create.
               </p>
               <ul className="space-y-4">
                  {[
                    "Viral Probability Indexing",
                    "Sentiment Arc Analysis",
                    "Optimal Posting Frequency AI",
                    "Competitor Strategic Leak Detection"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-4 text-sm font-bold text-slate-300">
                       <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center">
                          <CheckCircle size={14} className="text-accent-blue" />
                       </div>
                       {item}
                    </li>
                  ))}
               </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
               <div className="absolute -inset-4 bg-accent-blue/20 blur-[100px] rounded-full" />
               <div className="glass-card p-4 relative border border-white/20">
                  <div className="bg-slate-900 rounded-[1.8rem] overflow-hidden aspect-[4/3] relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-transparent p-12">
                        <div className="space-y-6">
                           {[85, 92, 78].map((w, i) => (
                             <div key={i} className="h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${w}%` }}
                                  transition={{ duration: 1.5, delay: i * 0.2 }}
                                  className="h-full bg-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.5)]" 
                                />
                             </div>
                           ))}
                           <div className="pt-8 flex justify-center">
                              <div className="w-32 h-32 rounded-full border-8 border-accent-blue/20 border-t-accent-blue animate-spin" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Floating Data Card */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -bottom-10 -right-10 glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl"
               >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Forecast</p>
                  <p className="text-3xl font-black text-white">+142%</p>
                  <div className="mt-4 flex items-center gap-2 text-accent-green text-[10px] font-black">
                     <TrendingUp size={12} /> STABLE GROWTH
                  </div>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white">Tiered Access.</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">Scale your intelligence as you scale your brand.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Individual",
                price: "0",
                features: ["3 Social Endpoints", "Standard Analytics", "7-Day Historical Data", "Basic Export"],
                cta: "Begin Journey",
                popular: false
              },
              {
                name: "Collective",
                price: "49",
                features: ["Unlimited Endpoints", "Advanced AI Engine", "Full Historical Archive", "Daily Growth Sprints", "Custom Branding"],
                cta: "Scale Now",
                popular: true
              },
              {
                name: "Dominion",
                price: "199",
                features: ["White-Glove Support", "Dedicated Strategist", "API Node Access", "Full Team Cluster", "Legal Compliance Hub"],
                cta: "Establish Command",
                popular: false
              }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[3rem] border ${plan.popular ? 'border-primary-500 bg-primary-500/[0.03] shadow-2xl shadow-primary-500/10' : 'border-white/5 bg-white/[0.02]'} flex flex-col relative group hover:border-white/20 transition-all duration-500`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-primary-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.3em] shadow-xl">Preferred Choice</span>
                )}
                <div className="mb-10">
                  <h3 className="text-xl font-black text-slate-400 mb-4 group-hover:text-white transition-colors">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                         <CheckCircle size={14} className="text-primary-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/login"
                  className={`w-full py-5 rounded-2xl text-center text-xs font-black transition-all uppercase tracking-[0.2em] ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="py-40 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary-600 via-primary-700 to-accent-blue p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary-600/20"
        >
          {/* Animated circles */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">Become <br /> Inevitable.</h2>
            <p className="text-primary-100 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Start growing. PulseAnalytics provides the blueprint for digital dominance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="px-12 py-6 bg-white text-primary-600 rounded-2xl text-sm font-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Ignite Trial</Link>
              <button className="px-12 py-6 bg-transparent text-white border border-white/30 rounded-2xl text-sm font-black backdrop-blur-md hover:bg-white/10 transition-all uppercase tracking-widest">Connect to Node</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-24 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <BarChart2 className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Pulse<span className="text-primary-400">Analytics</span></span>
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-xs">Precision engineering for the modern creator economy. Built in Silicon Valley.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
             <div className="space-y-6">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Intelligence</p>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-primary-400 transition-colors">Growth</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">Retention</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">Yield</a>
                </div>
             </div>
             <div className="space-y-6">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Company</p>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-primary-400 transition-colors">Manifesto</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">Careers</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                </div>
             </div>
             <div className="space-y-6">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Social</p>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-primary-400 transition-colors">Twitter</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">Discord</a>
                   <a href="#" className="hover:text-primary-400 transition-colors">GitHub</a>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">&copy; 2024 PULSE ANALYTICS INC. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer">
                 <Shield size={14} />
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer">
                 <Activity size={14} />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
