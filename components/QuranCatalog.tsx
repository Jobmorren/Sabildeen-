import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen, Loader2, Languages } from 'lucide-react';
import { translateAyahToWolof } from '../services/geminiService';

interface QuranCatalogProps {
  onBack: () => void;
  language: string;
  initialSurah?: number | null;
  onClearSurah?: () => void;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

const QuranCatalog: React.FC<QuranCatalogProps> = ({ onBack, language, initialSurah, onClearSurah }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<{ arabic: Ayah[], translation: Ayah[], transliteration: Ayah[] } | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [wolofTranslations, setWolofTranslations] = useState<Record<number, string>>({});
  const [translatingAyah, setTranslatingAyah] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
        if (initialSurah) {
          handleSurahClick(initialSurah);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [initialSurah]);

  const handleSurahClick = async (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setLoadingSurah(true);
    setWolofTranslations({}); // Reset translations on new surah
    
    try {
      const arRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const arData = await arRes.json();
      
      let transEdition = 'en.asad';
      if (language === 'fr' || language === 'wo') transEdition = 'fr.hamidullah';
      else if (language === 'es') transEdition = 'es.cortes';

      const trRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${transEdition}`);
      const trData = await trRes.json();
      
      const translitRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`);
      const translitData = await translitRes.json();

      setSurahData({
        arabic: arData.data.ayahs,
        translation: trData.data.ayahs,
        transliteration: translitData.data.ayahs
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSurah(false);
    }
  };

  const handleTranslateWolof = async (surahNum: number, ayahNum: number, text: string) => {
    setTranslatingAyah(ayahNum);
    const translation = await translateAyahToWolof(surahNum, ayahNum, text);
    if (translation) {
      setWolofTranslations(prev => ({ ...prev, [ayahNum]: translation }));
    }
    setTranslatingAyah(null);
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  if (selectedSurah) {
    const surahInfo = surahs.find(s => s.number === selectedSurah);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between mt-4">
          <button onClick={() => { 
            setSelectedSurah(null); 
            setSurahData(null); 
            if (onClearSurah) onClearSurah();
          }} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{surahInfo?.englishName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{surahInfo?.revelationType} • {surahInfo?.numberOfAyahs} Ayahs</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="p-4 max-w-3xl mx-auto space-y-8 mt-4">
          {loadingSurah ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Loading Surah...</p>
            </div>
          ) : (
            <>
              {selectedSurah !== 1 && selectedSurah !== 9 && (
                <div className="text-center py-8 mb-8 border-b border-slate-200 dark:border-slate-800">
                  <h1 className="text-4xl font-arabic text-slate-800 dark:text-slate-100">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h1>
                </div>
              )}
              {surahData?.arabic.map((ayah, index) => {
                let text = ayah.text;
                if (selectedSurah !== 1 && ayah.numberInSurah === 1) {
                  text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
                }
                return (
                  <div key={ayah.number} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">
                        {ayah.numberInSurah}
                      </span>
                    </div>
                    <p className="text-3xl leading-loose font-arabic text-right text-slate-800 dark:text-slate-100 mb-4" dir="rtl">
                      {text}
                    </p>
                    <p className="text-emerald-600/90 dark:text-emerald-400/90 text-sm italic mb-4 leading-relaxed font-medium">
                      {surahData.transliteration[index]?.text}
                    </p>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                        {surahData.translation[index]?.text}
                      </p>
                      
                      {language === 'wo' && !wolofTranslations[ayah.numberInSurah] && (
                        <button 
                          onClick={() => handleTranslateWolof(selectedSurah, ayah.numberInSurah, text)}
                          disabled={translatingAyah === ayah.numberInSurah}
                          className="mt-4 flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 transition-colors"
                        >
                          {translatingAyah === ayah.numberInSurah ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
                          Tekki ci Wolof (AI)
                        </button>
                      )}
                      
                      {language === 'wo' && wolofTranslations[ayah.numberInSurah] && (
                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-500 mb-1 uppercase tracking-wider">Tekki ci Wolof</p>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[15px]">
                            {wolofTranslations[ayah.numberInSurah]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
      <div className="sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl px-4 py-4 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Al-Quran</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search Surah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          filteredSurahs.map((surah) => (
            <button 
              key={surah.number}
              onClick={() => handleSurahClick(surah.number)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900 transition-all active:scale-[0.98] flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 border-2 border-slate-200 dark:border-slate-700 rounded-xl rotate-45 scale-[0.85] group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors"></div>
                  <span className="relative z-10">{surah.number}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{surah.englishName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                    {surah.revelationType} • {surah.numberOfAyahs} Ayahs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-arabic text-2xl text-emerald-600 dark:text-emerald-400">{surah.name.replace('سُورَةُ ', '')}</h3>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default QuranCatalog;
