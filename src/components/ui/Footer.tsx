import React from 'react';
import Image from 'next/image';
import { Github } from 'lucide-react';

interface FooterProps {
  variant?: 'fixed' | 'static';
  theme?: 'dark' | 'light';
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ variant = 'fixed', theme = 'dark', className = '' }) => {
  const isFixed = variant === 'fixed';
  const isDark = theme === 'dark';

  return (
    <footer className={`
      ${isFixed ? 'fixed bottom-0 left-0 right-0 z-[100] border-t shadow-[0_-5px_20px_rgba(0,0,0,0.5)]' : 'w-full'} 
      ${isDark ? 'bg-[#101418]/90 backdrop-blur-xl border-white/5' : 'bg-transparent border-transparent'}
      ${className}
    `}>
      <div className={`max-w-4xl mx-auto px-4 ${isFixed ? 'py-3' : 'py-2'}`}>
        <div className={`flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] md:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          
          {/* Left Side: Powered by Strava */}
          <div className={`flex items-center gap-2 order-2 md:order-1`}>
             <div className="relative h-8 w-32">
               <Image 
                 src="/logo/strava-white.png" 
                 alt="Powered by Strava" 
                 fill
                 sizes="128px"
                 className="object-contain"
               />
             </div>
             <span className="text-slate-600">|</span>
             <p className={`text-[9px] ${isDark ? 'text-slate-600' : 'text-slate-400'} font-normal`}>
               Not affiliated with Strava.
             </p>
          </div>

          {/* Right Side: Developer Credits */}
          <div className={`flex items-center justify-center md:justify-end gap-2 order-1 md:order-2`}>
            <span>Developed by</span>
            <a 
              href="#" 
              // target="_blank" 
              rel="noopener noreferrer"
              className={`font-semibold ${isDark ? 'text-slate-300 hover:text-lime-400' : 'text-slate-700 hover:text-blue-600'} transition-colors border-b border-transparent hover:border-current`}
            >
              Abdul Haleem Mamangcao
            </a>
            <a 
              href="#" 
              // target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'} transition-colors p-1 rounded-full`}
              aria-label="GitHub Profile"
            >
              <Github size={14} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;