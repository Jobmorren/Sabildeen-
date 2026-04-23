import React, { useState, useEffect } from 'react';
import { Check, Trophy, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface PrayerTrackerProps {
  language?: string;
}

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ language = 'en' }) => {
  const [history, setHistory] = useState<Record<string, Record<string, boolean>>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const t = {
    title: language === 'fr' ? 'Suivi des Prières' : 'Prayer Tracker',
    today: language === 'fr' ? "Aujourd'hui" : "Today",
    history: language === 'fr' ? 'Historique Mensuel' : 'Monthly History',
    streak: language === 'fr' ? 'Série' : 'Streak',
    completed: language === 'fr' ? 'Complété' : 'Completed',
    days: language === 'fr' ? ['D', 'L', 'M', 'M', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  };

  useEffect(() => {
    const saved = localStorage.getItem('prayer_tracker_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (newHistory: Record<string, Record<string, boolean>>) => {
    setHistory(newHistory);
    localStorage.setItem('prayer_tracker_history', JSON.stringify(newHistory));
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const togglePrayer = (date: Date, prayer: string) => {
    const key = getDateKey(date);
    const dayRecord = history[key] || {};
    const newRecord = { ...dayRecord, [prayer]: !dayRecord[prayer] };
    
    const newHistory = { ...history, [key]: newRecord };
    saveHistory(newHistory);
  };

  const getDayStatus = (date: Date) => {
    const key = getDateKey(date);
    const dayRecord = history[key];
    if (!dayRecord) return 0;
    return PRAYERS.filter(p => dayRecord[p]).length;
  };

  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isSelected = getDateKey(d) === getDateKey(selectedDate);
      const isToday = getDateKey(d) === getDateKey(new Date());
      const count = getDayStatus(d);
      
      let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
      if (count > 0) {
          if (count === 5) bgClass = 'bg-emerald-500 text-white';
          else if (count >= 3) bgClass = 'bg-emerald-300 dark:bg-emerald-700 text-white';
          else bgClass = 'bg-amber-300 dark:bg-amber-700 text-white';
      }

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(d)}
          className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${bgClass} ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : ''} ${isToday ? 'border-2 border-slate-400 dark:border-slate-500' : ''}`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
  };

  const currentKey = getDateKey(selectedDate);
  const currentRecord = history[currentKey] || {};
  const dailyCount = PRAYERS.filter(p => currentRecord[p]).length;
  const progressPercent = (dailyCount / 5) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Trophy size={20} />
            </div>
            <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{dailyCount}/5</p>
            <p className="text-xs text-slate-400">{t.completed}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
      </div>

      {/* Prayer Toggles */}
      <div className="grid grid-cols-5 gap-2">
        {PRAYERS.map(prayer => {
            const isDone = !!currentRecord[prayer];
            return (
                <button
                    key={prayer}
                    onClick={() => togglePrayer(selectedDate, prayer)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${isDone ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'border-slate-200 dark:border-slate-700 text-transparent bg-transparent'}`}>
                        <Check size={16} strokeWidth={4} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {prayer}
                    </span>
                </button>
            );
        })}
      </div>

      {/* Monthly Calendar View */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <CalendarIcon size={16} /> {t.history}
              </h3>
              <div className="flex gap-1">
                  <button onClick={() => changeMonth(-1)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center w-24 justify-center">
                      {currentDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => changeMonth(1)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <ChevronRight size={18} />
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
              {t.days.map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-300 uppercase">{d}</span>
              ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
              {renderMonthGrid()}
          </div>
      </div>
    </div>
  );
};

export default PrayerTracker;