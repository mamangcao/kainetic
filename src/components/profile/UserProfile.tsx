"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, FileText, Sparkles } from 'lucide-react';
import { AthleteProfile, StatsData, SportType } from '../../types';
import ReceiptGeneratorModal from './ReceiptGeneratorModal';

interface UserProfileProps {
  fetcher: () => Promise<AthleteProfile>;
  stats?: StatsData;
  activeTab?: SportType;
}

const UserProfile: React.FC<UserProfileProps> = ({ fetcher, stats, activeTab }) => {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    fetcher().then(data => {
      if (isMounted) setProfile(data);
    });

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  if (!profile) return (
    <div className="flex items-center gap-6 mb-8 px-2 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-slate-800"></div>
      <div className="space-y-3 flex-1">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="h-4 w-32 bg-slate-800 rounded"></div>
        <div className="h-4 w-full max-w-xs bg-slate-800 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1c2229] rounded-3xl p-8 shadow-xl border border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 group">
          <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-blue-500 to-lime-400 shadow-lg shadow-blue-500/20">
             <div className="w-full h-full relative rounded-full overflow-hidden border-4 border-[#1c2229]">
               <Image 
                 src={profile.profile_medium} 
                 alt={profile.username} 
                 fill
                 className="object-cover" 
                 sizes="96px"
                 priority
                 unoptimized
               />
             </div>
          </div>
        </div>
        
        <div className="flex-1 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">{profile.firstname} {profile.lastname}</h2>
            {stats && activeTab === 'running' && (
              <button 
                onClick={() => setIsReceiptModalOpen(true)}
                className="hidden md:flex items-center justify-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-[#101418] rounded-xl font-bold text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95 group/btn cursor-pointer"
              >
                <FileText size={16} />
                Generate Run Receipt
                <Sparkles size={14} className="group-hover/btn:animate-pulse" />
              </button>
            )}
          </div>
          
          {(profile.city || profile.country) && (
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 mb-4">
              <MapPin size={14} className="text-lime-400" />
              <span>
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          
          <p className="text-slate-300 max-w-lg text-sm leading-relaxed mb-6 font-light">{profile.bio}</p>
      

          {/* Mobile Button - Bottom */}
          {stats && activeTab === 'running' && (
            <button 
              onClick={() => setIsReceiptModalOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-[#101418] rounded-xl font-bold text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95 group/btn cursor-pointer w-full"
            >
              <FileText size={16} />
              Generate Run Receipt
              <Sparkles size={14} className="group-hover/btn:animate-pulse" />
            </button>
          )}
        </div>
      </motion.div>

      {profile && stats && (
        <ReceiptGeneratorModal 
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          profile={profile}
          stats={stats}
        />
      )}
    </div>
  );
};

export default UserProfile;