"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, Share2, Award, Plus, Trash2, Activity, ListChecks, History, Calendar } from 'lucide-react';
import { Button } from '../ui/ui-primitives';
import { StatsData, AthleteProfile } from '../../types';

interface EventParticipation {
  id: string;
  name: string;
  place: string;
  time: string;
  distance: string;
}

interface ReceiptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StatsData;
  profile: AthleteProfile;
}

const ReceiptGeneratorModal: React.FC<ReceiptGeneratorModalProps> = ({ isOpen, onClose, stats, profile }) => {
  const [activeTab, setActiveTab] = useState<'strava' | 'participation'>('strava');
  const [statPeriod, setStatPeriod] = useState<'allTime' | 'ytd' | 'thisMonth'>('thisMonth');
  const [participationPeriod, setParticipationPeriod] = useState<'allTime' | 'ytd'>('ytd');
  
  const [events, setEvents] = useState<EventParticipation[]>([
    { id: '1', name: 'City Marathon', place: 'Manila', time: '04:15:20', distance: '42K' }
  ]);

  const receiptRef = useRef<HTMLDivElement>(null);

  const addEvent = () => {
    const newEvent: EventParticipation = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      place: '',
      time: '',
      distance: '5K'
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    if (events.length > 1) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const updateEvent = (id: string, field: keyof EventParticipation, value: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const currentStravaStats = 
    statPeriod === 'allTime' ? stats.allTime : 
    statPeriod === 'ytd' ? stats.ytd : 
    stats.recent.thisMonth;

  const getStatPeriodLabel = () => {
    if (statPeriod === 'allTime') return 'ALL TIME';
    if (statPeriod === 'ytd') return 'CURRENT YEAR';
    return 'CURRENT MONTH';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#101418] border border-white/10 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col lg:flex-row overflow-hidden min-h-[600px]"
        >
          {/* Left: Configuration Side */}
          <div className="w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto max-h-[70vh] lg:max-h-[90vh] custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="text-lime-400" />
                Proof of Performance
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tab Selection */}
            <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl mb-8">
               <button 
                onClick={() => setActiveTab('strava')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'strava' ? 'bg-[#1c2229] text-blue-400 shadow-lg border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 <Activity size={14} /> Strava Audit
               </button>
               <button 
                onClick={() => setActiveTab('participation')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'participation' ? 'bg-[#1c2229] text-lime-400 shadow-lg border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 <ListChecks size={14} /> Participation Log
               </button>
            </div>

            {/* Strava Audit Settings */}
            {activeTab === 'strava' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Verification Period</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setStatPeriod('thisMonth')}
                      className={`py-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${statPeriod === 'thisMonth' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                    >
                      <Calendar size={16} />
                      This Month
                    </button>
                    <button 
                      onClick={() => setStatPeriod('ytd')}
                      className={`py-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${statPeriod === 'ytd' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                    >
                      <History size={16} />
                      This Year
                    </button>
                    <button 
                      onClick={() => setStatPeriod('allTime')}
                      className={`py-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${statPeriod === 'allTime' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                    >
                      <Activity size={16} />
                      All Time
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-xs text-blue-300/60 leading-relaxed italic">
                  This receipt will extract your cumulative stats from Strava including total distance, activities, elevation gain, and active time.
                </div>
              </motion.div>
            )}

            {/* Participation Log Settings */}
            {activeTab === 'participation' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Events Logged ({events.length})</label>
                  <select 
                    value={participationPeriod}
                    onChange={(e) => setParticipationPeriod(e.target.value as 'allTime' | 'ytd')}
                    className="bg-[#1c2229] border border-white/10 text-[10px] font-bold text-slate-300 py-1 px-2 rounded focus:ring-1 focus:ring-lime-500 outline-none cursor-pointer"
                  >
                    <option value="ytd">Current Year</option>
                    <option value="allTime">All Time</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={event.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-600 uppercase">Item #{index + 1}</span>
                        {events.length > 1 && (
                          <button onClick={() => removeEvent(event.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <input 
                            placeholder="Event Name"
                            value={event.name}
                            onChange={(e) => updateEvent(event.id, 'name', e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                          />
                        </div>
                        <input 
                          placeholder="Location"
                          value={event.place}
                          onChange={(e) => updateEvent(event.id, 'place', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                        />
                        <input 
                          placeholder="Time (HH:MM:SS)"
                          value={event.time}
                          onChange={(e) => updateEvent(event.id, 'time', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-500 outline-none"
                        />
                        <div className="col-span-2">
                           <select 
                            value={event.distance}
                            onChange={(e) => updateEvent(event.id, 'distance', e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-500 outline-none appearance-none"
                          >
                            <option>5K</option>
                            <option>10K</option>
                            <option>21K (Half-Marathon)</option>
                            <option>42K (Marathon)</option>
                            <option>50K+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addEvent}
                    className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-lime-400 hover:border-lime-400/50 hover:bg-lime-400/5 transition-all flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Plus size={14} /> Add Event
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex gap-3">
              <Button onClick={handlePrint} className={`flex-1 py-4 flex items-center justify-center gap-2 ${activeTab === 'participation' ? 'bg-lime-600 hover:bg-lime-500 shadow-lime-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}>
                <Printer size={18} /> Print Proof
              </Button>
              <Button onClick={onClose} variant="outline" className="px-6">Cancel</Button>
            </div>
          </div>

          {/* Right: Preview Side */}
          <div className="w-full lg:w-1/2 bg-[#0d1014] p-8 flex items-center justify-center">
            <div className="relative group">
              {/* Receipt Visual */}
              <div 
                ref={receiptRef}
                className="w-[360px] bg-[#f8fafc] text-[#101418] p-8 shadow-2xl relative font-mono text-sm leading-tight print:shadow-none print:w-full min-h-[500px]"
                style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
              >
                {/* Torn Top Edge Effect */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_0%,#0d1014_5px,transparent_6px)] bg-repeat-x bg-[length:12px_8px] -translate-y-1"></div>
                
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="font-black text-2xl tracking-tighter uppercase mb-1">KAINETIC</div>
                  <div className={`text-[10px] uppercase font-bold tracking-[0.2em] border-y border-black/10 py-1 ${activeTab === 'participation' ? 'text-lime-700' : 'text-blue-700'}`}>
                    {activeTab === 'strava' ? 'PERFORMANCE AUDIT' : 'PARTICIPATION LOG'}
                  </div>
                </div>

                {/* Date & Serial */}
                <div className="flex justify-between text-[10px] mb-6">
                  <span>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
                  <span>SN: {Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>

                {/* Athlete Profile Summary */}
                <div className="mb-6 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold opacity-60">ATHLETE:</span>
                    <span className="text-right font-black">{profile.firstname.toUpperCase()} {profile.lastname.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold opacity-60">LOCATION:</span>
                    <span className="text-right">{profile.city.toUpperCase()}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-black/20 my-4"></div>

                {/* Content: Strava Audit */}
                {activeTab === 'strava' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-[10px] font-black uppercase mb-4 opacity-40">Period: {getStatPeriodLabel()}</div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">TOTAL DISTANCE</span>
                        <div className="text-right">
                          <span className="text-2xl font-black">{currentStravaStats.distance.toLocaleString()}</span>
                          <span className="text-xs font-bold ml-1">KM</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">ACTIVITIES</span>
                        <span className="text-xl font-black">{currentStravaStats.activities}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">ELEVATION GAIN</span>
                        <div className="text-right">
                          <span className="text-xl font-black">{currentStravaStats.elevation.toLocaleString()}</span>
                          <span className="text-xs font-bold ml-1">M</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">ACTIVE TIME</span>
                        <span className="text-lg font-black">{currentStravaStats.time}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Content: Participation Log */}
                {activeTab === 'participation' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-[10px] font-black uppercase mb-4 opacity-40">Records: {participationPeriod === 'allTime' ? 'ALL TIME' : 'CURRENT YEAR'}</div>
                    <div className="space-y-4">
                      {events.map((e, i) => (
                        <div key={e.id} className="text-xs space-y-1">
                          <div className="flex justify-between font-black">
                            <span className="max-w-[200px] truncate">ITEM {i+1}: {e.name.toUpperCase() || 'UNTITLED EVENT'}</span>
                            <span>{e.distance}</span>
                          </div>
                          <div className="flex justify-between opacity-70">
                            <span>{e.place.toUpperCase() || 'UNKNOWN'}</span>
                            <span>{e.time || '--:--:--'}</span>
                          </div>
                          {i < events.length - 1 && <div className="border-b border-black/5 pt-1"></div>}
                        </div>
                      ))}
                      
                      <div className="border-t border-black/10 pt-4 mt-4">
                         <div className="flex justify-between items-center">
                            <span className="font-black text-xs">LOGGED TOTAL DISTANCE</span>
                            <span className="font-black text-xl">
                                {events.reduce((acc, curr) => {
                                  const dist = parseFloat(curr.distance);
                                  return acc + (isNaN(dist) ? 0 : dist);
                                }, 0)}K
                            </span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="border-t border-dashed border-black/20 my-6"></div>

                {/* Footer Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${activeTab === 'strava' ? 'text-blue-700' : 'text-lime-700'}`}>
                      <ShieldCheck size={12} />
                      {activeTab === 'strava' ? 'VERIFIED PERFORMANCE' : 'CERTIFIED ENTRY'}
                    </div>
                    <div className="text-[8px] opacity-40 uppercase tracking-tighter">Generated via Kainetic Momentum Core</div>
                  </div>
                  <div className="w-10 h-10 border border-black/10 rounded flex items-center justify-center">
                     <div className="grid grid-cols-4 gap-0.5 opacity-20">
                        {Array.from({length: 16}).map((_, i) => <div key={i} className={`w-1 h-1 bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>)}
                     </div>
                  </div>
                </div>

                <div className="text-[9px] text-center opacity-30 mt-4 leading-tight italic">
                  * This document is a stylized visualization and does not serve as a legal identity or official sports certification.
                </div>

                {/* Torn Bottom Edge Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_100%,#0d1014_5px,transparent_6px)] bg-repeat-x bg-[length:12px_8px] translate-y-1"></div>
              </div>

              {/* Share Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Share2 />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Share Achievement</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReceiptGeneratorModal;