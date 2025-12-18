"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (val: number) => void;
  title: string;
  currentValue: number;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  currentValue 
}) => {
  const [value, setValue] = useState(currentValue.toString());

  useEffect(() => {
    if (isOpen) setValue(currentValue.toString());
  }, [currentValue, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#1c2229] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
               <h3 className="font-bold text-white text-lg">Edit {title}</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-6">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Distance (km)</label>
               <div className="relative">
                 <input 
                   type="number" 
                   value={value}
                   onChange={(e) => setValue(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num > 0) onSave(num);
                     }
                   }}
                   className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-lg outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all placeholder:text-slate-700"
                   placeholder="0.0"
                   autoFocus
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">km</span>
               </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
               <button 
                 onClick={onClose}
                 className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => {
                    const num = parseFloat(value);
                    if (!isNaN(num) && num > 0) {
                        onSave(num);
                    }
                 }}
                 className="px-4 py-2 rounded-lg text-sm font-bold bg-lime-500 text-[#101418] hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20"
               >
                 Save Goal
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditGoalModal;