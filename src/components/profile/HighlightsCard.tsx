"use client";
import React from 'react';
import { Activity, Map, Clock, Mountain, Footprints, Zap, Timer, Flame } from 'lucide-react';
import { Card } from '../ui/ui-primitives';
import { ActivityHighlight } from '../../types';

interface HighlightsCardProps {
  title: string;
  items: ActivityHighlight[];
  icon: React.ElementType;
}

const HighlightsCard: React.FC<HighlightsCardProps> = ({ title, items, icon: Icon }) => {
  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'map': return <Map size={14} />;
      case 'zap': return <Zap size={14} />;
      case 'mountain': return <Mountain size={14} />;
      case 'clock': return <Clock size={14} />;
      case 'footprints': return <Footprints size={14} />;
      case 'timer': return <Timer size={14} />;
      case 'flame': return <Flame size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <Card className="p-0 overflow-hidden border border-white/5 bg-[#1c2229] flex flex-col h-full shadow-lg shadow-black/20">
      <div className="px-5 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent flex items-center gap-2">
         <Icon size={14} className="text-purple-400" />
         <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {items.map((item, i) => (
           <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0 group">
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                <div className="text-slate-600 group-hover:text-purple-400 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-mono">{item.value}</span>
           </div>
        ))}
      </div>
    </Card>
  );
};

export default HighlightsCard;