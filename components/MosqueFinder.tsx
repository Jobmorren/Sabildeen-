
import React, { useState } from 'react';
import { findMosques } from '../services/geminiService';
import { PlaceResult } from '../types';
import { MapPin, Navigation, Star, ExternalLink } from 'lucide-react';

interface MosqueFinderProps {
  location: { lat: number; lng: number } | null;
  language?: string;
}

const TRANSLATIONS = {
  en: { title: "Nearby Mosques", searchBtn: "Search Nearby", searching: "Searching...", enableLoc: "Enable location.", results: "Results", noResults: "No mosques found.", rated: "Highly Rated" },
  fr: { title: "Mosquées proches", searchBtn: "Rechercher", searching: "Recherche...", enableLoc: "Activez localisation.", results: "Résultats", noResults: "Aucune mosquée.", rated: "Bien noté" },
  es: { title: "Mezquitas cercanas", searchBtn: "Buscar", searching: "Buscando...", enableLoc: "Activa ubicación.", results: "Resultados", noResults: "No se encontraron.", rated: "Bien valorado" },
  wo: { title: "Jàkka yi", searchBtn: "Seet", searching: "Mu ngiy seet...", enableLoc: "Takkal GPS.", results: "Li mu guiss", noResults: "Amul jàkka.", rated: "Rafet na" },
  ar: { title: "مساجد قريبة", searchBtn: "بحث", searching: "جاري البحث...", enableLoc: "فعل الموقع.", results: "النتائج", noResults: "لم يتم العثور على مساجد.", rated: "تقييم عالي" }
};

const MosqueFinder: React.FC<MosqueFinderProps> = ({ location, language = 'en' }) => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const handleSearch = async () => {
    if (!location) { alert(t.enableLoc); return; }
    setLoading(true);
    const result = await findMosques(location.lat, location.lng, language);
    setPlaces(result.places);
    setText(result.text);
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-6 text-center border border-emerald-100 dark:border-emerald-900/30 transition-colors duration-300">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600 dark:text-emerald-400 transition-colors">
          <MapPin size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.title}</h2>
        <button
          onClick={handleSearch}
          disabled={loading || !location}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-full shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t.searching : <><Navigation size={18} /> {t.searchBtn}</>}
        </button>
      </div>

      {searched && (
        <div className="space-y-4 animate-fade-in-up">
           <div className="px-2">
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium uppercase tracking-wider">{t.results}</p>
             {text && !places.length && (
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm border border-slate-100 dark:border-slate-800">{text}</div>
             )}
           </div>
           <div className="grid gap-4">
             {places.map((place, idx) => (
               <a key={idx} href={place.uri} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-1">{place.title}</h3>
                     {place.snippet && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{place.snippet}</p>}
                     <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                       <Star size={12} fill="currentColor" /> <span>{t.rated}</span>
                     </div>
                   </div>
                   <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"><ExternalLink size={16} /></div>
                 </div>
               </a>
             ))}
             {places.length === 0 && !loading && <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">{t.noResults}</div>}
           </div>
        </div>
      )}
    </div>
  );
};

export default MosqueFinder;
