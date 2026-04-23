
import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, Headphones, Clock, Mic, Search, Filter, Share2, ListMusic, BookOpen, Quote, AlignLeft } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface TranscriptContent {
  verseTranslation: string;
  hadithText?: string;
  explanation: string;
}

interface EpisodeTranscript {
  verseArabic: string;
  en: TranscriptContent;
  fr: TranscriptContent;
}

interface Episode {
  id: string;
  title: string;
  duration: string;
  surah: number;
  ayah: number;
  description: string;
  transcript: EpisodeTranscript;
}

interface PodcastSeries {
  id: string;
  title: string;
  speaker: string;
  category: string;
  image: string;
  episodes: Episode[];
}

interface PodcastListProps {
  onBack: () => void;
  language?: string;
}

// Helper to format ID for API (e.g. 2, 183 -> "002183")
const formatAyahId = (surah: number, ayah: number) => {
  const s = surah.toString().padStart(3, '0');
  const a = ayah.toString().padStart(3, '0');
  return `${s}${a}`;
};

const PODCAST_DATA: PodcastSeries[] = [
  {
    id: 'pillars_islam',
    title: "The 5 Pillars Explained",
    speaker: "Sh. Omar Suleiman",
    category: "Fiqh",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=2070&auto=format&fit=crop",
    episodes: [
      { 
        id: 'p1', title: "Shahada: The Foundation", duration: "28:45", 
        surah: 47, ayah: 19,
        description: "Understanding 'La ilaha illa Allah' through Surah Muhammad.",
        transcript: {
          verseArabic: "فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ",
          en: {
            verseTranslation: "So know, [O Muhammad], that there is no deity except Allah and ask forgiveness for your sin.",
            hadithText: "The Prophet ﷺ said: 'Islam is built upon five: to worship Allah and to disbelieve in what is worshipped besides him...'",
            explanation: "This episode explores the declaration of faith. The verse commands knowledge before action. The Hadith reinforces that the Shahada is the bedrock upon which all other pillars stand."
          },
          fr: {
            verseTranslation: "Sache donc qu'il n'y a point de divinité à part Allah et implore le pardon pour ton péché.",
            hadithText: "Le Prophète ﷺ a dit : 'L'Islam est bâti sur cinq choses : l'attestation qu'il n'y a de divinité qu'Allah...'",
            explanation: "Cet épisode explore la déclaration de foi. Le verset ordonne la connaissance avant l'action. Le Hadith renforce l'idée que la Shahada est le socle sur lequel reposent tous les autres piliers."
          }
        }
      },
      { 
        id: 'p2', title: "Salah: The Divine Connection", duration: "34:12", 
        surah: 20, ayah: 14,
        description: "Establishing prayer for remembrance (Surah Taha).",
        transcript: {
          verseArabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
          en: {
            verseTranslation: "Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
            hadithText: "The Prophet ﷺ said: 'The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.'",
            explanation: "Salah is not just a ritual but a direct link to the Creator. As the verse states, its primary purpose is Dhikr (Remembrance). Neglecting it severs this vital connection."
          },
          fr: {
            verseTranslation: "Certes, c'est Moi Allah : point de divinité que Moi. Adore-Moi donc et accomplis la Ṣalāt pour le souvenir de Moi.",
            hadithText: "Le Prophète ﷺ a dit : 'La première chose sur laquelle le serviteur sera jugé le Jour de la Résurrection est la prière.'",
            explanation: "La Salat n'est pas juste un rituel mais un lien direct avec le Créateur. Comme le verset l'indique, son but premier est le Dhikr (Souvenir). La négliger coupe ce lien vital."
          }
        }
      },
      { 
        id: 'p3', title: "Zakat: Purifying Wealth", duration: "29:30", 
        surah: 9, ayah: 103,
        description: "The spiritual meaning of charity (Surah At-Tawbah).",
        transcript: {
          verseArabic: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ",
          en: {
            verseTranslation: "Take, [O, Muhammad], from their wealth a charity by which you purify them and cause them increase, and invoke [Allah 's blessings] upon them.",
            hadithText: "The Prophet ﷺ said: 'Charity does not decrease wealth.' (Sahih Muslim)",
            explanation: "Zakat is often misunderstood as a tax. This verse clarifies that it is a purification (Tahara) for the soul and the wealth itself. It removes greed and increases blessings (Barakah)."
          },
          fr: {
            verseTranslation: "Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis, et prie pour eux.",
            hadithText: "Le Prophète ﷺ a dit : 'L'aumône ne diminue jamais la richesse.' (Sahih Muslim)",
            explanation: "La Zakat est souvent mal comprise comme une taxe. Ce verset clarifie qu'elle est une purification (Tahara) pour l'âme et les biens eux-mêmes. Elle enlève l'avarice et augmente la Barakah."
          }
        }
      },
      { 
        id: 'p4', title: "Sawm: Fasting Ramadan", duration: "31:15", 
        surah: 2, ayah: 183,
        description: "Fasting prescribed for piety (Surah Al-Baqarah).",
        transcript: {
          verseArabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
          en: {
            verseTranslation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
            hadithText: "The Prophet ﷺ said: 'Fasting is a shield.'",
            explanation: "Fasting is not merely hunger. The goal stated in the Quran is 'Taqwa' (God-consciousness). It trains the self-discipline needed to avoid sin."
          },
          fr: {
            verseTranslation: "Ô les croyants ! On vous a prescrit le jeûne comme on l'a prescrit à ceux d'avant vous, ainsi atteindrez-vous la piété.",
            hadithText: "Le Prophète ﷺ a dit : 'Le jeûne est un bouclier.'",
            explanation: "Le jeûne n'est pas seulement la faim. Le but énoncé dans le Coran est la 'Taqwa' (crainte pieuse). Il entraîne à l'autodiscipline nécessaire pour éviter le péché."
          }
        }
      }
    ]
  },
  {
    id: 'heart_softeners',
    title: "Heart Softeners",
    speaker: "Mufti Menk",
    category: "Spirituality",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop",
    episodes: [
      { 
        id: 'hs1', title: "The Power of Dua", duration: "14:20", 
        surah: 40, ayah: 60,
        description: "Why invocation is the essence of worship.",
        transcript: {
          verseArabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
          en: {
            verseTranslation: "And your Lord says, 'Call upon Me; I will respond to you.'",
            hadithText: "The Prophet ﷺ said: 'Dua is worship.'",
            explanation: "Never underestimate the power of raising your hands. Allah loves to be asked, and He has promised to answer. Dua changes destiny."
          },
          fr: {
            verseTranslation: "Et votre Seigneur dit : 'Appelez-Moi, Je vous répondrai.'",
            hadithText: "Le Prophète ﷺ a dit : 'L'invocation, c'est l'adoration.'",
            explanation: "Ne sous-estimez jamais le pouvoir de lever les mains. Allah aime qu'on Lui demande, et Il a promis de répondre. L'invocation peut changer le destin."
          }
        }
      },
      { 
        id: 'hs2', title: "Overcoming Anxiety", duration: "18:45", 
        surah: 94, ayah: 6,
        description: "Finding peace in times of distress.",
        transcript: {
          verseArabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          en: {
            verseTranslation: "Indeed, with hardship [will be] ease.",
            explanation: "Anxiety often comes from focusing on the problem rather than the Provider. This verse assures us that ease is not just after hardship, but accompanies it."
          },
          fr: {
            verseTranslation: "A côté de la difficulté est, certes, une facilité.",
            explanation: "L'anxiété vient souvent du fait de se concentrer sur le problème plutôt que sur le Pourvoyeur. Ce verset nous assure que la facilité n'est pas seulement après la difficulté, mais l'accompagne."
          }
        }
      }
    ]
  },
  {
    id: 'seerah',
    title: "The Seerah",
    speaker: "Sh. Yasir Qadhi",
    category: "History",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop",
    episodes: [
      { 
        id: 's1', title: "Ep 1: Year of the Elephant", duration: "46:50", 
        surah: 105, ayah: 1,
        description: "The historical context of the Prophet's birth.",
        transcript: {
          verseArabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
          en: {
            verseTranslation: "Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant?",
            explanation: "This Surah refers to the year the Prophet ﷺ was born. Abraha tried to destroy the Kaaba, but Allah sent birds to protect His House, setting the stage for the arrival of the Final Messenger."
          },
          fr: {
            verseTranslation: "N'as-tu pas vu comment ton Seigneur a agi envers les gens de l'Éléphant ?",
            explanation: "Cette sourate fait référence à l'année de naissance du Prophète ﷺ. Abraha a tenté de détruire la Kaaba, mais Allah a envoyé des oiseaux pour protéger Sa Maison, préparant ainsi l'arrivée du Dernier Messager."
          }
        }
      }
    ]
  },
  {
    id: 'sahaba_lives',
    title: "Lives of the Sahaba",
    speaker: "Dr. Omar Suleiman",
    category: "History",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop",
    episodes: [
      { 
        id: 'sb1', title: "Abu Bakr: The Truthful", duration: "42:10", 
        surah: 9, ayah: 40,
        description: "The unwavering faith of Abu Bakr As-Siddiq (RA).",
        transcript: {
          verseArabic: "إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
          en: {
            verseTranslation: "When he said to his companion, 'Do not grieve; indeed Allah is with us.'",
            explanation: "During the migration, facing certain death in the cave, Abu Bakr's worry was for the Prophet ﷺ. This verse immortalizes his companionship and his title 'As-Siddiq'."
          },
          fr: {
            verseTranslation: "Quand il dit à son compagnon : 'Ne t'afflige pas, car Allah est avec nous.'",
            explanation: "Durant l'hégire, face à une mort certaine dans la grotte, l'inquiétude d'Abu Bakr était pour le Prophète ﷺ. Ce verset immortalise son compagnonnage et son titre 'As-Siddiq'."
          }
        }
      }
    ]
  },
  {
    id: 'quran_tafsir',
    title: "Quran Tafsir",
    speaker: "Nouman Ali Khan",
    category: "Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop",
    episodes: [
      { 
        id: 't1', title: "Surah Al-Fatiha Deep Dive", duration: "58:20", 
        surah: 1, ayah: 1,
        description: "The Opening: Understanding the Mother of the Book.",
        transcript: {
          verseArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          en: {
            verseTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
            explanation: "The Basmalah begins every Surah (except Tawbah). It reminds us that every action should start with Allah's name, invoking His two major attributes of Mercy."
          },
          fr: {
            verseTranslation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
            explanation: "La Basmalah commence chaque Sourate (sauf Tawbah). Elle nous rappelle que chaque action doit commencer par le nom d'Allah, invoquant Ses deux attributs majeurs de Miséricorde."
          }
        }
      }
    ]
  }
];

const CATEGORIES = ['All', 'Fiqh', 'History', 'Quran', 'Spirituality'];

const PodcastList: React.FC<PodcastListProps> = ({ onBack, language = 'en' }) => {
  const { playSurah, currentSurah, isPlaying, togglePlay } = useAudio();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<PodcastSeries | null>(null);

  const t = {
    title: language === 'fr' ? 'Podcasts' : 'Podcasts',
    subtitle: language === 'fr' ? 'Écoutez et Apprenez' : 'Listen & Learn',
    search: language === 'fr' ? 'Rechercher...' : 'Search...',
    episodes: language === 'fr' ? 'épisodes' : 'episodes',
    listen: language === 'fr' ? 'Écouter' : 'Listen',
    playing: language === 'fr' ? 'Lecture...' : 'Playing...',
    playlistInfo: language === 'fr' ? 'Récitation + Explication' : 'Recitation + Explanation',
    transcript: language === 'fr' ? 'Transcription & Guide' : 'Transcript & Guide',
    verse: language === 'fr' ? 'Verset Coranique' : 'Quranic Verse',
    explanation: language === 'fr' ? 'Explication & Hadith' : 'Explanation & Hadith',
  };

  const filteredSeries = PODCAST_DATA.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.speaker.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePlayEpisode = (series: PodcastSeries, episode: Episode) => {
    // Construct the Audio Playlist for this episode
    // 1. Arabic Recitation (Al-Afasy)
    // 2. Translation/Guide (Leclerc for FR, Ibrahim Walk for EN)
    
    const id = formatAyahId(episode.surah, episode.ayah);
    
    // Determine translation source based on language
    const transSource = language === 'fr' 
      ? `https://everyayah.com/data/Leclerc_128kbps/${id}.mp3`
      : `https://everyayah.com/data/Ibrahim_Walk_192kbps_TEST/${id}.mp3`;

    const playlist = [
      {
        number: 1,
        audio: `https://everyayah.com/data/Alafasy_128kbps/${id}.mp3`,
        arabic: episode.description,
        translation: "1. Recitation (Al-Afasy)"
      },
      {
        number: 2,
        audio: transSource,
        arabic: language === 'fr' ? "Traduction & Guide" : "Translation & Guide",
        translation: language === 'fr' ? "2. Explication du sens" : "2. Meaning & Explanation"
      }
    ];

    playSurah(
      playlist, 
      { name: episode.title, number: 0 }, 
      series.title 
    );
  };

  // View: Single Series Details
  if (selectedSeries) {
    return (
      <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
        {/* Header Image */}
        <div className="relative h-64 w-full">
           <div 
             className="absolute inset-0 bg-cover bg-center"
             style={{ backgroundImage: `url(${selectedSeries.image})` }}
           >
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
           </div>
           
           <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
              <button onClick={() => setSelectedSeries(null)} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors">
                 <ArrowLeft size={20} />
              </button>
              <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors">
                 <Share2 size={20} />
              </button>
           </div>

           <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
              <span className="px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold mb-2 inline-block shadow-lg">
                {selectedSeries.category}
              </span>
              <h1 className="text-3xl font-bold mb-1 shadow-sm">{selectedSeries.title}</h1>
              <p className="text-slate-300 font-medium flex items-center gap-2">
                 <Mic size={16} /> {selectedSeries.speaker}
              </p>
           </div>
        </div>

        {/* Episode List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 bg-white dark:bg-slate-950 rounded-t-3xl -mt-6 relative z-20">
           <div className="flex justify-between items-center mb-2 px-2 pt-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{selectedSeries.episodes.length} {t.episodes}</h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                 <ListMusic size={12} /> {t.playlistInfo}
              </div>
           </div>

           {selectedSeries.episodes.map((ep, idx) => {
             const isCurrent = currentSurah?.name === ep.title; 
             // Determine current transcript content based on language
             const transcriptContent = (language === 'fr' ? ep.transcript.fr : ep.transcript.en) || ep.transcript.en;

             return (
               <div key={ep.id} className={`rounded-2xl border transition-all overflow-hidden ${isCurrent ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900'}`}>
                  {/* Card Header/Controls */}
                  <div className="p-4 flex justify-between items-start gap-3">
                     <div className="flex-1">
                        <h4 className={`font-bold text-base mb-1 ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                          {ep.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                          {ep.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                           <span className="flex items-center gap-1"><Clock size={12} /> {ep.duration}</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><ListMusic size={12} /> 2 Tracks</span>
                        </div>
                     </div>
                     
                     <button 
                       onClick={() => isCurrent ? togglePlay() : handlePlayEpisode(selectedSeries, ep)}
                       className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 flex-shrink-0 ${isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700'}`}
                     >
                        {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                     </button>
                  </div>

                  {/* Accessible Transcript Section - Visible when playing */}
                  {isCurrent && (
                    <div className="px-4 pb-4 pt-0 animate-fade-in">
                       <div className="mt-2 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
                          <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
                             <AlignLeft size={16} />
                             <span className="text-xs font-bold uppercase tracking-wider">{t.transcript}</span>
                          </div>
                          
                          {/* Verse Section */}
                          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-3 shadow-sm">
                             <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <BookOpen size={14} />
                                <span className="text-[10px] font-bold uppercase">{t.verse}</span>
                             </div>
                             <p className="font-arabic text-xl text-right text-slate-800 dark:text-slate-200 leading-loose mb-2" dir="rtl">{ep.transcript.verseArabic}</p>
                             <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{transcriptContent.verseTranslation}"</p>
                          </div>

                          {/* Explanation Section */}
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Quote size={14} />
                                <span className="text-[10px] font-bold uppercase">{t.explanation}</span>
                             </div>
                             {transcriptContent.hadithText && (
                               <p className="text-sm text-slate-800 dark:text-slate-200 font-medium mb-3 border-l-2 border-emerald-500 pl-3">
                                 {transcriptContent.hadithText}
                               </p>
                             )}
                             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                               {transcriptContent.explanation}
                             </p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
             );
           })}
        </div>
      </div>
    );
  }

  // View: Browse Series
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="p-6 pb-2 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 rounded-full transition-transform active:scale-90 shadow-sm border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder={t.search} 
             value={searchTerm} 
             onChange={(e) => setSearchTerm(e.target.value)} 
             className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all" 
           />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {CATEGORIES.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                 activeCategory === cat 
                   ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                   : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 pt-2">
         <div className="grid grid-cols-1 gap-4">
            {filteredSeries.map(series => (
               <button 
                 key={series.id}
                 onClick={() => setSelectedSeries(series)}
                 className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left group"
               >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                     <img src={series.image} alt={series.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                           <Headphones size={14} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">
                           {series.category}
                        </span>
                     </div>
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1 truncate">
                        {series.title}
                     </h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Mic size={12} /> {series.speaker}
                     </p>
                     <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {series.episodes.length} {t.episodes}
                     </p>
                  </div>
                  
                  <div className="pr-2">
                     <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 transition-colors">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                     </div>
                  </div>
               </button>
            ))}
         </div>
         
         {filteredSeries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
               <Headphones size={48} className="mb-4 text-slate-300" />
               <p className="text-slate-500">No podcasts found.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default PodcastList;
