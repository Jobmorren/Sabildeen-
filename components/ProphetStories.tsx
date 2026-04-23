
import React, { useState } from 'react';
import { ArrowLeft, Book, Sparkles, Star, Loader2, RefreshCw, ScrollText, CheckCircle2, MapPin, Calendar, ListChecks, Search, BookOpen, ShieldAlert, AlertCircle } from 'lucide-react';
import { generateProphetStory } from '../services/geminiService';
import { ProphetStory } from '../types';

const PROPHETS = [
  { name: "Adam", ar: "آدم" }, { name: "Idris", ar: "إدريس" }, { name: "Nuh", ar: "نوح" }, { name: "Hud", ar: "هود" },
  { name: "Salih", ar: "صالح" }, { name: "Ibrahim", ar: "إبراهيم" }, { name: "Lut", ar: "لوط" }, { name: "Ismail", ar: "إسماعيل" },
  { name: "Ishaq", ar: "إسحاق" }, { name: "Yaqub", ar: "يعقوب" }, { name: "Yusuf", ar: "يوسف" }, { name: "Ayyub", ar: "أيوب" },
  { name: "Shuayb", ar: "شعيب" }, { name: "Musa", ar: "موسى" }, { name: "Harun", ar: "هارون" }, { name: "Dhul-Kifl", ar: "ذو الكفل" },
  { name: "Dawud", ar: "داود" }, { name: "Sulayman", ar: "سليمان" }, { name: "Ilyas", ar: "إلياس" }, { name: "Al-Yasa", ar: "اليسع" },
  { name: "Yunis", ar: "يونس" }, { name: "Zakariya", ar: "زكريا" }, { name: "Yahya", ar: "يحيى" }, { name: "Isa", ar: "عيسى" },
  { name: "Muhammad", ar: "محمد" }
];

const TRANSLATIONS = {
  en: { title: "Stories of Prophets", subtitle: "25 Messengers", search: "Search prophet...", summary: "Biography", lessons: "Lessons", miracles: "Miracles", quran: "Quran", quranKey: "Key Verse", errorTitle: "Error loading", errorDesc: "Check connection.", retry: "Retry", events: "Timeline", trials: "Trials", loading: "Generating story..." },
  fr: { title: "Histoires des Prophètes", subtitle: "25 Messagers", search: "Rechercher...", summary: "Biographie", lessons: "Enseignements", miracles: "Miracles", quran: "Coran", quranKey: "Verset Clé", errorTitle: "Erreur", errorDesc: "Vérifiez connexion.", retry: "Réessayer", events: "Chronologie", trials: "Épreuves", loading: "Génération..." },
  es: { title: "Historias de Profetas", subtitle: "25 Mensajeros", search: "Buscar...", summary: "Biografía", lessons: "Lecciones", miracles: "Milagros", quran: "Corán", quranKey: "Verso Clave", errorTitle: "Error", errorDesc: "Verifica conexión.", retry: "Reintentar", events: "Línea de tiempo", trials: "Pruebas", loading: "Generando..." },
  wo: { title: "Yonent Yi", subtitle: "25 Yonent", search: "Seet...", summary: "Dundu", lessons: "Jàngat", miracles: "Këemaan", quran: "Alxuraan", quranKey: "Aaya", errorTitle: "Njuumté", errorDesc: "Xoolal connexion.", retry: "Bësaat", events: "Xew-xew", trials: "Nattu", loading: "Mu ngiy defar..." },
  ar: { title: "قصص الأنبياء", subtitle: "25 رسول", search: "بحث...", summary: "السيرة", lessons: "العبر", miracles: "المعجزات", quran: "القرآن", quranKey: "آية مفتاحية", errorTitle: "خطأ", errorDesc: "تحقق من الاتصال.", retry: "إعادة", events: "الأحداث", trials: "الابتلاءات", loading: "جاري التحميل..." }
};

interface ProphetStoriesProps {
  onBack: () => void;
  language?: string;
}

const ProphetStories: React.FC<ProphetStoriesProps> = ({ onBack, language = 'en' }) => {
  const [selectedProphet, setSelectedProphet] = useState<string | null>(null);
  const [story, setStory] = useState<ProphetStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const handleSelect = async (name: string) => {
    setSelectedProphet(name);
    setLoading(true);
    setError(false);
    setStory(null);
    
    const data = await generateProphetStory(name, language);
    if (data) setStory(data); else setError(true);
    setLoading(false);
  };

  const filteredProphets = PROPHETS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ar.includes(searchTerm));

  if (selectedProphet) {
    return (
      <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in transition-colors duration-300">
        <header className="p-6 flex items-center gap-4 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => { setSelectedProphet(null); setStory(null); setError(false); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full transition-transform active:scale-90"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedProphet} AS</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-slate-400 font-medium">{t.loading}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-2"><AlertCircle size={32} /></div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">{t.errorTitle}</p>
              <button onClick={() => handleSelect(selectedProphet)} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all active:scale-95 shadow-lg mt-2"><RefreshCw size={18} /> {t.retry}</button>
            </div>
          ) : story ? (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center space-y-4 mb-8">
                <span className="font-arabic text-6xl text-emerald-600 dark:text-emerald-500 block mb-2 drop-shadow-sm">{story.arabicName}</span>
                <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full opacity-50 mb-6"></div>
                <div className="flex flex-wrap justify-center gap-3">
                   {story.location && <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-900/30"><MapPin size={14} />{story.location}</div>}
                   {story.period && <div className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-900/30"><Calendar size={14} />{story.period}</div>}
                </div>
              </div>

              {story.keyVerse && (
                  <div className="bg-emerald-600 dark:bg-emerald-900/40 p-6 rounded-3xl text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                      <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4 opacity-80"><BookOpen size={16} /><span className="text-xs font-bold uppercase tracking-widest">{t.quranKey}</span></div>
                          <p className="font-arabic text-2xl text-right leading-[2.2] mb-4 drop-shadow-md" dir="rtl">{story.keyVerse.arabic}</p>
                          <p className="text-emerald-50 text-sm leading-relaxed font-medium italic">"{story.keyVerse.translation}"</p>
                          <p className="text-xs text-emerald-200 mt-2 font-bold text-right">{story.keyVerse.reference}</p>
                      </div>
                  </div>
              )}

              <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><ScrollText size={20} /></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.summary}</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">{story.summary}</p>
              </section>

              {story.trials && story.trials.length > 0 && (
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500"><ShieldAlert size={20} /></div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.trials}</h3>
                    </div>
                    <div className="space-y-4">{story.trials.map((trial, i) => (<div key={i} className="flex gap-4 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"><div className="pt-1"><ShieldAlert size={16} className="text-red-400" /></div><p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{trial}</p></div>))}</div>
                  </section>
              )}

              {story.keyEvents && story.keyEvents.length > 0 && (
                  <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><ListChecks size={20} /></div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.events}</h3>
                    </div>
                    <div className="space-y-4">{story.keyEvents.map((event, i) => (<div key={i} className="flex gap-4"><div className="flex flex-col items-center"><div className="w-3 h-3 bg-indigo-500 rounded-full mt-1.5"></div>{i !== story.keyEvents.length - 1 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1"></div>}</div><div className="pb-2"><p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event}</p></div></div>))}</div>
                  </section>
              )}

              <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500"><Sparkles size={20} /></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.miracles}</h3>
                </div>
                <div className="space-y-3">{story.miracles.map((m, i) => (<div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"><Star size={18} className="text-amber-400 mt-1 flex-shrink-0 fill-amber-400/20" /><span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span></div>))}</div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400"><Book size={20} /></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.lessons}</h3>
                </div>
                <div className="space-y-3">{story.lessons.map((l, i) => (<div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"><CheckCircle2 size={18} className="text-emerald-500 mt-1 flex-shrink-0" /><span className="text-slate-700 dark:text-slate-300 leading-relaxed italic">"{l}"</span></div>))}</div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 pb-24 animate-fade-in bg-slate-50 dark:bg-slate-950">
      <header className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 rounded-full transition-transform active:scale-90 shadow-sm border border-slate-100 dark:border-slate-800"><ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" /></button>
          <div><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2><p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-0.5">{t.subtitle}</p></div>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all" />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6">
        <div className="grid grid-cols-2 gap-3 pb-6">
          {filteredProphets.map((p, idx) => (
            <button key={idx} onClick={() => handleSelect(p.name)} className="group bg-white dark:bg-gradient-to-br dark:from-[#1a222c] dark:to-[#12181f] p-4 rounded-3xl dark:rounded-[20px] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-between hover:border-emerald-500/50 dark:hover:border-[#2ecc71] transition-all duration-300 active:scale-[0.98] shadow-sm dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] dark:hover:-translate-y-0.5 text-center h-32 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-[2rem] -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner mb-2">{idx + 1}</div>
              <div className="relative z-10 w-full"><h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{p.name}</h3><p className="font-arabic text-xl text-slate-400 dark:text-slate-500 group-hover:text-emerald-600/60 dark:group-hover:text-emerald-400/60 transition-colors mt-1">{p.ar}</p></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProphetStories;
