"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Mountain, Wind, TrendingUp, Heart, Trophy, CloudRain, Gauge } from 'lucide-react';
import { Card } from '../ui/ui-primitives';
import { SportType, WeeklyStoryData } from '../../types';

interface WeeklyStoryProps {
  sport: SportType;
  fetcher: (sport: SportType) => Promise<WeeklyStoryData>;
}

const WeeklyStory: React.FC<WeeklyStoryProps> = ({ sport, fetcher }) => {
  const [data, setData] = useState<WeeklyStoryData | null>(null);

  useEffect(() => {
    fetcher(sport).then(setData);
  }, [sport, fetcher]);

  if (!data) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'zap': return <Zap size={18} />;
      case 'mountain': return <Mountain size={18} />;
      case 'wind': return <Wind size={18} />;
      case 'trending-up': return <TrendingUp size={18} />;
      case 'heart': return <Heart size={18} />;
      case 'cloud-rain': return <CloudRain size={18} />;
      case 'gauge': return <Gauge size={18} />;
      default: return <Trophy size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden border border-purple-500/20 bg-gradient-to-br from-[#1c2229] via-[#1c2229] to-[#2e106520] p-6">
        
        {/* Header with Sparkles */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-white shadow-lg shadow-purple-500/20">
            <Sparkles size={16} fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Weekly Recap</h3>
          <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 ml-2">
            AI Generated
          </span>
        </div>

        {/* AI Summary Text */}
        <div className="mb-8 relative z-10">
          <p className="text-slate-300 text-sm md:text-base leading-relaxed italic font-light border-l-2 border-purple-500/50 pl-4 py-1">
            "{data.summary}"
          </p>
        </div>

        {/* Deep Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {data.insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${insight.bgColor} ${insight.color} group-hover:scale-110 transition-transform`}>
                  {getIcon(insight.icon)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {insight.label}
                </div>
                <div className="text-lg font-bold text-white">
                  {insight.value}
                </div>
                <div className="text-xs text-slate-400 leading-tight">
                  {insight.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </Card>
    </motion.div>
  );
};

export default WeeklyStory;