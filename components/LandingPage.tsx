
import React from 'react';
import { Smartphone, Moon, BookOpen, MessageCircle, MapPin, Shield, Star, ChevronRight, Download, Globe } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  language?: string;
}

const TRANSLATIONS = {
  en: { title: "Your Daily Spiritual Companion", subtitle: "Sabildeen combines modern technology with Islamic tradition. Accurate prayer times, smart AI, Quran, and more.", cta: "Launch App", features: "Features", privacy: "Privacy First", privacyDesc: "Your data stays on your device." },
  fr: { title: "Votre Compagnon Spirituel", subtitle: "Horaires de prière précis, IA, Coran et plus encore.", cta: "Ouvrir", features: "Fonctionnalités", privacy: "Vie Privée", privacyDesc: "Vos données restent sur votre appareil." },
  es: { title: "Tu Compañero Espiritual", subtitle: "Tiempos de oración precisos, IA inteligente, Corán y más.", cta: "Abrir App", features: "Características", privacy: "Privacidad", privacyDesc: "Tus datos se quedan en tu dispositivo." },
  wo: { title: "Sa Wëllure Lislaam", subtitle: "Waxtu julli, AI, Alxuraan ak yeneen.", cta: "Ubbi", features: "Li ci biir", privacy: "Sutura", privacyDesc: "Sa data du dem feneen." },
  ar: { title: "رفيقك الروحي اليومي", subtitle: "أوقات صلاة دقيقة، ذكاء اصطناعي، قرآن والمزيد.", cta: "فتح التطبيق", features: "المميزات", privacy: "الخصوصية أولاً", privacyDesc: "بياناتك تبقى على جهازك." }
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, language = 'en' }) => {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const features = [
    { icon: Moon, color: "bg-blue-50 text-blue-600" },
    { icon: MessageCircle, color: "bg-purple-50 text-purple-600" },
    { icon: BookOpen, color: "bg-emerald-50 text-emerald-600" },
    { icon: MapPin, color: "bg-amber-50 text-amber-600" }
  ];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fade-in overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="p-6 flex justify-between items-center sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><span className="font-bold font-arabic">س</span></div>
          <span className="font-bold text-xl tracking-tight">Sabildeen</span>
        </div>
        <button onClick={onEnterApp} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold hover:scale-105 transition-transform">{t.cta}</button>
      </nav>

      <header className="px-6 py-12 lg:py-24 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100 dark:border-emerald-800"><Star size={12} fill="currentColor" /> #1 App</div>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{t.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{t.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onEnterApp} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"><Smartphone size={20} /> {t.cta}</button>
          </div>
        </div>
      </header>

      <section className="px-6 py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">{t.features}</h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            {features.map((f, i) => (<div key={i} className={`p-4 rounded-2xl ${f.color} flex items-center justify-center`}><f.icon size={28} /></div>))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-slate-400 text-sm border-t border-slate-100 dark:border-slate-800">
        <p>© 2024 Sabildeen</p>
      </footer>
    </div>
  );
};

export default LandingPage;
