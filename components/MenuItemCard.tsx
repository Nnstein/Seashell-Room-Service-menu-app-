import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem, Theme, Language } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  theme: Theme;
  language: Language;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAdd, theme, language }) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full border border-white/20 relative">
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name[language]}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300"></div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(item);
          }}
          className={`absolute bottom-4 ${language === 'ar' ? 'left-4' : 'right-4'} ${theme.accentColor} text-white p-3 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 hover:scale-110`}
          aria-label={`Add ${item.name[language]} to order`}
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight group-hover:text-stone-600 transition-colors">{item.name[language]}</h3>
          <span className={`font-sans font-bold text-lg text-white ${theme.accentColor} px-3 py-1 rounded-full shadow-sm ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
            {item.price.toFixed(3)}
          </span>
        </div>
        <p className="text-stone-600 text-sm leading-relaxed flex-grow font-sans line-clamp-3">{item.description ? item.description[language] : ''}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;