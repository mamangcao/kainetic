"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, Share2, Award, Plus, Trash2, Activity, ListChecks, History, Calendar, Eye, Download, Trophy } from 'lucide-react';
import { Button } from '../ui/ui-primitives';
import { StatsData, AthleteProfile } from '../../types';

interface EventParticipation {
  id: string;
  name: string;
  place: string;
  time: string;
  distance: string;
}

interface ManualPRs {
  [key: string]: string;
}

interface HtmlToImage {
  toBlob(node: HTMLElement, options?: { backgroundColor?: string; pixelRatio?: number }): Promise<Blob | null>;
}

interface WindowWithHtmlToImage extends Window {
  htmlToImage?: HtmlToImage;
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
  const [showPreview, setShowPreview] = useState(false);
  
  // Manual PRs State
  const [manualPRs, setManualPRs] = useState<ManualPRs>({
    '5K': '',
    '10K': '',
    '15K': '',
    '21K': '',
    '30K': '',
    '42K': ''
  });

  const [events, setEvents] = useState<EventParticipation[]>([
    { id: '1', name: 'City Marathon', place: 'Iligan City', time: '01:15:20', distance: '5K' }
  ]);

  const receiptRef = useRef<HTMLDivElement>(null);
  const prDistances = ['5K', '10K', '15K', '21K', '30K', '42K'];

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

  const updatePR = (distance: string, time: string) => {
    setManualPRs(prev => ({ ...prev, [distance]: time }));
  };

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;

    try {
      let htmlToImage: HtmlToImage | undefined;

      const win = window as unknown as WindowWithHtmlToImage;

      if (win.htmlToImage) {
        htmlToImage = win.htmlToImage;
      } else {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.min.js';
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
        htmlToImage = win.htmlToImage;
      }

      if (!htmlToImage) throw new Error('Could not load html-to-image module');

      const blob = await htmlToImage.toBlob(receiptRef.current, {
        backgroundColor: '#f8fafc',
        pixelRatio: 2,
      });

      return blob;
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Generation failed: ${(error as Error).message}`);
      return null;
    }
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;

    // 1. Clone the receipt element
    const clone = receiptRef.current.cloneNode(true) as HTMLElement;
    
    // 2. Add a specific class for identification
    clone.classList.add('print-clone');
    
    // 3. Style the clone to be print-ready and overlay everything
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100%';
    clone.style.zIndex = '2147483647'; // Max z-index
    clone.style.backgroundColor = '#f8fafc'; 
    clone.style.margin = '0';
    
    // 4. Append to body
    document.body.appendChild(clone);

    // 5. Inject Print CSS to hide everything else and style the clone
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body > *:not(.print-clone) {
          display: none !important;
        }
        .print-clone {
          display: block !important;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          margin: 20px auto !important; /* Center horizontally with top margin */
          width: 100% !important;
          max-width: 380px !important; /* Force typical receipt width */
          box-shadow: none !important;
        }
        @page {
          size: auto;
          margin: 0mm;
        }
      }
    `;
    document.head.appendChild(style);

    // 6. Print
    window.print();

    // 7. Cleanup
    // Delay cleanup to ensure print dialog renders on mobile
    setTimeout(() => {
      document.body.removeChild(clone);
      document.head.removeChild(style);
    }, 1000);
  };

  const handleShare = async () => {
    const blob = await generateImageBlob();
    if (!blob) {
      alert('Failed to generate receipt image.');
      return;
    }

    const file = new File([blob], 'kainetic-receipt.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'My Kainetic Stats',
          text: 'Check out my verified performance receipt from Kainetic!',
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
          // Fallback to clipboard if share fails (but not if cancelled)
          copyToClipboard(blob);
        }
      }
    } else {
      copyToClipboard(blob);
    }
  };

  const copyToClipboard = async (blob: Blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Receipt copied to clipboard!');
    } catch (err) {
      console.error('Clipboard write failed:', err);
      alert('Could not share or copy image. Please try downloading instead.');
    }
  };

  const handleDownload = async () => {
    const blob = await generateImageBlob();
    if (!blob) {
      alert('Failed to generate receipt image.');
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `kainetic-${activeTab}-proof-${new Date().getTime()}.png`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-[#101418] w-full h-full lg:h-auto lg:max-w-6xl lg:rounded-3xl lg:border lg:border-white/10 lg:shadow-2xl flex flex-col lg:flex-row overflow-hidden lg:min-h-[600px] lg:max-h-[90vh] relative z-[200]"
        >
          {/* Configuration Side */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 sm:p-6 lg:p-8 border-b border-white/5 bg-[#101418]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Award className="text-lime-400 w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Proof of Performance</span>
                  <span className="sm:hidden">Proof</span>
                </h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar pb-28">
              <div className="flex p-1 bg-black/40 border border-white/5 rounded-xl lg:rounded-2xl mb-6 lg:mb-8">
                <button 
                  onClick={() => setActiveTab('strava')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg lg:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${activeTab === 'strava' ? 'bg-[#1c2229] text-blue-400 shadow-lg border border-white/5' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}`}
                >
                  <Activity size={12} className="sm:w-3.5 sm:h-3.5" /> 
                  <span className="hidden sm:inline">Strava Audit</span>
                  <span className="sm:hidden">Strava</span>
                </button>
                <button 
                  onClick={() => setActiveTab('participation')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg lg:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${activeTab === 'participation' ? 'bg-[#1c2229] text-lime-400 shadow-lg border border-white/5' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}`}
                >
                  <ListChecks size={12} className="sm:w-3.5 sm:h-3.5" /> 
                  <span className="hidden sm:inline">Participation Log</span>
                  <span className="sm:hidden">Events</span>
                </button>
              </div>

              {activeTab === 'strava' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 sm:mb-4">Verification Period</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button 
                        onClick={() => setStatPeriod('thisMonth')}
                        className={`py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${statPeriod === 'thisMonth' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                      >
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span className="sm:inline hidden">This Month</span>
                        <span className="sm:hidden">Month</span>
                      </button>
                      <button 
                        onClick={() => setStatPeriod('ytd')}
                        className={`py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${statPeriod === 'ytd' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                      >
                        <History size={14} className="sm:w-4 sm:h-4" />
                        <span className="sm:inline hidden">This Year</span>
                        <span className="sm:hidden">Year</span>
                      </button>
                      <button 
                        onClick={() => setStatPeriod('allTime')}
                        className={`py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${statPeriod === 'allTime' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-slate-500'}`}
                      >
                        <Activity size={14} className="sm:w-4 sm:h-4" />
                        <span className="sm:inline hidden">All Time</span>
                        <span className="sm:hidden">All</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual PR Entry for Year/All-Time */}
                  {statPeriod !== 'thisMonth' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Trophy size={14} className="text-lime-400" />
                         <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Personal Records (Manual)</label>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {prDistances.map((dist) => (
                          <div key={dist} className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-600 uppercase ml-1">{dist} Time</span>
                            <input 
                              placeholder="HH:MM:SS"
                              value={manualPRs[dist]}
                              onChange={(e) => updatePR(dist, e.target.value)}
                              className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-lime-500 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {statPeriod === 'thisMonth' && (
                    <div className="p-3 sm:p-4 bg-lime-500/5 rounded-xl border border-lime-500/10 text-[10px] sm:text-xs text-lime-300/60 leading-relaxed italic">
                      For &quot;This Month&quot;, your top verified performances and fastest segments will be automatically included in the proof.
                    </div>
                  )}

                  <div className="p-3 sm:p-4 bg-blue-500/5 rounded-xl sm:rounded-2xl border border-blue-500/10 text-[10px] sm:text-xs text-blue-300/60 leading-relaxed italic">
                    This receipt will extract your cumulative stats from Strava including total distance, runs, elevation gain, and active time.
                  </div>
                </motion.div>
              )}

              {activeTab === 'participation' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Events ({events.length})</label>
                    <select 
                      value={participationPeriod}
                      onChange={(e) => setParticipationPeriod(e.target.value as 'allTime' | 'ytd')}
                      className="bg-[#1c2229] border border-white/10 text-[9px] sm:text-[10px] font-bold text-slate-300 py-1 px-2 rounded focus:ring-1 focus:ring-lime-500 outline-none cursor-pointer"
                    >
                      <option value="ytd">Current Year</option>
                      <option value="allTime">All Time</option>
                    </select>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {events.map((event, index) => (
                      <div key={event.id} className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 relative group">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase">Item #{index + 1}</span>
                          {events.length > 1 && (
                            <button onClick={() => removeEvent(event.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                              <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="col-span-2">
                            <input 
                              placeholder="Event Name"
                              value={event.name}
                              onChange={(e) => updateEvent(event.id, 'name', e.target.value)}
                              className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none"
                            />
                          </div>
                          <input 
                            placeholder="Location"
                            value={event.place}
                            onChange={(e) => updateEvent(event.id, 'place', e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none"
                          />
                          <input 
                            placeholder="Time (HH:MM:SS)"
                            value={event.time}
                            onChange={(e) => updateEvent(event.id, 'time', e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none"
                          />
                          <div className="col-span-2">
                            <select 
                              value={event.distance}
                              onChange={(e) => updateEvent(event.id, 'distance', e.target.value)}
                              className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white focus:border-lime-500 outline-none appearance-none"
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
                      className="w-full py-2.5 sm:py-3 border border-dashed border-white/10 rounded-xl sm:rounded-2xl text-slate-500 hover:text-lime-400 hover:border-lime-400/50 hover:bg-lime-400/5 transition-all flex items-center justify-center gap-2 font-bold text-[10px] sm:text-xs cursor-pointer"
                    >
                      <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Add Event
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex-shrink-0 p-2 sm:p-6 lg:p-8 border-t border-white/5 bg-[#101418] lg:static fixed bottom-0 left-0 right-0 z-[210]">
              <div className="flex flex-col gap-2 lg:hidden">
                <Button 
                  onClick={() => setShowPreview(true)} 
                  className="w-full py-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                >
                  <Eye size={16} /> Preview
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownload} 
                    className={`flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'participation' ? 'bg-lime-600 hover:bg-lime-500 shadow-lime-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                  >
                    <Download size={16} /> 
                    <span>Save</span>
                  </Button>
                  <Button 
                    onClick={handleShare} 
                    className="flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                  >
                    <Share2 size={16} /> 
                    <span>Share</span>
                  </Button>
                  <Button 
                    onClick={handlePrint} 
                    className="flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                  >
                    <Printer size={16} /> 
                    <span>Print</span>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:flex gap-3">
                <Button 
                  onClick={handleDownload} 
                  className={`flex-1 py-4 flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'participation' ? 'bg-lime-600 hover:bg-lime-500 shadow-lime-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                >
                  <Download size={18} /> Download
                </Button>
                <Button 
                  onClick={handlePrint} 
                  className="flex-1 py-4 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                >
                  <Printer size={18} /> Print
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1 py-4 cursor-pointer">Cancel</Button>
              </div>
            </div>
          </div>

          <div className={`${showPreview ? 'fixed inset-0 z-[220]' : 'fixed left-[-9999px] top-0 w-full h-full z-[-1] opacity-0 pointer-events-none'} lg:relative lg:flex lg:inset-auto lg:z-auto lg:opacity-100 lg:pointer-events-auto w-full lg:w-1/2 bg-[#0d1014] flex flex-col`}>
            <button 
              onClick={() => setShowPreview(false)}
              className="lg:hidden absolute top-4 right-4 z-10 p-2 bg-black/80 backdrop-blur-sm rounded-full text-white hover:bg-black transition-colors shadow-lg border border-white/20"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">
              <div className="min-h-full flex items-center justify-center p-4 pt-16 lg:pt-4 sm:p-6 lg:p-8">
                <div className="relative group w-full max-w-[360px] mx-auto">
              <div 
                ref={receiptRef}
                className="w-full bg-[#f8fafc] text-[#101418] p-6 sm:p-8 shadow-2xl relative font-mono text-sm leading-tight print:shadow-none print:w-full min-h-[500px]"
                style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_0%,#0d1014_5px,transparent_6px)] bg-repeat-x bg-[length:12px_8px] -translate-y-1"></div>
                
                <div className="text-center mb-6">
                  <div className="font-black text-xl sm:text-2xl tracking-tighter uppercase mb-1">KAINETIC</div>
                  <div className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em] border-y border-black/10 py-1 ${activeTab === 'participation' ? 'text-lime-700' : 'text-blue-700'}`}>
                    {activeTab === 'strava' ? 'PERFORMANCE AUDIT' : 'PARTICIPATION LOG'}
                  </div>
                </div>

                <div className="flex justify-between text-[9px] sm:text-[10px] mb-6">
                  <span>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
                  <span>SN: {Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>

                <div className="mb-6 space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold opacity-60">ATHLETE:</span>
                    <span className="text-right font-black">{profile.firstname.toUpperCase()} {profile.lastname.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold opacity-60">LOCATION:</span>
                    <span className="text-right">
                      {[profile.city, profile.country]
                        .filter(Boolean)
                        .map(s => s!.toUpperCase())
                        .join(', ')}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-black/20 my-4"></div>

                {activeTab === 'strava' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-[9px] sm:text-[10px] font-black uppercase mb-4 opacity-40">Period: {getStatPeriodLabel()}</div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs sm:text-sm">TOTAL DISTANCE</span>
                        <div className="text-right">
                          <span className="text-xl sm:text-2xl font-black">{currentStravaStats.distance.toLocaleString()}</span>
                          <span className="text-[10px] sm:text-xs font-bold ml-1">KM</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs sm:text-sm">RUNS</span>
                        <span className="text-lg sm:text-xl font-black">{currentStravaStats.activities}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs sm:text-sm">ELEVATION GAIN</span>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-black">{currentStravaStats.elevation.toLocaleString()}</span>
                          <span className="text-[10px] sm:text-xs font-bold ml-1">M</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs sm:text-sm">ACTIVE TIME</span>
                        <span className="text-base sm:text-lg font-black">{currentStravaStats.time}</span>
                      </div>
                    </div>

                    {/* PRs Section in Receipt */}
                    <div className="pt-2 mt-4">
                       <div className="text-[9px] sm:text-[10px] font-black uppercase mb-3 border-b border-black/10 pb-1">
                         {statPeriod === 'thisMonth' ? 'MONTHLY BESTS' : 'PERSONAL RECORDS'}
                       </div>
                       
                       {statPeriod === 'thisMonth' ? (
                         <div className="space-y-2">
                            {stats.recent.thisMonth.highlights
                              .filter(h => h.label.toLowerCase().includes('km'))
                              .slice(0, 6)
                              .map((h, i) => (
                              <div key={i} className="flex justify-between text-[10px] sm:text-[11px]">
                                 <span className="font-bold uppercase opacity-70">{h.label}</span>
                                 <span className="font-black text-right">{h.value}</span>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div className="space-y-1.5">
                            {Object.entries(manualPRs)
                              .filter(([, time]) => (time as string).trim() !== '')
                              .map(([dist, time]) => (
                              <div key={dist} className="flex justify-between text-[10px] sm:text-[11px]">
                                 <span className="font-bold uppercase opacity-70">{dist} RECORD</span>
                                 <span className="font-black text-right">{time}</span>
                              </div>
                            ))}
                            {Object.values(manualPRs).every(t => (t as string).trim() === '') && (
                              <div className="text-[9px] italic opacity-40 text-center py-2">No PRs entered.</div>
                            )}
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'participation' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-[9px] sm:text-[10px] font-black uppercase mb-4 opacity-40">Records: {participationPeriod === 'allTime' ? 'ALL TIME' : 'CURRENT YEAR'}</div>
                    <div className="space-y-3 sm:space-y-4">
                      {events.map((e, i) => (
                        <div key={e.id} className="text-[10px] sm:text-xs space-y-1">
                          <div className="flex justify-between font-black">
                            <span className="max-w-[160px] sm:max-w-[200px] truncate">ITEM {i+1}: {e.name.toUpperCase() || 'UNTITLED EVENT'}</span>
                            <span>{e.distance}</span>
                          </div>
                          <div className="flex justify-between opacity-70">
                            <span className="truncate max-w-[120px] sm:max-w-[150px]">{e.place.toUpperCase() || 'UNKNOWN'}</span>
                            <span>{e.time || '--:--:--'}</span>
                          </div>
                          {i < events.length - 1 && <div className="border-b border-black/5 pt-1"></div>}
                        </div>
                      ))}
                      
                      <div className="border-t border-black/10 pt-3 sm:pt-4 mt-3 sm:mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-[10px] sm:text-xs">LOGGED TOTAL DISTANCE</span>
                          <span className="font-black text-lg sm:text-xl">
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

                <div className="border-t border-dashed border-black/20 my-4 sm:my-6"></div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold ${activeTab === 'strava' ? 'text-blue-700' : 'text-lime-700'}`}>
                      <ShieldCheck size={10} className="sm:w-3 sm:h-3" />
                      {activeTab === 'strava' ? 'VERIFIED PERFORMANCE' : 'CERTIFIED RUNNER'}
                    </div>
                    <div className="text-[7px] sm:text-[8px] opacity-40 tracking-tighter">Generated on kainetic.mamangcao.com</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border border-black/10 rounded flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-0.5 opacity-20">
                      {Array.from({length: 16}).map((_, i) => <div key={i} className={`w-1 h-1 bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>)}
                    </div>
                  </div>
                </div>

                <div className="text-[8px] sm:text-[9px] text-center opacity-30 mt-3 sm:mt-4 leading-tight italic px-2">
                  * This document is a stylized visualization and does not serve as a legal identity or official sports certification.
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_100%,#0d1014_5px,transparent_6px)] bg-repeat-x bg-[length:12px_8px] translate-y-1"></div>
              </div>

              <div 
                onClick={handleShare}
                className="hidden lg:flex absolute inset-0 bg-black/40 backdrop-blur-[1px] items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Share2 />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Share Achievement</span>
                </div>
              </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden flex-shrink-0 p-4 border-t border-white/5 bg-[#101418] fixed bottom-0 left-0 right-0 z-[230]">
              <div className="flex gap-2 max-w-[360px] mx-auto">
                <Button 
                  onClick={handleDownload} 
                  className={`flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer ${activeTab === 'participation' ? 'bg-lime-600 hover:bg-lime-500 shadow-lime-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                >
                  <Download size={18} /> Save
                </Button>
                <Button 
                  onClick={handleShare} 
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                >
                  <Share2 size={18} /> Share
                </Button>
                <Button 
                  onClick={handlePrint} 
                  className="flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600"
                >
                  <Printer size={18} /> Print
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

};

export default ReceiptGeneratorModal;