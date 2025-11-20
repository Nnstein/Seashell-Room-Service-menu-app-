import React, { useState, useMemo, useEffect } from 'react';
import { MENU_DATA, LANDING_VIDEO } from './data';
import { MenuItem, CartItem, ViewState, Language } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryCarousel from './components/CategoryCarousel';
import MenuItemCard from './components/MenuItemCard';
import OrderDrawer from './components/OrderDrawer';
import ConfirmationScreen from './components/ConfirmationScreen';
import LandingPage from './components/LandingPage';

// Internal Background Controller for Seamless Transitions between Video and Images
interface BackgroundMedia {
  type: 'video' | 'image';
  src: string;
}

const BackgroundController = ({ media }: { media: BackgroundMedia }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [layers, setLayers] = useState<BackgroundMedia[]>([media, media]);
  const [opacities, setOpacities] = useState([1, 0]);

  useEffect(() => {
    // If the new media src is the same as the current active one, do nothing
    if (layers[activeIdx].src === media.src) return;

    const nextIdx = (activeIdx + 1) % 2;

    // Prepare the next layer
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers[nextIdx] = media;
      return newLayers;
    });

    // Trigger transition after a brief delay to allow content to load/render
    const timer = setTimeout(() => {
      setOpacities(prev => {
        const newOps = [...prev];
        newOps[activeIdx] = 0;
        newOps[nextIdx] = 1;
        return newOps;
      });
      setActiveIdx(nextIdx);
    }, 100);

    return () => clearTimeout(timer);
  }, [media, activeIdx, layers]);

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {[0, 1].map((idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: opacities[idx] }}
        >
          {layers[idx].type === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={layers[idx].src}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-105 hover:scale-110"
              src={layers[idx].src}
              alt="background"
            />
          )}
        </div>
      ))}
      
      {/* Global Overlays for consistency and readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10"></div>
    </div>
  );
};

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [language, setLanguage] = useState<Language>('en');
  const [activeCategory, setActiveCategory] = useState<string>(MENU_DATA[0].id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [animateCart, setAnimateCart] = useState(false);
  
  const currentCategoryData = useMemo(() => 
    MENU_DATA.find(cat => cat.id === activeCategory) || MENU_DATA[0], 
  [activeCategory]);

  // Determine Background Media
  const backgroundMedia: BackgroundMedia = useMemo(() => {
    if (view === 'HOME') {
      return { type: 'video', src: LANDING_VIDEO };
    }
    // For Menu View, use the category image (upscaled) instead of video
    // We replace w=600 with w=1920 to get a high-quality background from Unsplash
    const imgSrc = currentCategoryData.image.replace('w=600', 'w=1920');
    return { type: 'image', src: imgSrc };
  }, [view, currentCategoryData]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, cartId: Date.now().toString() }];
    });
    
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 500);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('CONFIRMATION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetOrder = () => {
    setCart([]);
    setView('MENU');
    setActiveCategory(MENU_DATA[0].id);
  };

  const handleEnterMenu = () => {
    setView('MENU');
  };

  const handleGoHome = () => {
    setView('HOME');
  };

  // Preload assets
  useEffect(() => {
    MENU_DATA.forEach(cat => {
      new Image().src = cat.image;
    });
  }, []);

  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Seamless Background Controller */}
      <BackgroundController media={backgroundMedia} />

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col min-h-screen">
        
        {view !== 'HOME' && (
            <Header 
            cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
            onOpenCart={() => setIsCartOpen(true)} 
            onGoHome={handleGoHome}
            view={view}
            animateCart={animateCart}
            theme={currentCategoryData.theme}
            language={language}
            />
        )}

        <main className="flex-grow">
          {view === 'HOME' ? (
              <LandingPage onEnter={handleEnterMenu} language={language} onToggleLanguage={toggleLanguage} />
          ) : view === 'MENU' ? (
            <div className="pb-20">
              <Hero activeCategoryName={currentCategoryData.name[language]} theme={currentCategoryData.theme} language={language} />
              
              <section className="pb-4 px-4 relative z-30 -mt-4">
                <CategoryCarousel 
                  categories={MENU_DATA} 
                  activeCategory={activeCategory} 
                  onSelectCategory={setActiveCategory}
                  language={language}
                />
              </section>

              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up px-2">
                  {currentCategoryData.items.map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onAdd={addToCart}
                      theme={currentCategoryData.theme}
                      language={language}
                    />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white/90 min-h-screen backdrop-blur-xl">
                <ConfirmationScreen cartItems={cart} onGoHome={resetOrder} language={language} />
            </div>
          )}
        </main>
      </div>

      {/* Key prop added to force remount on language change, preventing the sliding animation "flash" across the screen */}
      <OrderDrawer 
        key={language} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        language={language}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;