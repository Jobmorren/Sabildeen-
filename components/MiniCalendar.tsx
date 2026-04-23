import React from 'react';
import { Calendar, Moon, Star } from 'lucide-react';
import { HijriDate } from '../types';

interface MiniCalendarProps {
  date: HijriDate | undefined;
  language?: string;
  onClick: () => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ date, language = 'en', onClick }) => {
  if (!date) return (
    <div className="bg-slate-100 dark:bg-slate-800 h-full rounded-[2rem] animate-pulse"></div>
  );

  const t = {
    today: language === 'fr' ? 'Aujourd\'hui' : 'Today',
    event: language === 'fr' ? 'Événement' : 'Event',
  };

  // Extract numeric day and month name
  const day = date.day;
  const month = date.month.en; // Using EN for display consistency or could use AR
  const year = date.year;

  return (
    <button 
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all active:scale-95 group text-left h-full flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
      
      <div className="relative z-10 flex items-center gap-2 mb-2">
         <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
             <Calendar size={16} />
         </div>
         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.today}</span>
      </div>

      <div className="relative z-10">
          <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{day}</span>
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{month}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{year} AH</p>
      </div>

      {/* Decorative Moon */}
      <Moon size={64} className="absolute -bottom-4 -right-4 text-slate-50 dark:text-slate-800 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
    </button>
  );
};

export default MiniCalendar;