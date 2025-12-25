"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Map, Clock, Mountain, ArrowUpRight, ArrowDownRight, TrendingUp, Footprints, Target, Calendar, Trophy, Medal } from 'lucide-react';
import { Card } from '../ui/ui-primitives';
import { StatsData, SportType } from '../../types';
import GoalCard from './GoalCard';
import EditGoalModal from './EditGoalModal';
import HighlightsCard from './HighlightsCard';

interface StatsGridProps {
  sport: SportType;
  fetcher: (sport: SportType) => Promise<StatsData>;
}

interface StatCellProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  trend?: number;
  growth?: number;
  addedValue?: string | number;
  className?: string;
}

const StatCell: React.FC<StatCellProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  trend,
  growth,
  addedValue,
  className = "" 
}) => (
  <div className={`p-5 flex flex-col justify-between h-full ${className} group hover:bg-white/[0.02] transition-colors relative`}>
    <div className="flex items-center justify-between mb-2">
       <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform shadow-sm`}>
              <Icon size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{label}</span>
       </div>
    </div>
    
    <div className="mt-1">
      <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">{value}</span>
    </div>

    {trend !== undefined && (
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] text-slate-600 font-medium">vs last year</span>
         <div className={`
            flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold border
            ${trend >= 0 
              ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'}
          `}>
            {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            <span>{Math.abs(trend)}%</span>
         </div>
      </div>
    )}

    {growth !== undefined && addedValue !== undefined && (
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-slate-600 font-medium">Year to Date</span>
          <div className="flex items-center gap-1.5">
             <span className="text-[10px] font-semibold text-slate-300">+{addedValue}</span>
             <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1 rounded">
               {growth}%
             </span>
          </div>
      </div>
    )}
  </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ sport, fetcher }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  
  const getDefaultGoals = (s: SportType) => ({
    weekly: s === 'cycling' ? 75 : (s === 'walking' ? 15 : 25),
    monthly: s === 'cycling' ? 300 : (s === 'walking' ? 50 : 100)
  });

  const [goals, setGoals] = useState(getDefaultGoals(sport));
  const [editing, setEditing] = useState<{ type: 'weekly' | 'monthly', title: string } | null>(null);

  useEffect(() => {
    fetcher(sport).then(setStats);
    const defaultGoals = getDefaultGoals(sport);
    // Defer state update to avoid calling setState synchronously within the effect
    Promise.resolve().then(() => setGoals(defaultGoals));
  }, [sport, fetcher]);

  const handleSaveGoal = (val: number) => {
    if (!editing) return;
    setGoals(prev => ({ ...prev, [editing.type]: val }));
    setEditing(null);
  };

  if (!stats) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="h-64 w-full bg-[#1c2229] animate-pulse rounded-2xl"></div>
      <div className="h-64 w-full bg-[#1c2229] animate-pulse rounded-2xl"></div>
      <div className="h-40 w-full bg-[#1c2229] animate-pulse rounded-2xl"></div>
      <div className="h-40 w-full bg-[#1c2229] animate-pulse rounded-2xl"></div>
    </div>
  );

  const getActivityLabel = () => {
    switch(sport) {
      case 'cycling': return 'Rides';
      case 'walking': return 'Walks';
      default: return 'Runs';
    }
  };

  const activityLabel = getActivityLabel();
  const currentYear = new Date().getFullYear();
  const isWalking = sport === 'walking';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-0 overflow-hidden border border-white/5 bg-[#1c2229] flex flex-col h-full shadow-lg shadow-black/20">
          <div className="px-5 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">All-Time Totals</h3>
            <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-bold text-blue-400">Lifetime</div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 h-full divide-x divide-y divide-white/5">
            <StatCell 
              icon={Map} 
              label="Total Distance" 
              value={`${stats.allTime.distance.toLocaleString()} km`} 
              color="text-blue-400"
              growth={stats.allTime.growth.distance}
              addedValue={`${stats.ytd.distance.toLocaleString()} km`}
            />
            <StatCell 
              icon={Activity} 
              label={`Total ${activityLabel}`} 
              value={stats.allTime.activities.toLocaleString()} 
              color="text-emerald-400"
              growth={stats.allTime.growth.activities}
              addedValue={stats.ytd.activities.toLocaleString()}
            />
            <StatCell 
              icon={isWalking ? Footprints : Mountain} 
              label={isWalking ? "Total Steps" : "Elevation Gain"} 
              value={isWalking && stats.allTime.steps ? stats.allTime.steps.toLocaleString() : `${stats.allTime.elevation.toLocaleString()} m`} 
              color={isWalking ? "text-orange-400" : "text-purple-400"}
              growth={isWalking && stats.allTime.growth.steps ? stats.allTime.growth.steps : stats.allTime.growth.elevation}
              addedValue={isWalking && stats.ytd.steps ? stats.ytd.steps.toLocaleString() : `${stats.ytd.elevation.toLocaleString()} m`}
            />
            <StatCell 
              icon={Clock} 
              label="Time Active" 
              value={stats.allTime.time} 
              color="text-amber-400"
              growth={stats.allTime.growth.time}
              addedValue={stats.ytd.time}
            />
          </div>
        </Card>

        <Card className="p-0 overflow-hidden border border-white/5 bg-[#1c2229] flex flex-col h-full shadow-lg shadow-black/20">
          <div className="px-5 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">{currentYear} Progress</h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-lime-500/10 border border-lime-500/20 rounded text-[10px] font-bold text-lime-400">
              <TrendingUp size={10} />
              <span>Active Year</span>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 h-full divide-x divide-y divide-white/5">
            <StatCell 
              icon={Map} 
              label="YTD Distance" 
              value={`${stats.ytd.distance.toLocaleString()} km`} 
              color="text-blue-400"
              trend={stats.ytd.trends.distance}
            />
            <StatCell 
              icon={Activity} 
              label={`YTD ${activityLabel}`} 
              value={stats.ytd.activities.toLocaleString()} 
              color="text-emerald-400"
              trend={stats.ytd.trends.activities}
            />
            <StatCell 
              icon={isWalking ? Footprints : Mountain} 
              label={isWalking ? "YTD Steps" : "YTD Elevation"} 
              value={isWalking && stats.ytd.steps ? stats.ytd.steps.toLocaleString() : `${stats.ytd.elevation.toLocaleString()} m`} 
              color={isWalking ? "text-orange-400" : "text-purple-400"}
              trend={isWalking ? stats.ytd.trends.steps : stats.ytd.trends.elevation}
            />
            <StatCell 
              icon={Clock} 
              label="YTD Time" 
              value={stats.ytd.time} 
              color="text-amber-400"
              trend={stats.ytd.trends.time}
            />
          </div>
        </Card>
      </div>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
         <GoalCard 
            title="Weekly Goal" 
            current={stats.recent.thisWeek.distance} 
            target={goals.weekly}
            icon={Target}
            onEdit={() => setEditing({ type: 'weekly', title: 'Weekly Goal' })}
         />
         <GoalCard 
            title="Monthly Goal" 
            current={stats.recent.thisMonth.distance} 
            target={goals.monthly} 
            icon={Calendar}
            onEdit={() => setEditing({ type: 'monthly', title: 'Monthly Goal' })}
         />
      </div>

      {/* Highlights Section (Personal Bests) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <HighlightsCard 
           title="Current Weekly Bests" 
           items={stats.recent.thisWeek.highlights} 
           icon={Trophy}
         />
         <HighlightsCard 
           title="Current Monthly Bests" 
           items={stats.recent.thisMonth.highlights} 
           icon={Medal}
         />
      </div>

      {/* Edit Modal */}
      <EditGoalModal 
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveGoal}
        title={editing?.title || ''}
        currentValue={editing ? goals[editing.type] : 0}
      />

    </motion.div>
  );
};

export default StatsGrid;