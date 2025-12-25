"use client";

import { motion } from 'framer-motion';
import { TrendingUp, Mountain, Timer, Zap } from 'lucide-react';

export const FloatingWrapper = ({ children, delay = 0, duration = 6, yOffset = 15, className }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}) => (
  <div className={`absolute ${className}`}>
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  </div>
);

export const ChartCard = () => (
  <div className="bg-[#1c2229]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl w-[280px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] cursor-default hover:border-blue-500/30 transition-colors relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
    <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
            <TrendingUp size={12} className="text-blue-400" /> Weekly Trend
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">1,240 km</div>
        </div>
        <div className="px-2 py-1 bg-lime-500/10 border border-lime-500/20 rounded-lg text-xs text-lime-400 font-bold">+12.5%</div>
    </div>
    <div className="flex items-end justify-between gap-2 h-24">
        {[35, 55, 45, 80, 60, 95, 75].map((h, i) => (
          <div key={i} className="w-full bg-blue-900/10 rounded-sm relative overflow-hidden h-full flex items-end">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, ease: "circOut" }}
              className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
    </div>
  </div>
);

export const StatsCard = () => (
  <div className="bg-[#1c2229]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] flex flex-col gap-4 w-60 cursor-default hover:border-purple-500/30 transition-colors">
      <div className="flex items-center gap-4 border-b border-white/5 pb-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10"><Mountain size={18} /></div>
          <div><div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Elevation</div><div className="text-base font-bold text-white tracking-tight">45,200m</div></div>
      </div>
      <div className="flex items-center gap-4">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/10"><Timer size={18} /></div>
          <div><div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Active Time</div><div className="text-base font-bold text-white tracking-tight">340h 15m</div></div>
      </div>
  </div>
);

export const PRCard = () => (
  <div className="bg-[#161b22]/95 backdrop-blur-xl border border-white/10 p-3 pr-5 rounded-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] flex items-center gap-4 cursor-default hover:border-lime-500/30 transition-colors min-w-[200px]">
    <div className="bg-lime-500/20 p-2.5 rounded-lg text-lime-400"><Zap size={20} fill="currentColor" /></div>
    <div>
      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Fastest 5K</div>
      <div className="text-lg font-bold text-white tracking-tight">19:42 <span className="text-[10px] text-lime-400 font-bold ml-1 align-top">PR</span></div>
    </div>
  </div>
);
