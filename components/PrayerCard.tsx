
import React, { useEffect, useState } from 'react';
import { PrayerTimes } from '../types';
import { Clock, Sun, Sunset, Moon, Sunrise } from 'lucide-react';

interface PrayerCardProps {
  timings: PrayerTimes | null;
  loading: boolean;
  language?: string;
  compact?: boolean;
  onClick?: () => void;
}

const TRANSLATIONS = {
  en: { nextPrayer: "Next", timeRemaining: "Remaining", prayer: "Prayer" },
  fr: { nextPrayer: "Prochaine", timeRemaining: "Restant", prayer: "Prière" },
  es: { nextPrayer: "Siguiente", timeRemaining: "Restante", prayer: "Oración" },
  wo: { nextPrayer: "Bi ci teg", timeRemaining: "Des na", prayer: "Julli" },
  ar: { nextPrayer: "القادمة", timeRemaining: "المتبقي", prayer: "الصلاة" }
};

const PrayerCard: React.FC<PrayerCardProps> = ({ timings, loading, language = 'en', compact = false, onClick }) => {
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('');
  
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    if (!timings) return;

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    const updateNextPrayer = () => {
      const now = new Date();
      let upcoming = null;
      let upcomingName = '';
      let upcomingTimeStr = '';

      for (const p of prayers) {
        const [hours, minutes] = timings[p].split(':').map(Number);
        const pTime = new Date();
        pTime.setHours(hours, minutes, 0, 0);
        
        if (pTime > now) {
          upcoming = pTime;
          upcomingName = p;
          upcomingTimeStr = timings[p];
          break;
        }
      }

      if (!upcoming) {
        // Next is Fajr tomorrow
        const [hours, minutes] = timings['Fajr'].split(':').map(Number);
        upcoming = new Date();
        upcoming.setDate(upcoming.getDate() + 1);
        upcoming.setHours(hours, minutes, 0, 0);
        upcomingName = 'Fajr';
        upcomingTimeStr = timings['Fajr'];
      }

      setNextPrayer(upcomingName);
      setNextPrayerTime(upcomingTimeStr.split(' ')[0]);

      const diff = upcoming.getTime() - now.getTime();
      const diffHrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${diffHrs}h ${diffMins}m`);
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [timings]);

  if (loading) {
    return (
      <div className={`w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2rem] relative overflow-hidden ${compact ? 'h-full min-h-[160px]' : 'h-64 mb-6'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-pulse-slow"></div>
      </div>
    );
  }

  if (!timings) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Fajr': return <Sunrise className="w-5 h-5" />;
      case 'Dhuhr': return <Sun className="w-5 h-5" />;
      case 'Asr': return <Sun className="w-5 h-5 opacity-70" />;
      case 'Maghrib': return <Sunset className="w-5 h-5" />;
      case 'Isha': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  // Compact Mode Render (Split View)
  if (compact) {
    return (
      <button 
        onClick={onClick}
        className="w-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-[2rem] p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden h-full flex flex-col justify-between text-left group transition-transform active:scale-95"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/15 transition-colors"></div>
        
        <div className="relative z-10 flex items-center gap-2 mb-2">
           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
               {getIcon(nextPrayer)}
           </div>
           <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">{t.nextPrayer}</span>
        </div>

        <div className="relative z-10 mt-1">
            <h2 className="text-3xl font-bold tracking-tight">{nextPrayer}</h2>
            <p className="text-2xl font-medium text-emerald-100 opacity-90">{nextPrayerTime}</p>
        </div>

        <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 bg-black/20 self-start px-2 py-1 rounded-lg backdrop-blur-sm">
             <Clock size={12} className="text-emerald-300" />
             <span className="text-xs font-medium text-emerald-50">{timeRemaining}</span>
        </div>
      </button>
    );
  }

  // Full Mode Render
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise, isPrayer: false },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden mb-6 group transition-all hover:scale-[1.01]">
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col items-center mb-8 mt-2">
        <div className="flex items-center gap-2 mb-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <p className="text-emerald-50 text-[10px] font-bold tracking-widest uppercase">{t.nextPrayer}</p>
        </div>
        <h2 className="text-5xl font-bold mb-1 tracking-tight drop-shadow-md">{nextPrayer}</h2>
        <p className="text-emerald-100 font-medium tracking-wide opacity-90 flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-xl backdrop-blur-sm">
          <Clock size={14} />
          <span>{timeRemaining}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 relative z-10">
        {prayers.map((p) => {
          const isNext = p.name === nextPrayer;
          if (!p.isPrayer && p.name === 'Sunrise') return null; 

          return (
            <div key={p.name} className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isNext ? 'bg-white text-emerald-800 shadow-lg scale-105' : 'bg-black/10 border border-white/5 hover:bg-white/10 text-emerald-50'}`}>
              <div className={`mb-1.5 ${isNext ? 'text-emerald-600' : 'text-emerald-200'}`}>
                {getIcon(p.name)}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider opacity-80`}>{p.name}</span>
              <span className={`text-sm font-bold mt-0.5`}>{p.time.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerCard;
