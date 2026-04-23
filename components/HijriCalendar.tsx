import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon, Star, Info, Gift, BookOpen, Quote } from 'lucide-react';

interface HijriCalendarProps {
  onBack: () => void;
  language?: string;
}

interface EventDetail {
  name: string;
  type: 'eid' | 'spiritual' | 'historical';
  description?: string;
  reference?: string;
  source?: string;
}

interface DayData {
  date: Date;
  gregorianDay: number;
  hijriDay: string;
  hijriMonth: string;
  hijriYear: string;
  hijriMonthIndex: number; // 1-12
  isToday: boolean;
  isFriday: boolean;
  isWhiteDay: boolean; // 13, 14, 15 of Hijri month
  events: EventDetail[];
}

const ISLAMIC_EVENTS = [
  { 
    month: 1, day: 1, 
    type: 'historical',
    en: "Islamic New Year", fr: "Nouvel An Hégirien",
    desc_en: "Marks the beginning of the Islamic lunar calendar, commemorating the Hijrah (migration) of Prophet Muhammad (ﷺ) from Makkah to Madinah.",
    desc_fr: "Marque le début du calendrier lunaire islamique, commémorant la Hijrah (émigration) du Prophète Muhammad (ﷺ) de La Mecque à Médine.",
    ref_en: "If you do not aid the Prophet - Allah has already aided him when those who disbelieved had driven him out...",
    ref_fr: "Si vous ne l'aidez pas, Allah l'a déjà aidé, lorsque ceux qui avaient mécru l'avaient banni...",
    source: "Surah At-Tawbah 9:40"
  },
  { 
    month: 1, day: 10, 
    type: 'spiritual',
    en: "Ashura", fr: "Achoura",
    desc_en: "A day of fasting. It commemorates the day Allah saved Prophet Musa (AS) and the Children of Israel from Pharaoh.",
    desc_fr: "Jour de jeûne recommandé. Il commémore le jour où Allah a sauvé le Prophète Moussa (AS) et les enfants d'Israël de Pharaon.",
    ref_en: "The Prophet (ﷺ) came to Madinah and saw the Jews fasting on the day of Ashura. He said, 'I am closer to Musa than you,' so he fasted and ordered it.",
    ref_fr: "Le Prophète (ﷺ) arriva à Médine et vit les Juifs jeûner le jour d'Achoura. Il dit : 'Je suis plus digne de Moussa que vous', alors il jeûna et ordonna de le faire.",
    source: "Sahih Bukhari"
  },
  { 
    month: 3, day: 12, 
    type: 'historical',
    en: "Mawlid al-Nabi", fr: "Mawlid (Naissance du Prophète)",
    desc_en: "Commemoration of the birth of Prophet Muhammad (ﷺ). A time to reflect on his life and teachings.",
    desc_fr: "Commémoration de la naissance du Prophète Muhammad (ﷺ). Un moment pour réfléchir sur sa vie, sa morale et multiplier les prières sur lui.",
    ref_en: "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
    ref_fr: "Et Nous ne t'avons envoyé qu'en miséricorde pour l'univers.",
    source: "Surah Al-Anbya 21:107"
  },
  { 
    month: 9, day: 1, 
    type: 'spiritual',
    en: "Start of Ramadan", fr: "Début du Ramadan",
    desc_en: "The holy month of fasting, reflection, and community. The month in which the Quran was revealed.",
    desc_fr: "Le mois sacré du jeûne, de la réflexion et de la communauté. Le mois durant lequel le Coran a été révélé.",
    ref_en: "The month of Ramadhan [is that] in which was revealed the Qur'an, a guidance for the people...",
    ref_fr: "Le mois de Ramadan est celui au cours duquel le Coran a été descendu comme guide pour les gens...",
    source: "Surah Al-Baqarah 2:185"
  },
  { 
    month: 9, day: 27, 
    type: 'spiritual',
    en: "Laylat al-Qadr (Approx)", fr: "Nuit du Destin (Approx)",
    desc_en: "The Night of Decree, better than a thousand months. It is the night the Quran was first revealed.",
    desc_fr: "La Nuit du Destin, meilleure que mille mois. C'est la nuit où le Coran a été révélé.",
    ref_en: "Indeed, We sent the Qur'an down during the Night of Decree. And what can make you know what is the Night of Decree?",
    ref_fr: "Nous l'avons certes fait descendre (le Coran) pendant la Nuit du Destin.",
    source: "Surah Al-Qadr 97:1"
  },
  { 
    month: 10, day: 1, 
    type: 'eid',
    en: "Eid al-Fitr", fr: "Aïd al-Fitr",
    desc_en: "The Festival of Breaking the Fast. It marks the end of Ramadan and is a day of joy, prayer, and charity (Zakat al-Fitr).",
    desc_fr: "La Fête de la Rupture du Jeûne. Elle marque la fin du Ramadan. C'est un jour de joie, de prière et de charité (Zakat al-Fitr).",
    ref_en: "Allah has exchanged these two days (of Jahiliyyah) for you with two better days: Eid al-Adha and Eid al-Fitr.",
    ref_fr: "Allah vous a remplacé ces jours (de la Jahiliya) par deux jours meilleurs : l'Aïd al-Adha et l'Aïd al-Fitr.",
    source: "Sunan Abi Dawud"
  },
  { 
    month: 12, day: 9, 
    type: 'spiritual',
    en: "Day of Arafah", fr: "Jour d'Arafat",
    desc_en: "The pinnacle of Hajj. Fasting on this day expiates the sins of the previous year and the coming year for non-pilgrims.",
    desc_fr: "Le point culminant du Hajj. Jeûner ce jour expie les péchés de l'année précédente et de l'année à venir pour les non-pèlerins.",
    ref_en: "This day I have perfected for you your religion and completed My favor upon you...",
    ref_fr: "Aujourd'hui, J'ai parachevé pour vous votre religion, et accompli sur vous Mon bienfait...",
    source: "Surah Al-Ma'idah 5:3"
  },
  { 
    month: 12, day: 10, 
    type: 'eid',
    en: "Eid al-Adha", fr: "Aïd al-Adha",
    desc_en: "The Festival of Sacrifice. Commemorates Prophet Ibrahim's (AS) willingness to sacrifice his son Ismail (AS) as an act of obedience.",
    desc_fr: "La Fête du Sacrifice. Commémore la soumission du Prophète Ibrahim (AS) prêt à sacrifier son fils Ismail (AS) par obéissance à Allah.",
    ref_en: "And We ransomed him with a great sacrifice.",
    ref_fr: "Et Nous le rançonnâmes d'une immolation généreuse.",
    source: "Surah As-Saffat 37:107"
  },
  { 
    month: 12, day: 11, 
    type: 'eid',
    en: "Tashriq (Day 1)", fr: "Jours de Tachriq",
    desc_en: "The days following Eid al-Adha. It is forbidden to fast these days as they are for eating, drinking, and remembrance of Allah.",
    desc_fr: "Les jours suivant l'Aïd al-Adha. Il est interdit de jeûner ces jours-là car ce sont des jours de manger, de boire et d'évocation d'Allah.",
    ref_en: "The days of Tashriq are days of eating, drinking, and remembering Allah.",
    ref_fr: "Les jours de Tachriq sont des jours de nourriture, de boisson et d'évocation d'Allah.",
    source: "Sahih Muslim"
  },
];

const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
};

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
};

const HijriCalendar: React.FC<HijriCalendarProps> = ({ onBack, language = 'en' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const t = {
    title: language === 'fr' ? 'Calendrier Hégirien' : 'Hijri Calendar',
    today: language === 'fr' ? "Aujourd'hui" : "Today",
    events: language === 'fr' ? 'Événements du mois' : 'Month Events',
    whiteDays: language === 'fr' ? 'Jours Blancs (Jeûne)' : 'White Days (Fasting)',
    friday: language === 'fr' ? 'Jumu\'ah' : 'Jumu\'ah',
    noEvents: language === 'fr' ? 'Aucun événement majeur ce mois-ci' : 'No major events this month',
    meaning: language === 'fr' ? 'Signification & Preuve' : 'Meaning & Evidence'
  };

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate, language]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    const days: DayData[] = [];
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const now = new Date();
    const todayStr = now.toDateString();

    // Fill padding days
    for (let i = 0; i < startDayOfWeek; i++) {
       // @ts-ignore
       days.push(null); 
    }

    for (let day = 1; day <= daysInMonth; day++) {
       const current = new Date(year, month, day);
       const parts = formatter.formatToParts(current);
       
       const hDay = parts.find(p => p.type === 'day')?.value || '';
       const hMonth = parts.find(p => p.type === 'month')?.value || '';
       const hYear = parts.find(p => p.type === 'year')?.value || '';
       
       // Get Hijri Month Name properly
       const monthNameFormatter = new Intl.DateTimeFormat(language === 'fr' ? 'fr-u-ca-islamic-umalqura' : 'en-u-ca-islamic-umalqura', {
           month: 'long'
       });
       const hMonthName = monthNameFormatter.format(current);

       const hDayNum = parseInt(hDay);
       const hMonthNum = parseInt(hMonth);

       const isWhiteDay = [13, 14, 15].includes(hDayNum);
       
       // Check Events
       const dayEvents: EventDetail[] = [];
       ISLAMIC_EVENTS.forEach(ev => {
           if (ev.month === hMonthNum && ev.day === hDayNum) {
               dayEvents.push({
                   name: language === 'fr' ? ev.fr : ev.en,
                   type: ev.type as any,
                   description: language === 'fr' ? ev.desc_fr : ev.desc_en,
                   reference: language === 'fr' ? ev.ref_fr : ev.ref_en,
                   source: ev.source
               });
           }
       });

       const dayData: DayData = {
           date: current,
           gregorianDay: day,
           hijriDay: hDay,
           hijriMonth: hMonthName,
           hijriYear: hYear,
           hijriMonthIndex: hMonthNum,
           isToday: current.toDateString() === todayStr,
           isFriday: current.getDay() === 5,
           isWhiteDay: isWhiteDay,
           events: dayEvents
       };

       days.push(dayData);
       
       // Auto select today if in view
       if (dayData.isToday) {
           setSelectedDay(dayData);
       }
    }
    
    setCalendarData(days);
    if (!selectedDay && days.find(d => d)) {
        // If today not in month, select first day
        setSelectedDay(days.find(d => d) || null);
    }
  };

  const changeMonth = (delta: number) => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
      setCurrentDate(newDate);
  };

  // Extract unique events for the list below
  const monthlyEvents = Array.from(
      new Set(
          calendarData
            .filter(d => d && d.events.length > 0)
            .flatMap(d => d.events.map(e => JSON.stringify({ name: e.name, type: e.type, date: d.hijriDay + ' ' + d.hijriMonth })))
      )
  ).map(s => JSON.parse(s as string));

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-fade-in">
        {/* Header */}
        <div className="p-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-4">
                 <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                     <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                 </button>
                 <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                     <CalendarIcon size={20} className="text-emerald-500" />
                     {t.title}
                 </h1>
                 <div className="w-8"></div>
             </div>

             {/* Month Navigation */}
             <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-2xl p-1">
                 <button onClick={() => changeMonth(-1)} className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:shadow-sm transition-all">
                     <ChevronLeft size={20} />
                 </button>
                 <div className="text-center">
                     <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                         {MONTHS[language as keyof typeof MONTHS][currentDate.getMonth()]} {currentDate.getFullYear()}
                     </p>
                     {calendarData.find(d => d)?.hijriMonth && (
                         <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-arabic">
                             {calendarData.find(d => d)?.hijriMonth} • {calendarData.find(d => d)?.hijriYear}
                         </p>
                     )}
                 </div>
                 <button onClick={() => changeMonth(1)} className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:shadow-sm transition-all">
                     <ChevronRight size={20} />
                 </button>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24">
             {/* Calendar Grid */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                 {/* Weekday Headers */}
                 <div className="grid grid-cols-7 mb-2">
                     {WEEKDAYS[language as keyof typeof WEEKDAYS].map((day, i) => (
                         <div key={i} className={`text-center text-[10px] font-bold uppercase tracking-wider py-2 ${i === 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                             {day}
                         </div>
                     ))}
                 </div>
                 
                 {/* Days */}
                 <div className="grid grid-cols-7 gap-1">
                     {calendarData.map((day, i) => {
                         if (!day) return <div key={`empty-${i}`} className="aspect-square"></div>;
                         
                         const hasEid = day.events.some(e => e.type === 'eid');
                         
                         return (
                             <button 
                                 key={i}
                                 onClick={() => setSelectedDay(day)}
                                 className={`aspect-square rounded-xl relative flex flex-col items-center justify-center transition-all ${
                                     day.isToday 
                                         ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                         : hasEid
                                            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400'
                                            : selectedDay?.gregorianDay === day.gregorianDay
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                 }`}
                             >
                                 <span className={`text-sm font-bold ${day.isToday ? 'text-white' : ''}`}>
                                     {day.gregorianDay}
                                 </span>
                                 <span className={`text-[10px] font-arabic mt-0.5 ${day.isToday ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                     {day.hijriDay}
                                 </span>
                                 
                                 {/* Indicators */}
                                 <div className="absolute bottom-1.5 flex gap-0.5">
                                     {day.events.length > 0 && (
                                         <div className={`w-1 h-1 rounded-full ${hasEid ? 'bg-amber-500' : 'bg-emerald-400'}`}></div>
                                     )}
                                     {day.isWhiteDay && <div className="w-1 h-1 rounded-full bg-blue-400"></div>}
                                 </div>
                             </button>
                         );
                     })}
                 </div>
             </div>

             {/* Selected Day Info */}
             {selectedDay && (
                 <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6 animate-fade-in-up">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.today}</p>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                  {selectedDay.date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                              </h3>
                          </div>
                          <div className="text-right">
                              <p className="text-emerald-600 dark:text-emerald-400 font-arabic text-xl font-bold">
                                  {selectedDay.hijriDay} {selectedDay.hijriMonth}
                              </p>
                              <p className="text-xs text-slate-400">{selectedDay.hijriYear} AH</p>
                          </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                          {selectedDay.isFriday && (
                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                  <Star size={12} className="fill-current" /> {t.friday}
                              </span>
                          )}
                          {selectedDay.isWhiteDay && (
                              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                  <Moon size={12} className="fill-current" /> {t.whiteDays}
                              </span>
                          )}
                          {selectedDay.events.map((ev, i) => (
                              <span key={i} className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${ev.type === 'eid' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
                                  {ev.type === 'eid' ? <Gift size={12} /> : <Info size={12} />} {ev.name}
                              </span>
                          ))}
                      </div>

                      {/* Event Details Card (Why & Evidence) */}
                      {selectedDay.events.length > 0 && selectedDay.events[0].description && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2 mb-2">
                                  <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
                                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.meaning}</h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                  {selectedDay.events[0].description}
                              </p>
                              {selectedDay.events[0].reference && (
                                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                      <div className="flex gap-2">
                                          <Quote size={16} className="text-emerald-500 flex-shrink-0 mt-0.5 fill-emerald-500/20" />
                                          <div>
                                              <p className="text-xs italic text-slate-600 dark:text-slate-300 font-serif">"{selectedDay.events[0].reference}"</p>
                                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide text-right">— {selectedDay.events[0].source}</p>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                 </div>
             )}

             {/* Monthly Events List */}
             <div>
                 <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">{t.events}</h3>
                 <div className="space-y-3">
                     {monthlyEvents.length > 0 ? (
                         monthlyEvents.map((ev: any, i) => (
                             <div key={i} className={`flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border ${ev.type === 'eid' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10' : 'border-slate-100 dark:border-slate-800'}`}>
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-arabic text-sm ${ev.type === 'eid' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                                     {ev.date.split(' ')[0]}
                                 </div>
                                 <div>
                                     <p className={`font-bold ${ev.type === 'eid' ? 'text-amber-800 dark:text-amber-200' : 'text-slate-800 dark:text-slate-100'}`}>{ev.name}</p>
                                     <p className="text-xs text-slate-500 dark:text-slate-400">{ev.date}</p>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="text-center py-6 text-slate-400 text-sm italic border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                             {t.noEvents}
                         </div>
                     )}
                 </div>
             </div>
        </div>
    </div>
  );
};

export default HijriCalendar;