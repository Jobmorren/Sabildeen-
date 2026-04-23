
import React from 'react';
import { Home, MessageCircle, BookOpen, GraduationCap, Book, ScrollText } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language?: string;
}

const TRANSLATIONS = {
  en: { home: 'Home', quran: 'Quran', hadiths: 'Hadiths', chat: 'Ask AI' },
  fr: { home: 'Accueil', quran: 'Coran', hadiths: 'Hadiths', chat: 'IA' },
  es: { home: 'Inicio', quran: 'Corán', hadiths: 'Hadices', chat: 'IA' },
  wo: { home: 'Kër', quran: 'Alxuraan', hadiths: 'Hadiths', chat: 'AI' },
  ar: { home: 'الرئيسية', quran: 'القرآن', hadiths: 'الحديث', chat: 'الذكاء' }
};

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, language = 'en' }) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'quran', icon: BookOpen, label: t.quran },
    { id: 'hadiths', icon: ScrollText, label: t.hadiths },
    { id: 'chat', icon: MessageCircle, label: t.chat },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-safe pt-2 px-4 transition-all duration-300">
      <nav className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-black/50 p-2 mb-4 w-full max-w-sm">
        <div className="flex justify-between items-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-8 bg-slate-800 dark:bg-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
