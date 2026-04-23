
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import PrayerCard from './components/PrayerCard';
import MiniCalendar from './components/MiniCalendar';
import PrayerCatalog from './components/PrayerCatalog';
import ChatInterface from './components/ChatInterface';
import MosqueFinder from './components/MosqueFinder';
import DailyVerseCard from './components/DailyVerseCard';
import DailyStoryCard from './components/DailyStoryCard';
import QiblaFinder from './components/QiblaFinder';
import TasbihCounter from './components/TasbihCounter';
import QuranCatalog from './components/QuranCatalog';
import ProphetStories from './components/ProphetStories';
import HijriCalendar from './components/HijriCalendar';
import SettingsModal from './components/SettingsModal';
import HifzTracker from './components/HifzTracker';
import DuaCollection from './components/DuaCollection';
import UserProfile from './components/UserProfile';
import LandingPage from './components/LandingPage';
import MiniPlayer from './components/MiniPlayer';
import DailyHadithCard from './components/DailyHadithCard';
import HadithCatalog from './components/HadithCatalog';
import RecitersCatalog from './components/RecitersCatalog';
import DailyQuizCard from './components/DailyQuizCard';
import { AudioProvider } from './contexts/AudioContext';
import { getPrayerTimes } from './services/prayerService';
import { PrayerTimes, HijriDate } from './types';
import { Settings, Compass, Hand, Quote, BookOpen, ScrollText, MapPin, GraduationCap, HandHeart, User, Download, Share, PlusSquare, X, Feather, Mic, BrainCircuit } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    tasbihTitle: "Tasbih",
    qiblaTitle: "Qibla",
    mosquesTitle: "Mosques",
    chatTitle: "Ask Sabildeen AI",
    storiesTitle: "Prophets",
    quranTitle: "Quran",
    hadithsTitle: "Hadiths",
    recitersTitle: "Reciters",
    calendarTitle: "Calendar",
    dateError: "Islamic Companion",
    dailyInspo: "Daily Inspiration",
    dailyHadith: "Daily Hadith",
    dailyQuiz: "Daily Quiz",
    greetings: "As-salamu alaykum",
    duas: "Duas",
    profile: "Profile",
    installApp: "Install App",
    installIOS: "Install on iOS",
    installInstructions: "To install this app on your iPhone/iPad:",
    step1: "Tap the Share button",
    step2: "Scroll down and tap 'Add to Home Screen'",
    gotIt: "Got it"
  },
  fr: {
    tasbihTitle: "Tasbih",
    qiblaTitle: "Qibla",
    mosquesTitle: "Mosquées",
    chatTitle: "Demander à l'IA",
    storiesTitle: "Prophètes",
    quranTitle: "Coran",
    hadithsTitle: "Hadiths",
    recitersTitle: "Récitateurs",
    calendarTitle: "Calendrier",
    dateError: "Compagnon Islamique",
    dailyInspo: "Inspiration du Jour",
    dailyHadith: "Hadith du Jour",
    dailyQuiz: "Quiz du Jour",
    greetings: "As-salamu alaykum",
    duas: "Invocations",
    profile: "Profil",
    installApp: "Installer l'app",
    installIOS: "Installer sur iOS",
    installInstructions: "Pour installer l'application sur iPhone/iPad :",
    step1: "Appuyez sur le bouton Partager",
    step2: "Cherchez et appuyez sur 'Sur l'écran d'accueil'",
    gotIt: "Compris"
  },
  es: {
    tasbihTitle: "Tasbih",
    qiblaTitle: "Alquibla",
    mosquesTitle: "Mezquitas",
    chatTitle: "Preguntar a IA",
    storiesTitle: "Profetas",
    quranTitle: "Corán",
    hadithsTitle: "Hadices",
    recitersTitle: "Recitadores",
    calendarTitle: "Calendario",
    dateError: "Compañero Islámico",
    dailyInspo: "Inspiración Diaria",
    dailyHadith: "Hadiz Diario",
    dailyQuiz: "Quiz del Día",
    greetings: "As-salamu alaykum",
    duas: "Súplicas",
    profile: "Perfil",
    installApp: "Instalar App",
    installIOS: "Instalar en iOS",
    installInstructions: "Para instalar en iPhone/iPad:",
    step1: "Toca el botón Compartir",
    step2: "Selecciona 'Añadir a Inicio'",
    gotIt: "Entendido"
  },
  wo: {
    tasbihTitle: "Kurus",
    qiblaTitle: "Jubluway",
    mosquesTitle: "Jàkka",
    chatTitle: "Laaj AI",
    storiesTitle: "Yonent yi",
    quranTitle: "Alxuraan",
    hadithsTitle: "Hadiths",
    recitersTitle: "Jàngkat yi",
    calendarTitle: "Arminaat",
    dateError: "Wëllure Lislaam",
    dailyInspo: "Xelal bu tey",
    dailyHadith: "Hadith bu tey",
    dailyQuiz: "Quiz bu Bés bi",
    greetings: "As-salamu alaykum",
    duas: "Ñaan",
    profile: "Profil",
    installApp: "Installer App bi",
    installIOS: "Installer ci iOS",
    installInstructions: "Ngir installer ci iPhone/iPad:",
    step1: "Bësal bouton Partager bi",
    step2: "Tànnal 'Sur l'écran d'accueil'",
    gotIt: "Xam naa ko"
  },
  ar: {
    tasbihTitle: "تسبِيح",
    qiblaTitle: "القبلة",
    mosquesTitle: "مساجد",
    chatTitle: "اسأل الذكاء الاصطناعي",
    storiesTitle: "الأنبياء",
    quranTitle: "القرآن",
    hadithsTitle: "الحديث",
    recitersTitle: "قرّاء",
    calendarTitle: "التقويم",
    dateError: "رفيق المسلم",
    dailyInspo: "إلهام يومي",
    dailyHadith: "حديث اليوم",
    dailyQuiz: "اختبار اليوم",
    greetings: "السلام عليكم",
    duas: "أدعية",
    profile: "الملف الشخصي",
    installApp: "تثبيت التطبيق",
    installIOS: "تثبيت على iOS",
    installInstructions: "لتثبيت التطبيق على الآيفون:",
    step1: "اضغط على زر المشاركة",
    step2: "اختر 'إضافة إلى الصفحة الرئيسية'",
    gotIt: "فهمت"
  }
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const hasVisited = localStorage.getItem('has_visited');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    return (hasVisited || isStandalone) ? 'home' : 'landing';
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [prayerData, setPrayerData] = useState<{ timings: PrayerTimes, date: HijriDate } | null>(null);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Language detection logic
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    const supported = ['en', 'fr', 'es', 'wo', 'ar'];
    return supported.includes(browserLang) ? browserLang : 'en';
  });

  const [calculationMethod, setCalculationMethod] = useState(() => parseInt(localStorage.getItem('calc_method') || '2'));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : saved === 'true';
  });

  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [targetSurahToRead, setTargetSurahToRead] = useState<number | null>(null);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const MAIN_TABS = ['home', 'quran', 'hadiths', 'chat'];

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('font-arabic');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  useEffect(() => {
    const isStand = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStand);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else if (isIOS) {
      setShowIOSPrompt(true);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => setLocation({ lat: 51.5074, lng: -0.1278 })
      );
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!location) return;
      setLoadingPrayers(true);
      const data = await getPrayerTimes(location.lat, location.lng, calculationMethod);
      setPrayerData(data);
      setLoadingPrayers(false);
    };
    fetch();
  }, [location, calculationMethod]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 pb-32 animate-fade-in">
            {/* Header */}
            <header className="flex justify-between items-center pt-6 pb-2 px-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <h1 className="text-4xl font-bold font-arabic text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 tracking-normal drop-shadow-sm">
                     Sabildeen
                   </h1>
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-3 animate-pulse"></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.25em] uppercase pl-1">
                  {t.dateError}
                </p>
              </div>
              <div className="flex gap-2">
                {!isStandalone && (deferredPrompt || isIOS) && (
                  <button 
                    onClick={handleInstallClick}
                    className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform active:scale-95 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    title={t.installApp}
                  >
                    <Download size={20} />
                  </button>
                )}
                <button 
                  onClick={() => setShowSettings(true)} 
                  className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-transform active:scale-95 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Settings size={20} />
                </button>
              </div>
            </header>
            
            <div className="grid grid-cols-2 gap-4 h-48">
              <PrayerCard 
                timings={prayerData?.timings || null} 
                loading={loadingPrayers} 
                language={language} 
                compact={true}
                onClick={() => setActiveTab('prayer-catalog')}
              />
              <MiniCalendar 
                date={prayerData?.date} 
                language={language} 
                onClick={() => setActiveTab('prayer-catalog')}
              />
            </div>
            
            <DailyStoryCard language={language} />
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('quran')} className="col-span-2 relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-all hover:border-emerald-200 dark:hover:border-emerald-900 active:scale-95 text-left flex items-center gap-4">
                 <div className="bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <BookOpen size={20} />
                 </div>
                 <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-100">{t.quranTitle}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Al-Quran</span>
                 </div>
              </button>

              <button onClick={() => setActiveTab('tasbih')} className="relative group overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 text-left h-28 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-white/20 transition-colors"></div>
                <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Hand size={18} className="text-white" />
                </div>
                <div>
                  <span className="block font-bold text-[15px]">{t.tasbihTitle}</span>
                  <span className="text-[10px] text-blue-100 opacity-80 font-medium">Digital Dhikr</span>
                </div>
              </button>

              <button onClick={() => setActiveTab('qibla')} className="relative group overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-3xl text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 text-left h-28 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-white/20 transition-colors"></div>
                <div className="bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Compass size={18} className="text-white" />
                </div>
                <div>
                  <span className="block font-bold text-[15px]">{t.qiblaTitle}</span>
                  <span className="text-[10px] text-purple-100 opacity-80 font-medium">Find Direction</span>
                </div>
              </button>

              <button onClick={() => setActiveTab('stories')} className="col-span-2 relative group overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600 p-4 rounded-3xl text-white shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01] active:scale-95 text-left flex items-center gap-4">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                 <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Feather size={20} className="text-white" />
                 </div>
                 <div>
                    <span className="block font-bold text-lg">{t.storiesTitle}</span>
                    <span className="text-[11px] text-teal-100 opacity-90 font-medium">Lives & Lessons</span>
                 </div>
              </button>

              <button onClick={() => setActiveTab('duas')} className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-all hover:border-amber-200 dark:hover:border-amber-900 active:scale-95 text-left flex items-center gap-3">
                 <div className="bg-amber-100 dark:bg-amber-900/30 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <HandHeart size={18} />
                 </div>
                 <div>
                    <span className="block font-bold text-[15px] text-slate-800 dark:text-slate-100">{t.duas}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Fortress</span>
                 </div>
              </button>

              <button onClick={() => setActiveTab('hadiths')} className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900 active:scale-95 text-left flex items-center gap-3">
                 <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ScrollText size={18} />
                 </div>
                 <div>
                    <span className="block font-bold text-[15px] text-slate-800 dark:text-slate-100">{t.hadithsTitle}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Sunnah</span>
                 </div>
              </button>

              <button onClick={() => setActiveTab('reciters')} className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-all hover:border-emerald-200 dark:hover:border-emerald-900 active:scale-95 text-left flex items-center gap-3">
                 <div className="bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Mic size={18} />
                 </div>
                 <div>
                    <span className="block font-bold text-[15px] text-slate-800 dark:text-slate-100">{t.recitersTitle}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Audio</span>
                 </div>
              </button>

              <button onClick={() => setActiveTab('mosques')} className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-900 active:scale-95 text-left flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block font-bold text-[15px] text-slate-800 dark:text-slate-100">{t.mosquesTitle}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Find Nearby</span>
                </div>
              </button>
            </div>

            <div className="grid gap-6">
              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center text-violet-600 dark:text-violet-400">
                      <BrainCircuit size={14} />
                    </div>
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{t.dailyQuiz}</h2>
                  </div>
                </div>
                <DailyQuizCard language={language} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <BookOpen size={14} />
                    </div>
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{t.dailyInspo}</h2>
                  </div>
                </div>
                <DailyVerseCard language={language} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ScrollText size={14} />
                    </div>
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{t.dailyHadith}</h2>
                  </div>
                </div>
                <DailyHadithCard language={language} />
              </section>
            </div>
          </div>
        );
      case 'landing': 
        return (
          <LandingPage 
            onEnterApp={() => {
              localStorage.setItem('has_visited', 'true');
              setActiveTab('home');
            }} 
            language={language} 
          />
        );
      case 'prayer-catalog': 
        return <PrayerCatalog prayerData={prayerData} loading={loadingPrayers} language={language} onBack={() => setActiveTab('home')} />;
      case 'quran': return <QuranCatalog onBack={() => setActiveTab('home')} language={language} initialSurah={targetSurahToRead} onClearSurah={() => setTargetSurahToRead(null)} />;
      case 'mosques': return <MosqueFinder location={location} language={language} />;
      case 'chat': return <ChatInterface language={language} />;
      case 'tasbih': return <TasbihCounter onBack={() => setActiveTab('home')} language={language} />;
      case 'qibla': return <QiblaFinder location={location} onBack={() => setActiveTab('home')} language={language} />;
      case 'stories': return <ProphetStories onBack={() => setActiveTab('home')} language={language} />;
      case 'duas': return <DuaCollection onBack={() => setActiveTab('home')} language={language} />;
      case 'calendar': return <HijriCalendar onBack={() => setActiveTab('home')} language={language} />;
      case 'profile': return <UserProfile onBack={() => setActiveTab('home')} language={language} />;
      case 'hifz': return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
           <div className="p-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-20 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
             <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
               <Settings className="rotate-90" size={20} />
             </button>
             <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Hifz Tracker</h1>
           </div>
           <div className="p-6">
             <HifzTracker language={language} />
           </div>
        </div>
      );
      case 'hadiths': return <HadithCatalog onBack={() => setActiveTab('home')} language={language} />;
      case 'reciters': return <RecitersCatalog onBack={() => setActiveTab('home')} language={language} onReadSurah={(num) => { setTargetSurahToRead(num); setActiveTab('quran'); }} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900">
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-950 relative shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        
        <main className={`min-h-screen relative z-10 ${activeTab === 'landing' ? 'bg-white dark:bg-slate-950' : ''}`}>
          <div className={`${activeTab === 'landing' ? '' : 'p-6'} min-h-screen`}>
             {renderContent()}
          </div>
        </main>
        
        {/* Only show MiniPlayer if audio is active */}
        {activeTab !== 'landing' && <MiniPlayer onReadFullSurah={(num) => { setTargetSurahToRead(num); setActiveTab('quran'); }} />}

        {activeTab !== 'landing' && MAIN_TABS.includes(activeTab) && (
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            language={language}
          />
        )}
        
        <SettingsModal 
          isOpen={showSettings} onClose={() => setShowSettings(false)}
          darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}
          language={language} setLanguage={setLanguage}
          calculationMethod={calculationMethod} setCalculationMethod={setCalculationMethod}
          prayerOffsets={{}} setPrayerOffset={() => {}} notifications={true} toggleNotifications={() => {}}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenLanding={() => setActiveTab('landing')}
          onOpenGuide={() => {}}
        />

        {showIOSPrompt && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in pb-8">
            <div className="bg-white dark:bg-slate-900 w-[95%] max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.installIOS}</h3>
                <button onClick={() => setShowIOSPrompt(false)} className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t.installInstructions}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                    <Share size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">1. {t.step1}</p>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 ml-5"></div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <PlusSquare size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">2. {t.step2}</p>
                </div>
              </div>
              <button onClick={() => setShowIOSPrompt(false)} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95">{t.gotIt}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
};

export default App;
