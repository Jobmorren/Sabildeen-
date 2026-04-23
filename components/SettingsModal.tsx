
import React, { useState } from 'react';
import { X, Moon, Sun, Bell, Globe, ChevronRight, Shield, CircleHelp, Clock, Plus, Minus, User, MessageSquare, AlertTriangle, Lightbulb, Send, CheckCircle2, ChevronLeft, Lock, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: boolean;
  toggleNotifications: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  calculationMethod: number;
  setCalculationMethod: (method: number) => void;
  prayerOffsets: Record<string, number>;
  setPrayerOffset: (prayer: string, offset: number) => void;
  onOpenProfile: () => void;
  onOpenLanding: () => void;
  onOpenGuide: () => void;
}

const CALCULATION_METHODS = [
  { id: 2, name: "ISNA (North America)" },
  { id: 1, name: "Muslim World League" },
  { id: 3, name: "Egyptian General Authority" },
  { id: 4, name: "Umm al-Qura (Makkah)" },
  { id: 5, name: "Karachi (Univ. of Islamic Sciences)" },
  { id: 12, name: "UOIF (France)" },
  { id: 13, name: "Diyanet (Turkey)" },
  { id: 14, name: "Russia (Spiritual Administration)" }
];

const PRAYERS_LIST = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
];

const TRANSLATIONS = {
  en: {
    title: "Settings",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    prayerCalc: "Prayer Calculation",
    calcMethod: "Calculation Method",
    timeAdj: "Manual Adjustments",
    adjDesc: "Adjust prayer times individually (+/- min)",
    general: "General",
    language: "Language",
    notifications: "Notifications",
    support: "Support",
    help: "Help & Feedback",
    privacy: "Privacy Policy",
    account: "Account",
    myProfile: "My Profile",
    website: "App Guide",
    feedbackTitle: "Send Feedback",
    feedbackType: "Feedback Type",
    bug: "Bug Report",
    suggestion: "Suggestion",
    other: "Other",
    message: "Your Message",
    send: "Send Message",
    sentSuccess: "Message sent successfully! Thank you.",
    sending: "Sending...",
    privacySections: [
      { title: "Introduction", content: "Welcome to Sabildeen. Your privacy is of paramount importance to us." },
      { title: "Location Data", content: "We use your device's location solely to calculate accurate Prayer Times and Qibla direction locally." }
    ]
  },
  fr: {
    title: "Paramètres",
    appearance: "Apparence",
    darkMode: "Mode Sombre",
    prayerCalc: "Calcul des Prières",
    calcMethod: "Méthode de Calcul",
    timeAdj: "Ajustements Manuels",
    adjDesc: "Ajuster chaque prière (+/- min)",
    general: "Général",
    language: "Langue",
    notifications: "Notifications",
    support: "Support",
    help: "Aide & Commentaires",
    privacy: "Confidentialité",
    account: "Compte",
    myProfile: "Mon Profil",
    website: "Guide / Manuel",
    feedbackTitle: "Envoyer un avis",
    feedbackType: "Type de retour",
    bug: "Bug / Erreur",
    suggestion: "Suggestion",
    other: "Autre",
    message: "Votre message",
    send: "Envoyer",
    sentSuccess: "Message envoyé !",
    sending: "Envoi...",
    privacySections: [
      { title: "Introduction", content: "Bienvenue sur Sabildeen. Votre vie privée est primordiale." },
      { title: "Données de Localisation", content: "Localisation utilisée uniquement pour le calcul des prières." }
    ]
  },
  es: {
    title: "Ajustes",
    appearance: "Apariencia",
    darkMode: "Modo Oscuro",
    prayerCalc: "Cálculo de Oración",
    calcMethod: "Método de Cálculo",
    timeAdj: "Ajustes Manuales",
    adjDesc: "Ajustar tiempos individualmente",
    general: "General",
    language: "Idioma",
    notifications: "Notificaciones",
    support: "Soporte",
    help: "Ayuda",
    privacy: "Privacidad",
    account: "Cuenta",
    myProfile: "Mi Perfil",
    website: "Guía de la App",
    feedbackTitle: "Enviar comentarios",
    feedbackType: "Tipo",
    bug: "Error",
    suggestion: "Sugerencia",
    other: "Otro",
    message: "Tu mensaje",
    send: "Enviar",
    sentSuccess: "¡Enviado!",
    sending: "Enviando...",
    privacySections: [
      { title: "Introducción", content: "Bienvenido a Sabildeen. Su privacidad es importante." },
      { title: "Ubicación", content: "Usamos la ubicación solo para calcular los tiempos de oración." }
    ]
  },
  wo: {
    title: "Tànnééf",
    appearance: "Melokaan",
    darkMode: "Melokaan bu ñuul",
    prayerCalc: "Xayma Julli",
    calcMethod: "Caret bu xayma",
    timeAdj: "Soppi waxtu",
    adjDesc: "Soppi waxtu julli yi",
    general: "Yeneen",
    language: "Lakk",
    notifications: "Yëgle",
    support: "Dimbal",
    help: "Dimbal",
    privacy: "Sutura",
    account: "Compte",
    myProfile: "Sama Profil",
    website: "Ndimbal",
    feedbackTitle: "Joxe xalaat",
    feedbackType: "Xeet",
    bug: "Njuumté",
    suggestion: "Xalaat",
    other: "Leneen",
    message: "Sa bataaxal",
    send: "Yónnee",
    sentSuccess: "Dem na!",
    sending: "Mu ngiy dem...",
    privacySections: [
      { title: "Duxin", content: "Dalal-jamm ci Sabildeen. Sa sutura dafa am solo." },
      { title: "Barab", content: "Ñu ngi jëfandikoo sa barab ngir xayma waxtu julli rekk." }
    ]
  },
  ar: {
    title: "الإعدادات",
    appearance: "المظهر",
    darkMode: "الوضع الليلي",
    prayerCalc: "حساب الصلاة",
    calcMethod: "طريقة الحساب",
    timeAdj: "تعديلات يدوية",
    adjDesc: "تعديل أوقات الصلاة",
    general: "عام",
    language: "اللغة",
    notifications: "إشعارات",
    support: "دعم",
    help: "مساعدة",
    privacy: "الخصوصية",
    account: "حساب",
    myProfile: "ملفي الشخصي",
    website: "دليل التطبيق",
    feedbackTitle: "إرسال ملاحظات",
    feedbackType: "النوع",
    bug: "خطأ",
    suggestion: "اقتراح",
    other: "آخر",
    message: "رسالتك",
    send: "إرسال",
    sentSuccess: "تم الإرسال!",
    sending: "جاري الإرسال...",
    privacySections: [
      { title: "مقدمة", content: "مرحباً بك في سبيل الدين. خصوصيتك تهمنا." },
      { title: "الموقع", content: "نستخدم الموقع فقط لحساب أوقات الصلاة والقبلة." }
    ]
  }
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  notifications,
  toggleNotifications,
  language,
  setLanguage,
  calculationMethod,
  setCalculationMethod,
  prayerOffsets,
  setPrayerOffset,
  onOpenProfile,
  onOpenLanding,
  onOpenGuide
}) => {
  const [view, setView] = useState<'main' | 'feedback' | 'privacy'>('main');
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const handleSendFeedback = () => {
    if (!message.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setMessage('');
        setView('main');
      }, 2500);
    }, 1500);
  };

  const renderFeedbackForm = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <button 
          onClick={() => setView('main')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <ChevronLeft size={20} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.feedbackTitle}</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {isSent ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.sentSuccess}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {t.feedbackType}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFeedbackType('bug')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${feedbackType === 'bug' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <AlertTriangle size={20} />
                  <span className="text-xs font-bold">{t.bug}</span>
                </button>
                <button
                  onClick={() => setFeedbackType('suggestion')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${feedbackType === 'suggestion' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <Lightbulb size={20} />
                  <span className="text-xs font-bold">{t.suggestion}</span>
                </button>
                <button
                  onClick={() => setFeedbackType('other')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${feedbackType === 'other' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <MessageSquare size={20} />
                  <span className="text-xs font-bold">{t.other}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {t.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="..."
                className="w-full h-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all"
              ></textarea>
            </div>

            <button
              onClick={handleSendFeedback}
              disabled={isSending || !message.trim()}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              {isSending ? (
                t.sending
              ) : (
                <>
                  <Send size={18} /> {t.send}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <button 
          onClick={() => setView('main')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <ChevronLeft size={20} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.privacy}</h2>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
           <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                 <Shield size={32} />
              </div>
           </div>
           
           {t.privacySections.map((section, index) => (
             <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                   {index === 0 ? <Lightbulb size={16} className="text-amber-500" /> : <Lock size={16} className="text-emerald-500" />}
                   {section.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                   {section.content}
                </p>
             </div>
           ))}
           
           <div className="text-center pt-4">
              <p className="text-xs text-slate-400">Sabildeen - v1.3.0</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-950 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-fade-in-up flex flex-col h-[80vh] max-h-[700px]">
        
        {view === 'feedback' ? (
          renderFeedbackForm()
        ) : view === 'privacy' ? (
          renderPrivacyPolicy()
        ) : (
          <>
            {/* Main Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.title}</h2>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
              
              {/* Section: Account */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{t.account}</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                   <button 
                     onClick={() => { onClose(); onOpenProfile(); }}
                     className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
                   >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md">
                          <User size={20} />
                        </div>
                        <div className="text-left rtl:text-right">
                           <span className="font-bold text-slate-800 dark:text-slate-100 block">{t.myProfile}</span>
                           <span className="text-xs text-slate-500 dark:text-slate-400">Stats & Favorites</span>
                        </div>
                     </div>
                     <ChevronRight size={18} className={`text-slate-400 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                   </button>
                </div>
              </div>

              {/* Section: General */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{t.general}</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                   {/* Language */}
                   <div className="p-4">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Globe size={18} />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{t.language}</span>
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${language === lang.code ? 'bg-white dark:bg-slate-800 text-emerald-600 border-emerald-200 dark:border-emerald-800 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="mr-1">{lang.flag}</span> {lang.name}
                            </button>
                        ))}
                     </div>
                   </div>

                   {/* Notifications */}
                   <button 
                     onClick={toggleNotifications}
                     className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notifications ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          <Bell size={18} />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{t.notifications}</span>
                     </div>
                     <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-300'} ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${notifications ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`}></div>
                     </div>
                   </button>
                </div>
              </div>

              {/* Section: Appearance */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{t.appearance}</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                   <button 
                     onClick={toggleDarkMode}
                     className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{t.darkMode}</span>
                     </div>
                     <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'} ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${darkMode ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`}></div>
                     </div>
                   </button>
                </div>
              </div>
              
              {/* Section: Prayer Settings */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{t.prayerCalc}</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    
                    {/* Method */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <Clock size={18} />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">{t.calcMethod}</span>
                        </div>
                        <select 
                            value={calculationMethod}
                            onChange={(e) => setCalculationMethod(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            {CALCULATION_METHODS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Individual Manual Adjustments */}
                    <div className="p-4">
                        <div className="flex flex-col mb-4">
                            <span className="font-medium text-slate-700 dark:text-slate-200">{t.timeAdj}</span>
                            <span className="text-xs text-slate-500">{t.adjDesc}</span>
                        </div>
                        
                        <div className="space-y-3">
                            {PRAYERS_LIST.map(prayer => (
                                <div key={prayer} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 pl-4">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{prayer}</span>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setPrayerOffset(prayer, (prayerOffsets[prayer] || 0) - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {(prayerOffsets[prayer] || 0) > 0 ? `+${prayerOffsets[prayer]}` : (prayerOffsets[prayer] || 0)}
                                        </span>
                                        <button 
                                            onClick={() => setPrayerOffset(prayer, (prayerOffsets[prayer] || 0) + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
              </div>
              
               {/* Section: Support */}
               <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{t.support}</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                   
                   {/* Contact Creator / Report Issue */}
                   <button 
                      onClick={() => setView('feedback')}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <MessageSquare size={18} />
                         </div>
                         <span className="font-medium text-slate-700 dark:text-slate-200">{t.help}</span>
                      </div>
                      <ChevronRight size={16} className={`text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
                   </button>

                   <button 
                      onClick={() => setView('privacy')}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                            <Shield size={18} />
                         </div>
                         <span className="font-medium text-slate-700 dark:text-slate-200">{t.privacy}</span>
                      </div>
                      <ChevronRight size={16} className={`text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
                   </button>
                </div>
              </div>
              
              <div className="text-center pb-4 pt-2">
                 <p className="text-xs text-slate-400">Sabildeen App v1.3.0</p>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
