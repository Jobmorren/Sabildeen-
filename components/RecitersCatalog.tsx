import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Headphones, Loader2, BookOpen } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface RecitersCatalogProps {
  onBack: () => void;
  language?: string;
  onReadSurah?: (surahNumber: number) => void;
}

const RECITERS = [
  { id: 'ar.husarymujawwad', name: 'Al Hussary', style: 'Tajweed', description: 'Lecture lente avec respect très strict des règles de Tajweed.' },
  { id: 'ar.abdurrahmaansudais', name: 'Sudais', style: 'Murattal / Rapide', description: 'Voix très puissante et rythmée. Imam de la Grande Mosquée de la Mecque.' },
  { id: 'ar.alafasy', name: 'Mishary Alafasy', style: 'Douce / Murattal', description: 'Lecture douce et très mélodieuse, paix de l\'âme (Style proche de Ali Jaber).' },
  { id: 'ar.mahermuaiqly', name: 'Muaiqly', style: 'Apaisante', description: 'Récitation posée, voix grave et reconnaissable entre toutes.' },
  { id: 'ar.abdulsamad', name: 'Abdoul Bassit', style: 'Tajweed complet', description: 'Considéré comme l\'une des plus grandes voix du siècle, souffle extraordinairement long.' },
  { id: 'ar.minshawimujawwad', name: 'Minshawi', style: 'Tajweed spirituel', description: 'Style empli de tristesse spirituelle (Khushu) et de sincérité.' },
  { id: 'mp3quran:https://server11.mp3quran.net/yasser/', name: 'Yasser Al-Dossari', style: 'Émotive / Rapide', description: 'Lecture très dynamique et vibrante qui touche le cœur aux moments forts (Imam de la Mecque).' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al Shatri', style: 'Fluide', description: 'Rythme apaisant et articulation très vibrante (Fluide comme Al Matrood).' },
  { id: 'mp3quran:https://server16.mp3quran.net/a_binhameed/Rewayat-Hafs-A-n-Assem/', name: 'Ahmed Talib Hameed', style: 'Médinoise', description: 'Excellente prononciation claire et posée (Imam de la Mosquée de Médine).' },
  { id: 'ar.saoodshuraym', name: 'Shuraim', style: 'Sérieuse / Rapide', description: 'Voix grave et rythmée, parfait compagnon de Sudais.' }
];

const RecitersCatalog: React.FC<RecitersCatalogProps> = ({ onBack, language = 'en', onReadSurah }) => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState<any | null>(null);
  
  const { playSurah, currentSurah, isPlaying, togglePlay, currentReciter } = useAudio();

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handlePlaySurah = async (surahNumber: number, surahName: string) => {
    if (!selectedReciter) return;
    
    try {
      if (selectedReciter.id.startsWith('mp3quran:')) {
        const serverUrl = selectedReciter.id.split('mp3quran:')[1];
        const paddedSurah = String(surahNumber).padStart(3, '0');
        const audioAyahs = [{
          number: 1,
          audio: `${serverUrl}${paddedSurah}.mp3`,
          arabic: surahName,
          translation: 'Lecture complète de la Sourate'
        }];
        playSurah(audioAyahs, { name: surahName, number: surahNumber }, selectedReciter.name);
        return;
      }

      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter.id}`);
      const data = await res.json();
      
      const audioAyahs = data.data.ayahs.map((ayah: any) => ({
        number: ayah.numberInSurah,
        audio: ayah.audio,
        arabic: ayah.text,
        translation: '' // We focus purely on audio in this catalog
      }));

      playSurah(audioAyahs, { name: surahName, number: surahNumber }, selectedReciter.name);
    } catch(e) {
      console.error(e);
    }
  };

  if (selectedReciter) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-40">
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 pt-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedReciter(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft size={24} className="text-slate-800 dark:text-slate-100" />
            </button>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">{selectedReciter.name}</h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{selectedReciter.style}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
            {selectedReciter.description}
          </p>
        </div>

        <div className="px-4 space-y-2">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : (
            surahs.map(surah => {
              const isThisSurahPlaying = isPlaying && currentSurah?.number === surah.number && currentReciter === selectedReciter.name;
              
              return (
                <div
                  key={surah.number}
                  onClick={() => {
                    if (isThisSurahPlaying) {
                      togglePlay();
                    } else {
                      handlePlaySurah(surah.number, surah.englishName);
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold relative overflow-hidden group-hover:bg-emerald-50 group-hover:dark:bg-emerald-900/30">
                      <span className="relative z-10 text-sm">{surah.number}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{surah.englishName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                        {surah.revelationType} • {surah.numberOfAyahs} Ayahs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onReadSurah && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadSurah(surah.number);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                        title="Read Surah in Catalog"
                      >
                        <BookOpen size={18} />
                      </button>
                    )}
                    <button onClick={(e) => {
                      e.stopPropagation();
                      if (isThisSurahPlaying) {
                        togglePlay();
                      } else {
                        handlePlaySurah(surah.number, surah.englishName);
                      }
                    }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isThisSurahPlaying 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50'
                    }`}>
                      {isThisSurahPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-40">
      <div className="sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl px-4 py-4 pt-6 mb-2">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Récitateurs</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Découvrez différentes manières de réciter le Coran (Tajweed, Murattal) avec 10 récitateurs de renom.</p>
      </div>

      <div className="px-4 mt-4 grid gap-4 mb-24">
        {RECITERS.map((reciter) => (
          <button 
            key={reciter.id}
            onClick={() => setSelectedReciter(reciter)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-all active:scale-[0.98] text-left relative overflow-hidden group"
          >
            <div className="flex items-start gap-4">
               <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Headphones className="text-emerald-600 dark:text-emerald-400" size={24} />
               </div>
               <div className="pr-8">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 leading-tight">{reciter.name}</h3>
                 <span className="inline-block px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
                   Style: {reciter.style}
                 </span>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{reciter.description}</p>
               </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white text-slate-400 transition-colors">
               <Play size={14} className="ml-0.5 fill-current" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecitersCatalog;
