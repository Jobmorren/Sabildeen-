import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen, Loader2 } from 'lucide-react';
import { generateHadithBatch } from '../services/geminiService';

interface HadithCatalogProps {
  onBack: () => void;
  language: string;
}

const TOPICS = [
  { id: 'faith', en: 'Faith (Iman)', fr: 'Foi (Iman)', ar: 'الإيمان' },
  { id: 'prayer', en: 'Prayer (Salah)', fr: 'Prière (Salat)', ar: 'الصلاة' },
  { id: 'charity', en: 'Charity (Zakat)', fr: 'Charité (Zakat)', ar: 'الزكاة' },
  { id: 'fasting', en: 'Fasting (Sawm)', fr: 'Jeûne (Sawm)', ar: 'الصوم' },
  { id: 'character', en: 'Good Character', fr: 'Bon Caractère', ar: 'حسن الخلق' },
  { id: 'family', en: 'Family', fr: 'Famille', ar: 'الأسرة' },
];

const HadithCatalog: React.FC<HadithCatalogProps> = ({ onBack, language }) => {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [hadiths, setHadiths] = useState<{arabic: string, text: string, source: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHadiths = async () => {
      setLoading(true);
      const topicName = language === 'fr' ? activeTopic.fr : activeTopic.en;
      const data = await generateHadithBatch(topicName, 5, language);
      setHadiths(data);
      setLoading(false);
    };

    fetchHadiths();
  }, [activeTopic, language]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
      <div className="sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl px-4 py-4 pt-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Hadiths</h1>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTopic.id === topic.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {language === 'fr' ? topic.fr : language === 'ar' ? topic.ar : topic.en}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          hadiths.map((hadith, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-2xl leading-loose font-arabic text-right text-slate-800 dark:text-slate-100 mb-6" dir="rtl">
                {hadith.arabic}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4">
                {hadith.text}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {hadith.source}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HadithCatalog;
