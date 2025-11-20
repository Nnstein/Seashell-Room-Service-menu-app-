import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { Language, Theme } from '../types';
import { UI_TEXT } from '../data';

interface LandingPageProps {
  onEnter: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, language, onToggleLanguage }) => {
  const isRTL = language === 'ar';

  return (
    <div className={`relative h-screen w-full flex flex-col items-center justify-center overflow-hidden ${isRTL ? 'font-arabic' : 'font-serif'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Content Container */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Language Switcher */}
        <div className="absolute top-[-15vh] left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-12">
           <button 
             onClick={onToggleLanguage}
             className="flex items-center justify-center gap-2 mx-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white transition-all duration-300"
           >
             <Globe size={16} />
             <span className="text-sm uppercase tracking-widest font-sans">
               {language === 'en' ? 'العربية' : 'English'}
             </span>
           </button>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
          {UI_TEXT.welcomeTitle[language]}
        </h1>
        
        <p className="text-xl md:text-2xl text-stone-200 font-light mb-12 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
           {UI_TEXT.welcomeSubtitle[language]}
        </p>
        
        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white overflow-hidden hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
        >
          <span className="relative z-10 text-lg font-bold tracking-widest uppercase">
             {UI_TEXT.viewMenu[language]}
          </span>
          <div className={`relative z-10 transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'}`}>
            <ArrowRight size={24} />
          </div>
        </button>
      </div>

      {/* Decorative 3D Overlay Effects */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;