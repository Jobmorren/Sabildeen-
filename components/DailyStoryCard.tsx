
import React, { useState, useEffect } from 'react';
import { generateDailyStory } from '../services/geminiService';
import { DailyStory } from '../types';
import { Book, Heart, Share2, ChevronDown, ChevronUp, Loader2, Feather, Quote } from 'lucide-react';
import LongPressableText from './LongPressableText';

interface DailyStoryCardProps {
  language?: string;
}

const FALLBACK_STORY: DailyStory = {
  title: "The Patience of Prophet Ayyub (Job) AS",
  theme: "Patience (Sabr)",
  story: "Prophet Ayyub (AS) was a wealthy man with many children and vast lands. However, Allah tested him by taking away his wealth, his children, and his health. He suffered from a severe illness for many years, yet he remained patient and constantly grateful to Allah.\n\nHis wife served him loyally throughout his ordeal. Even when people abandoned him, he never complained against Allah's decree. Finally, after years of hardship, he prayed to Allah for relief. Allah answered his prayer, restored his health, gave him back his wealth, and doubled his family as a mercy from Him.",
  quran: {
    arabic: "وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
    translation: "And [mention] Job, when he called to his Lord, 'Indeed, adversity has touched me, and you are the Most Merciful of the merciful.'",
    transliteration: "Wa Ayyuba idh nada Rabbahu anni massaniyad-durru wa anta Arhamur-Rahimin",
    reference: "Surah Al-Anbya 21:83"
  },
  hadith: {
    arabic: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ",
    translation: "Strange is the affair of the believer, verily all his affairs are good for him.",
    source: "Sahih Muslim"
  },
  lesson: "Patience in the face of adversity is a sign of true faith. Allah tests those He loves, and relief always follows hardship."
};

const DailyStoryCard: React.FC<DailyStoryCardProps> = ({ language = 'en' }) => {
  const [story, setStory] = useState<DailyStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const cacheKey = `daily_story_${today}_${language}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setStory(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchStory = async () => {
      setLoading(true);
      try {
        let data = await generateDailyStory(language);
        if (!data) {
           data = FALLBACK_STORY;
        }
        setStory(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.error("Story fetch failed, using fallback", e);
        setStory(FALLBACK_STORY);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [language]);

  if (loading) return (
    <div className="w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2rem] h-64 mb-6 flex items-center justify-center">
       <Loader2 className="w-8 h-8 text-emerald-500 animate-spin opacity-50" />
    </div>
  );

  const safeStory = story || FALLBACK_STORY;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 relative group transition-all">
       <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 p-6 text-white h-full flex flex-col justify-center">
             <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
                <Feather size={14} /> Story of the Day
             </span>
             <h2 className="text-2xl font-bold leading-tight line-clamp-2">{safeStory.title}</h2>
             <span className="text-xs bg-white/20 px-2 py-1 rounded-full self-start mt-2 backdrop-blur-sm">{safeStory.theme}</span>
          </div>
       </div>

       <div className="p-6">
          <div className={`relative transition-all duration-500 ${expanded ? 'max-h-full' : 'max-h-32 overflow-hidden'}`}>
             <LongPressableText 
                text={safeStory.story} 
                language={language} 
                as="p" 
                className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line"
             />
             {!expanded && (
               <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent flex items-end justify-center pb-2">
               </div>
             )}
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-colors mt-2"
          >
             {expanded ? (
               <><ChevronUp size={16} className="mr-1" /> Show Less</>
             ) : (
               <><ChevronDown size={16} className="mr-1" /> Read Full Story</>
             )}
          </button>

          <div className="mt-6 space-y-4">
             <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                   <Book size={16} />
                   <span className="text-xs font-bold uppercase">Quran</span>
                </div>
                <LongPressableText 
                    text={safeStory.quran.arabic} 
                    language="ar" 
                    as="p" 
                    dir="rtl" 
                    className="font-arabic text-lg text-right text-slate-800 dark:text-slate-200 mb-2 leading-loose" 
                />
                
                {safeStory.quran.transliteration && (
                    <LongPressableText 
                        text={safeStory.quran.transliteration} 
                        language="en" 
                        as="p" 
                        className="text-amber-600/90 dark:text-amber-400/90 text-xs italic mb-2 leading-relaxed font-medium" 
                    />
                )}

                <LongPressableText 
                    text={safeStory.quran.translation} 
                    language={language} 
                    as="p" 
                    className="text-xs text-slate-600 dark:text-slate-400 italic" 
                />
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold mt-1 text-right">{safeStory.quran.reference}</p>
             </div>

             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300">
                   <Quote size={16} className="fill-current" />
                   <span className="text-xs font-bold uppercase">Hadith</span>
                </div>
                <LongPressableText 
                    text={safeStory.hadith.arabic} 
                    language="ar" 
                    as="p" 
                    dir="rtl"
                    className="font-arabic text-lg text-right text-slate-800 dark:text-slate-200 mb-2 leading-loose" 
                />
                <LongPressableText 
                    text={safeStory.hadith.translation} 
                    language={language} 
                    as="p" 
                    className="text-xs text-slate-600 dark:text-slate-400 italic" 
                />
                <p className="text-[10px] text-slate-500 font-bold mt-1 text-right">{safeStory.hadith.source}</p>
             </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Heart size={16} className="fill-current" />
             </div>
             <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Reflection</h4>
                <LongPressableText 
                    text={safeStory.lesson} 
                    language={language} 
                    as="p" 
                    className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed" 
                />
             </div>
          </div>
       </div>
    </div>
  );
};

export default DailyStoryCard;
