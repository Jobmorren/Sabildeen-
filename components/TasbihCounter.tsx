
import React, { useState, useEffect } from 'react';
import { RotateCcw, Settings, Check, Volume2, VolumeX, Quote, X } from 'lucide-react';

interface TasbihCounterProps {
  onBack: () => void;
  language?: string;
}

const TRANSLATIONS = {
  en: { title: "Tasbih", subtitle: "Digital Dhikr", loops: "Total Loops", target: "Target", tap: "Tap to Count", reset: "Reset", confirmReset: "Reset counter?" },
  fr: { title: "Tasbih", subtitle: "Dhikr Numérique", loops: "Boucles Totales", target: "Cible", tap: "Appuyez", reset: "Réinitialiser", confirmReset: "Réinitialiser ?" },
  es: { title: "Tasbih", subtitle: "Dhikr Digital", loops: "Vueltas Totales", target: "Objetivo", tap: "Toca para contar", reset: "Reiniciar", confirmReset: "¿Reiniciar?" },
  wo: { title: "Kurus", subtitle: "Kurus Digital", loops: "Li weur", target: "Jëmm", tap: "Bësal ngir lim", reset: "Dindi", confirmReset: "Dindi lim bi?" },
  ar: { title: "تسبيح", subtitle: "ذكر رقمي", loops: "مجموع الدورات", target: "الهدف", tap: "اضغط للعد", reset: "إعادة تعيين", confirmReset: "هل تريد إعادة التعيين؟" }
};

const DHIKR_QUOTES = [
  { text: "Verily, in the remembrance of Allah do hearts find rest.", source: "Surah Ar-Ra'd 13:28" },
  { text: "Remember Me; I will remember you.", source: "Surah Al-Baqarah 2:152" },
];

const TasbihCounter: React.FC<TasbihCounterProps> = ({ onBack, language = 'en' }) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number>(33);
  const [loops, setLoops] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  
  useEffect(() => {
    const savedCount = localStorage.getItem('tasbih_count');
    const savedLoops = localStorage.getItem('tasbih_loops');
    const savedTarget = localStorage.getItem('tasbih_target');
    if (savedCount) setCount(parseInt(savedCount));
    if (savedLoops) setLoops(parseInt(savedLoops));
    if (savedTarget) setTarget(parseInt(savedTarget));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasbih_count', count.toString());
    localStorage.setItem('tasbih_loops', loops.toString());
    localStorage.setItem('tasbih_target', target.toString());
  }, [count, loops, target]);

  const handleTap = () => {
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate(15);
    const nextCount = count + 1;
    if (target !== 0 && nextCount > target) {
      if (vibrationEnabled && navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setCount(1);
      setLoops(l => l + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    if (confirm(t.confirmReset)) {
      setCount(0);
      setLoops(0);
      if (vibrationEnabled && navigator.vibrate) navigator.vibrate(50);
    }
  };

  const toggleTarget = () => {
    const targets = [33, 99, 100, 0];
    const currentIndex = targets.indexOf(target);
    const nextTarget = targets[(currentIndex + 1) % targets.length];
    setTarget(nextTarget);
  };

  const progress = target === 0 ? 100 : (count / target) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-fade-in relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <RotateCcw size={20} />
        </button>
        <div className="flex flex-col items-center">
             <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h1>
             <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.subtitle}</span>
        </div>
        <button onClick={() => setVibrationEnabled(!vibrationEnabled)} className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-colors ${vibrationEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500'}`}>
          {vibrationEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 relative w-full max-w-md mx-auto">
        {showQuote && (
            <div className="w-full mb-6 relative group animate-fade-in-up">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                    <button onClick={() => setShowQuote(false)} className="absolute top-3 right-3 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white/50 dark:bg-black/10 rounded-full p-1"><X size={14} /></button>
                    <div className="flex gap-4">
                        <Quote size={20} className="text-emerald-500 fill-emerald-500/20 mt-1" />
                        <div className="pr-4">
                            <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{DHIKR_QUOTES[0].text}"</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-bold uppercase">{DHIKR_QUOTES[0].source}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mb-8 text-center space-y-1">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">{t.loops}: {loops}</p>
            <button onClick={toggleTarget} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-center gap-2 mx-auto">
                {t.target}: {target === 0 ? '∞' : target} <Settings size={12} />
            </button>
        </div>

        <button 
            onClick={handleTap}
            className="relative w-64 h-64 rounded-full bg-white dark:bg-slate-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center group active:scale-95 transition-all duration-100 touch-manipulation tap-highlight-transparent"
        >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" className="stroke-slate-100 dark:stroke-slate-800 transition-colors duration-300" strokeWidth="4" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} strokeLinecap="round" className="transition-all duration-300 ease-out" />
            </svg>
            <div className="flex flex-col items-center z-10">
                <span className="text-7xl font-bold text-slate-800 dark:text-slate-100 font-mono tracking-tighter tabular-nums select-none">{count}</span>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-2">{t.tap}</span>
            </div>
        </button>

        <button onClick={handleReset} className="mt-12 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
            <RotateCcw size={14} /> {t.reset}
        </button>
      </div>
    </div>
  );
};

export default TasbihCounter;
