import React from 'react';
import { ArrowLeft, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewState, Theme, Language } from '../types';
import { UI_TEXT } from '../data';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
  view: ViewState;
  animateCart: boolean;
  theme: Theme;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onGoHome, view, animateCart, theme, language }) => {
  const isRTL = language === 'ar';

  return (
    <header className="sticky top-0 z-40 transition-all duration-500 pt-4 px-4">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl px-6 lg:px-8 h-20 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          {view === 'CONFIRMATION' && (
             <button onClick={onGoHome} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
               {isRTL ? <ChevronRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
             </button>
          )}
          <div className="cursor-pointer group text-center sm:text-left" onClick={onGoHome}>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white group-hover:text-gold transition-colors duration-300 drop-shadow-md">PRESTO</h1>
            <p className="text-[10px] font-sans tracking-[0.2em] text-white/70 uppercase group-hover:tracking-[0.3em] transition-all duration-500">Coffee & More</p>
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className={`relative group flex items-center gap-2 px-6 py-3 rounded-full shadow-xl transition-all duration-300 ${theme.accentColor} text-white hover:brightness-110 ${animateCart ? 'scale-110 ring-4 ring-white/30' : ''}`}
        >
          <span className="font-medium text-sm hidden sm:block tracking-wide">{UI_TEXT.myOrder[language]}</span>
          <ClipboardList className={`w-5 h-5 ${animateCart ? 'animate-bounce' : ''}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-stone-900 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;