"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/ui-primitives';
import { SportType } from '../../types';

interface HeatmapProps {  
  sport: SportType;
  fetcher: (sport: SportType) => Promise<number[]>;
}

const Heatmap: React.FC<HeatmapProps> = ({ sport, fetcher }) => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetcher(sport).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [sport, fetcher]);

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-[#0f0e14]';      // Dark background
      case 1: return 'bg-[#a3e63533]';    // Transparent Lime (Low - 20%)
      case 2: return 'bg-[#a3e63566]';    // Lime (Mid-Low - 40%)
      case 3: return 'bg-[#a3e63599]';    // Lime (Mid-High - 60%)
      case 4: return 'bg-[#a3e635]';      // Lime (Max - 100%)
      default: return 'bg-[#0f0e14]';
    }
  };

  const getWeeks = (flatData: number[]) => {
    const weeks = [];
    for (let i = 0; i < flatData.length; i += 7) {
      weeks.push(flatData.slice(i, i + 7));
    }
    return weeks;
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderMonthLabels = () => {
    return (
      <div className="flex text-[10px] text-slate-500 font-medium mb-2 px-1 justify-between">
         {months.map((m, i) => (
           <span key={i}>{m}</span>
         ))}
      </div>
    );
  };

  return (
    <Card className="mb-8 overflow-hidden border-white/5 bg-gradient-to-b from-[#1c2229] to-[#161b22] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Consistency</h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
          <span>Less</span>
          <div className="flex gap-[3px]">
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getColor(0)} border border-white/5`}></div>
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getColor(1)}`}></div>
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getColor(2)}`}></div>
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getColor(3)}`}></div>
            <div className={`w-2.5 h-2.5 rounded-[2px] ${getColor(4)}`}></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      {loading ? (
        <div className="h-32 w-full bg-slate-800/50 animate-pulse rounded-lg" />
      ) : (
        <div className="w-full overflow-x-auto no-scrollbar pb-2">
           <div className="min-w-[600px]">
             {renderMonthLabels()}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
               className="grid grid-rows-7 grid-flow-col gap-[4px]"
             >
               {data.map((intensity, i) => (
                 <motion.div
                   key={i}
                   whileHover={{ scale: 1.4, zIndex: 10, borderRadius: '4px' }}
                   className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] ${getColor(intensity)} transition-all duration-300 ${intensity === 0 ? 'border border-white/5' : ''}`}
                   title={`Day ${i + 1}: Level ${intensity}`}
                 />
               ))}
             </motion.div>
           </div>
        </div>
      )}
    </Card>
  );
};

export default Heatmap;