"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { Card } from '../ui/ui-primitives';

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  icon: React.ElementType;
  onEdit: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  title, 
  current, 
  target, 
  icon: Icon, 
  onEdit 
}) => {
  const progress = Math.min(100, (current / target) * 100);
  const remaining = Math.max(0, target - current);

  return (
    <Card className="p-0 overflow-hidden border border-white/5 bg-[#1c2229] flex flex-col h-full shadow-lg shadow-black/20 group">
      <div className="px-5 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Icon size={14} className="text-lime-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
         </div>
         <button 
           onClick={onEdit}
           className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
           title="Edit Goal"
         >
           <Edit2 size={14} />
         </button>
      </div>

      <div className="p-5 flex flex-col justify-between h-full relative">
         <div className="flex items-end justify-between mb-4">
             <div>
               <div className="text-3xl font-bold text-white tracking-tight leading-none">
                 {current} <span className="text-lg text-slate-500 font-medium">km</span>
               </div>
               <div className="text-[10px] text-slate-500 mt-1 font-medium">
                 {remaining > 0 ? `${remaining.toFixed(1)} km to go` : 'Goal achieved!'}
               </div>
             </div>

             <div className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-slate-400">/ {target} km</span>
                  <span className={`text-[10px] font-bold px-1.5 rounded ${progress >= 100 ? 'bg-lime-500/20 text-lime-400' : 'bg-slate-800 text-slate-500'}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
             </div>
         </div>

         {/* Progress Bar */}
         <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1, ease: "circOut" }}
               className={`h-full ${progress >= 100 ? 'bg-gradient-to-r from-lime-500 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-lime-400'}`}
            />
         </div>
      </div>
    </Card>
  );
};

export default GoalCard;