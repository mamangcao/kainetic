"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SportType, Trophy } from '../../types';

interface TrophiesGridProps {
  sport: SportType;
  fetcher: (sport: SportType) => Promise<Trophy[]>;
}

const TrophiesGrid: React.FC<TrophiesGridProps> = ({ sport, fetcher }) => {
  const [trophies, setTrophies] = useState<Trophy[]>([]);

  useEffect(() => {
    fetcher(sport).then(setTrophies);
  }, [sport, fetcher]);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white tracking-tight mb-4 px-1">Recent Trophies</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trophies.map((trophy, i) => (
          <motion.div
            key={trophy.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="bg-[#1c2229] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-lime-500/50 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all duration-300 flex flex-col items-center text-center group cursor-default">
              <div className="text-4xl mb-3 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {trophy.icon}
              </div>
              <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">{trophy.name}</h4>
              <p className="text-xs text-slate-500 font-mono">{trophy.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrophiesGrid;