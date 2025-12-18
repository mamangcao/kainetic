import React from 'react';
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
             <div className="flex items-center gap-1.5">
               <span className="font-bold text-[#fc4c02]">Powered by Strava</span>
               <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#fc4c02]">
                  <title>Strava</title>
                  <path d="M15.387 17.944l-2.089-4.116h-3.065l5.154 10.172 5.154-10.172h-3.064l-2.09 4.116zm-5.154-4.116l-3.064-6.059H4.103l6.13 12.117 6.13-12.117h-3.064l-2.09 4.116z" />
               </svg>
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
              href="https://github.com/AbdulHaleemMamangcao" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-semibold ${isDark ? 'text-slate-300 hover:text-lime-400' : 'text-slate-700 hover:text-blue-600'} transition-colors border-b border-transparent hover:border-current`}
            >
              Abdul Haleem Mamangcao
            </a>
            <a 
              href="https://github.com/AbdulHaleemMamangcao" 
              target="_blank" 
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