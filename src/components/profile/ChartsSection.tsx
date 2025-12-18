"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Mountain, Footprints } from 'lucide-react';
import { Card } from '../ui/ui-primitives';
import { SportType, ChartPoint } from '@/types';

interface ChartsSectionProps {
  sport: SportType;
  fetcher: (sport: SportType, period: 'week' | 'month') => Promise<ChartPoint[]>;
}

// Separate component for the tooltip content to handle props cleaner
const CustomTooltipContent = ({ active, payload, label, sport }: { active?: boolean, payload?: any[], label?: string, sport: SportType }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartPoint;
    const activityType = sport === 'cycling' ? 'Rides' : (sport === 'walking' ? 'Walks' : 'Runs');

    return (
      <div className="bg-[#1c2229] border border-white/10 rounded-xl shadow-2xl p-4 min-w-[180px]">
        {/* Header */}
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-3 pb-2 border-b border-white/5">
           {data.range || label}
        </p>
        
        <div className="flex flex-col gap-2">
           {/* Primary Metric: Distance */}
           <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Distance</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-lime-400 font-bold text-lg leading-none">{data.value}</span>
                 <span className="text-[10px] text-lime-500/70 font-bold">km</span>
              </div>
           </div>

           {/* Secondary Metrics Grid */}
           <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
              {/* Activity Count */}
              <div className="flex items-center gap-1.5" title={`Total ${activityType}`}>
                 <Activity size={10} className="text-emerald-400" />
                 <span className="text-xs text-slate-200 font-medium">{data.activities} {activityType}</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5" title="Moving Time">
                 <Clock size={10} className="text-amber-400" />
                 <span className="text-xs text-slate-200 font-medium">{data.time}</span>
              </div>

              {/* Elevation */}
              <div className="flex items-center gap-1.5" title="Elevation Gain">
                 <Mountain size={10} className="text-purple-400" />
                 <span className="text-xs text-slate-200 font-medium">{data.elevation}m</span>
              </div>

              {/* Steps (Only for walking) */}
              {sport === 'walking' && data.steps && (
                <div className="flex items-center gap-1.5" title="Total Steps">
                   <Footprints size={10} className="text-orange-400" />
                   <span className="text-xs text-slate-200 font-medium">{data.steps.toLocaleString()}</span>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }
  return null;
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ sport, fetcher }) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetcher(sport, period).then(setData);
  }, [sport, period, fetcher]);

  return (
    <Card className="mb-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Momentum</h3>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
          className="bg-[#101418] border border-white/10 text-xs font-bold text-slate-300 py-1.5 px-3 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer hover:border-blue-500/50 transition-colors"
        >
          <option value="week">Last 12 Weeks</option>
          <option value="month">Last 12 Months</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/> {/* Lime */}
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>   {/* Blue Transparent */}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
            />
            <Tooltip 
              content={<CustomTooltipContent sport={sport} />}
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#a3e635" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChartsSection;