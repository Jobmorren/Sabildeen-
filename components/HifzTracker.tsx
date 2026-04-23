
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Award, Play, ChevronRight, Search } from 'lucide-react';
import { HifzProgress } from '../types';

const SURAHS = [
  { id: 78, name: "An-Naba", verses: 40 },
  { id: 67, name: "Al-Mulk", verses: 30 },
  { id: 55, name: "Ar-Rahman", verses: 78 },
  { id: 36, name: "Ya-Sin", verses: 83 },
  { id: 18, name: "Al-Kahf", verses: 110 },
];

const HifzTracker: React.FC<{ language?: string }> = ({ language = 'en' }) => {
  const [progress, setProgress] = useState<HifzProgress[]>([]);
  const [activeSurah, setActiveSurah] = useState<typeof SURAHS[0] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hifz_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const toggleVerse = (surahId: number, verseNum: number) => {
    setProgress(prev => {
      const existing = prev.find(p => p.surahNumber === surahId);
      let next;
      if (existing) {
        const isSet = existing.memorizedVerses.includes(verseNum);
        next = prev.map(p => p.surahNumber === surahId ? {
          ...p,
          memorizedVerses: isSet ? p.memorizedVerses.filter(v => v !== verseNum) : [...p.memorizedVerses, verseNum]
        } : p);
      } else {
        next = [...prev, { surahNumber: surahId, memorizedVerses: [verseNum], totalVerses: SURAHS.find(s => s.id === surahId)?.verses || 0 }];
      }
      localStorage.setItem('hifz_progress', JSON.stringify(next));
      return next;
    });
  };

  const getPercent = (id: number) => {
    const p = progress.find(p => p.surahNumber === id);
    if (!p) return 0;
    return Math.round((p.memorizedVerses.length / p.totalVerses) * 100);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Hifz Journey</h2>
            <p className="text-emerald-100 text-sm opacity-80">Track your memorization progress</p>
          </div>
          <Award size={48} className="text-white/20" />
        </div>
      </div>

      <div className="grid gap-4">
        {SURAHS.map(surah => {
          const percent = getPercent(surah.id);
          return (
            <button
              key={surah.id}
              onClick={() => setActiveSurah(surah)}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  {percent === 100 ? <CheckCircle className="text-emerald-500" /> : <BookOpen />}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{surah.name}</h3>
                  <p className="text-xs text-slate-500">{surah.verses} Verses</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{percent}%</p>
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeSurah && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 p-6 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setActiveSurah(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <ChevronRight className="rotate-180" />
            </button>
            <h3 className="text-xl font-bold">{activeSurah.name}</h3>
            <div className="w-10"></div> {/* Spacer to balance header */}
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-3 pb-8">
            {Array.from({ length: activeSurah.verses }).map((_, i) => {
              const vNum = i + 1;
              const isMem = progress.find(p => p.surahNumber === activeSurah.id)?.memorizedVerses.includes(vNum);
              return (
                <button
                  key={vNum}
                  onClick={() => toggleVerse(activeSurah.id, vNum)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    isMem ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {vNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HifzTracker;
