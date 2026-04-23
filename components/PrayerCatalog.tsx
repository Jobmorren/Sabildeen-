import React from 'react';
import PrayerCard from './PrayerCard';
import HijriCalendar from './HijriCalendar';
import PrayerTracker from './PrayerTracker';
import { PrayerTimes, HijriDate } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PrayerCatalogProps {
  prayerData: { timings: PrayerTimes, date: HijriDate } | null;
  loading: boolean;
  language: string;
  onBack: () => void;
}

const PrayerCatalog: React.FC<PrayerCatalogProps> = ({ prayerData, loading, language, onBack }) => {
  const t = {
    title: language === 'fr' ? 'Catalogue Prière' : 'Prayer Catalog',
    subtitle: language === 'fr' ? 'Horaires et Calendrier Sacré' : 'Times & Sacred Calendar',
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
      {/* Header */}
      <div className="p-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-20 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-0">
            <PrayerCard timings={prayerData?.timings || null} loading={loading} language={language} />
        </div>

        <div className="p-6 pb-0">
            <PrayerTracker language={language} />
        </div>
        
        {/* Embed Calendar without its own header/back button logic since we are in a container */}
        <div className="h-[600px] relative">
            <HijriCalendar onBack={() => {}} language={language} />
        </div>
      </div>
    </div>
  );
};

export default PrayerCatalog;