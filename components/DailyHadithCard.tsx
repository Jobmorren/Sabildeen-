import React, { useEffect, useState } from 'react';
import { generateDailyHadith } from '../services/geminiService';
import { DailyHadith } from '../types';
import { Share2, BookOpen, Loader2 } from 'lucide-react';
import LongPressableText from './LongPressableText';

interface DailyHadithCardProps {
  language?: string;
}

const DailyHadithCard: React.FC<DailyHadithCardProps> = ({ language = 'en' }) => {
  const [hadith, setHadith] = useState<DailyHadith | null>(null);
  const [loading, setLoading] = useState(true);

  const title = language === 'fr' ? 'Hadith du Jour' : 'Daily Hadith';

  useEffect(() => {
    const today = new Date().toDateString();
    const cacheKey = `dailyHadith_${language}_${today}`;
    
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setHadith(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchHadith = async () => {
      setLoading(true);
      const data = await generateDailyHadith(language);
      if (data) {
        setHadith(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
      setLoading(false);
    };

    fetchHadith();
  }, [language]);

  if (loading) return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-center items-center h-48 transition-colors duration-300">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
    </div>
  );

  if (!hadith) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative group transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookOpen size={16} className="fill-current" />
            </div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {title}
            </h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full uppercase tracking-wider">
                {hadith.category}
            </span>
        </div>
        
        <LongPressableText 
            text={hadith.arabic} 
            language="ar" 
            as="p" 
            dir="rtl"
            className="font-arabic text-2xl text-slate-800 dark:text-slate-100 text-right leading-[2.2] mb-4" 
        />
        
        <div className="relative pl-4 border-l-2 border-blue-100 dark:border-blue-900/50">
            <LongPressableText 
                text={hadith.translation} 
                language={language} 
                as="p" 
                className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed mb-1" 
            />
        </div>
        
        <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60">
            <div>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{hadith.source}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide max-w-[200px] line-clamp-1">{hadith.narrator}</p>
            </div>
            
            <button 
              onClick={() => navigator.clipboard.writeText(`${hadith.translation} - ${hadith.source} (${hadith.narrator})`)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
            >
                <Share2 size={16} />
            </button>
        </div>
    </div>
  );
};

export default DailyHadithCard;
