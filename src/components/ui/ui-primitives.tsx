"use client";
import React from 'react';

// --- Card ---
// Updated to "Soft Card" in Dark Mode: #1c2229 with subtle border
export const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1c2229] rounded-2xl shadow-xl border border-white/5 ${className}`}>
    {children}
  </div>
);

// --- Button ---
export const Button = ({ onClick, children, className = '', variant = 'primary' }: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'strava' | 'outline' | 'ghost';
}) => {
  const baseStyle = "px-4 py-2 rounded-xl font-bold tracking-wide transition-all duration-200 active:scale-95";
  const variants = {
    // Electric Bolt (Blue)
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30",
    // Official Strava Orange (Mandatory for Connect button) - Kept for compliance
    strava: "bg-[#fc4c02] text-white hover:bg-[#e34402] shadow-md shadow-orange-900/20",
    outline: "border border-slate-700 text-slate-300 hover:bg-white/5 hover:border-slate-500",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};

// --- Tabs ---
export const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex p-1 bg-[#0d1014] border border-white/5 rounded-xl ${className}`}>
    {children}
  </div>
);

export const TabTrigger = ({ isActive, onClick, children }: {
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
      isActive 
        ? 'bg-[#1c2229] text-lime-400 shadow-sm' 
        : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {children}
  </button>
);