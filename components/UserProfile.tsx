
import React, { useState, useEffect, useRef } from 'react';
import { User, Award, Book, Bookmark, Activity, Edit2, Camera, ChevronRight, BarChart3, LogOut, Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { HifzProgress, SavedHadith } from '../types';

declare const google: any;

// NOTE: In a real production app, this should be in an environment variable.
// If not set, the app will fallback to a "Demo Mode" for testing purposes.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

interface UserProfileProps {
  onBack: () => void;
  language?: string;
}

const TRANSLATIONS = {
  en: {
    title: "My Profile",
    memberSince: "Member since",
    stats: "Statistics",
    hifzProgress: "Hifz Progress",
    versesMemorized: "Verses Memorized",
    savedHadiths: "Saved Hadiths",
    collection: "Collection",
    prayerStreak: "Prayer Streak",
    currentStreak: "Current Streak",
    editProfile: "Edit Profile",
    name: "Name",
    save: "Save",
    achievements: "Achievements",
    novice: "Novice Believer",
    seeker: "Knowledge Seeker",
    devoted: "Devoted Servant",
    hifzMaster: "Guardian of Quran",
    connectAccounts: "Connected Accounts",
    connectGoogle: "Connect Google",
    googleConnected: "Google Connected",
    disconnect: "Disconnect",
    uploadPhoto: "Change Photo",
    googleError: "Google Sign-In Error.",
    googleLoading: "Connecting...",
    scriptError: "Google services not loaded.",
    demoMode: "Demo Mode: Simulating connection..."
  },
  fr: {
    title: "Mon Profil",
    memberSince: "Membre depuis",
    stats: "Statistiques",
    hifzProgress: "Progression Hifz",
    versesMemorized: "Versets Mémorisés",
    savedHadiths: "Hadiths Favoris",
    collection: "Collection",
    prayerStreak: "Série de Prières",
    currentStreak: "Série Actuelle",
    editProfile: "Modifier le profil",
    name: "Nom",
    save: "Enregistrer",
    achievements: "Succès",
    novice: "Croyant Novice",
    seeker: "Chercheur de Savoir",
    devoted: "Serviteur Dévoué",
    hifzMaster: "Gardien du Coran",
    connectAccounts: "Comptes Connectés",
    connectGoogle: "Connecter Google",
    googleConnected: "Compte Google lié",
    disconnect: "Déconnecter",
    uploadPhoto: "Changer la photo",
    googleError: "Erreur de connexion Google.",
    googleLoading: "Connexion...",
    scriptError: "Services Google non chargés.",
    demoMode: "Mode Démo : Simulation de connexion..."
  },
  es: {
    title: "Mi Perfil",
    memberSince: "Miembro desde",
    stats: "Estadísticas",
    hifzProgress: "Progreso Hifz",
    versesMemorized: "Versos Memorizados",
    savedHadiths: "Hadices Guardados",
    collection: "Colección",
    prayerStreak: "Racha de Oración",
    currentStreak: "Racha Actual",
    editProfile: "Editar Perfil",
    name: "Nombre",
    save: "Guardar",
    achievements: "Logros",
    novice: "Creyente Novato",
    seeker: "Buscador de Conocimiento",
    devoted: "Siervo Devoto",
    hifzMaster: "Guardián del Corán",
    connectAccounts: "Cuentas Conectadas",
    connectGoogle: "Conectar Google",
    googleConnected: "Google Conectado",
    disconnect: "Desconectar",
    uploadPhoto: "Cambiar foto",
    googleError: "Error de conexión.",
    googleLoading: "Conectando...",
    scriptError: "Servicios de Google no cargados.",
    demoMode: "Modo Demo: Simulando..."
  },
  wo: {
    title: "Sama Profil",
    memberSince: "Bokk na fi depi",
    stats: "Léébu",
    hifzProgress: "Tari Alxuraan",
    versesMemorized: "Aaya yu mokkal",
    savedHadiths: "Hadith yu denc",
    collection: "Denc",
    prayerStreak: "Julli yu tegu",
    currentStreak: "Li ci tegu",
    editProfile: "Soppi profil",
    name: "Tur",
    save: "Denc",
    achievements: "Ndam",
    novice: "Talibé bu ndaw",
    seeker: "Kuy wut xam-xam",
    devoted: "Jaamu Yalla",
    hifzMaster: "Wattu Alxuraan",
    connectAccounts: "Komp yi lëkkaloo",
    connectGoogle: "Lëkkale Google",
    googleConnected: "Google lëkkaloo na",
    disconnect: "Dindi",
    uploadPhoto: "Soppi nataal",
    googleError: "Njuumté ci Google.",
    googleLoading: "Mu ngiy lëkkaloo...",
    scriptError: "Google doxul.",
    demoMode: "Demo Mode..."
  },
  ar: {
    title: "ملفي الشخصي",
    memberSince: "عضو منذ",
    stats: "إحصائيات",
    hifzProgress: "تقدم الحفظ",
    versesMemorized: "آيات محفوظة",
    savedHadiths: "الأحاديث المحفوظة",
    collection: "مجموعة",
    prayerStreak: "المواظبة على الصلاة",
    currentStreak: "سلسلة الحالية",
    editProfile: "تعديل الملف",
    name: "الاسم",
    save: "حفظ",
    achievements: "إنجازات",
    novice: "مؤمن جديد",
    seeker: "طالب علم",
    devoted: "عبد مخلص",
    hifzMaster: "حافظ القرآن",
    connectAccounts: "الحسابات المتصلة",
    connectGoogle: "ربط حساب جوجل",
    googleConnected: "تم ربط جوجل",
    disconnect: "فصل",
    uploadPhoto: "تغيير الصورة",
    googleError: "خطأ في الاتصال.",
    googleLoading: "جاري الاتصال...",
    scriptError: "خدمات جوجل غير محملة.",
    demoMode: "وضع تجريبي..."
  }
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 0, 0)">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
    </g>
  </svg>
);

const UserProfile: React.FC<UserProfileProps> = ({ onBack, language = 'en' }) => {
  // User Info State
  const [name, setName] = useState('Muslim User');
  const [joinDate, setJoinDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Stats State
  const [hifzCount, setHifzCount] = useState(0);
  const [hadithCount, setHadithCount] = useState(0);
  const [prayerStreak, setPrayerStreak] = useState(0);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    // Load User Data
    const savedName = localStorage.getItem('user_name');
    const savedDate = localStorage.getItem('user_join_date');
    const savedAvatar = localStorage.getItem('user_avatar');
    const googleStatus = localStorage.getItem('user_google_connected');
    
    if (savedName) setName(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (googleStatus === 'true') setIsGoogleConnected(true);
    
    if (savedDate) {
      setJoinDate(savedDate);
    } else {
      const now = new Date().toLocaleDateString();
      localStorage.setItem('user_join_date', now);
      setJoinDate(now);
    }

    // Load Hifz Stats
    const hifzData = localStorage.getItem('hifz_progress');
    if (hifzData) {
      try {
        const parsed: HifzProgress[] = JSON.parse(hifzData);
        const totalVerses = parsed.reduce((acc, curr) => acc + curr.memorizedVerses.length, 0);
        setHifzCount(totalVerses);
      } catch (e) { console.error(e); }
    }

    // Load Hadith Stats
    const hadithData = localStorage.getItem('sabildeen_saved_hadiths');
    if (hadithData) {
      try {
        const parsed: SavedHadith[] = JSON.parse(hadithData);
        setHadithCount(parsed.length);
      } catch (e) { console.error(e); }
    }

    // Load Prayer Stats
    const prayerData = localStorage.getItem('prayer_tracker_history');
    if (prayerData) {
      try {
        const history = JSON.parse(prayerData);
        setPrayerStreak(Object.keys(history).length);
      } catch (e) { console.error(e); }
    }

    // Check Google Script
    const checkGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        setScriptLoaded(true);
        clearInterval(checkGoogle);
      }
    }, 500);
    setTimeout(() => clearInterval(checkGoogle), 5000); // Timeout after 5s

    return () => clearInterval(checkGoogle);
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('user_name', name);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('user_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGoogleConnect = () => {
    if (isGoogleConnected) {
      // Disconnect logic
      setIsGoogleConnected(false);
      localStorage.setItem('user_google_connected', 'false');
      // We purposefully don't clear name/avatar to avoid jarring UI changes, user can edit manually.
    } else {
      setIsConnecting(true);

      // 1. Check if script loaded
      if (typeof google === 'undefined' || !google.accounts) {
          alert(t.scriptError);
          setIsConnecting(false);
          return;
      }

      // 2. Check if we have a valid Client ID (not the placeholder)
      // If placeholder, we simulate a successful login for DEMO purposes.
      if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
          console.warn("Using Demo Mode for Google Sign-In");
          setTimeout(() => {
              const demoName = "Demo User";
              const demoAvatar = "https://lh3.googleusercontent.com/a/default-user=s96-c";
              
              setName(demoName);
              setAvatar(demoAvatar);
              setIsGoogleConnected(true);
              localStorage.setItem('user_google_connected', 'true');
              localStorage.setItem('user_name', demoName);
              localStorage.setItem('user_avatar', demoAvatar);
              
              setIsConnecting(false);
              alert(language === 'fr' 
                ? "Connexion simulée (Mode Démo). Ajoutez un Client ID valide pour la production." 
                : "Connection simulated (Demo Mode). Add a valid Client ID for production.");
          }, 1500);
          return;
      }

      // 3. Real Auth Flow
      try {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            callback: async (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    try {
                        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                        });
                        
                        if (!userInfoRes.ok) throw new Error("Failed to fetch user info");
                        
                        const userInfo = await userInfoRes.json();
                        
                        if (userInfo) {
                            if (userInfo.name) {
                                setName(userInfo.name);
                                localStorage.setItem('user_name', userInfo.name);
                            }
                            if (userInfo.picture) {
                                setAvatar(userInfo.picture);
                                localStorage.setItem('user_avatar', userInfo.picture);
                            }
                            setIsGoogleConnected(true);
                            localStorage.setItem('user_google_connected', 'true');
                        }
                    } catch (error) {
                        console.error("Error fetching user info", error);
                        alert(t.googleError);
                    } finally {
                        setIsConnecting(false);
                    }
                } else {
                    setIsConnecting(false);
                }
            },
            error_callback: (err: any) => {
                console.error("Google Auth Error Callback", err);
                setIsConnecting(false);
                alert(t.googleError);
            }
          });
          
          client.requestAccessToken();
      } catch (err) {
          console.error("Google Auth Error", err);
          setIsConnecting(false);
          alert(t.googleError);
      }
    }
  };

  // Calculate Badge
  let badge = t.novice;
  let badgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  let badgeIcon = User;

  const totalScore = hifzCount + (hadithCount * 5) + prayerStreak;

  if (totalScore > 500) {
    badge = t.hifzMaster;
    badgeColor = "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    badgeIcon = Award;
  } else if (totalScore > 200) {
    badge = t.devoted;
    badgeColor = "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    badgeIcon = Activity;
  } else if (totalScore > 50) {
    badge = t.seeker;
    badgeColor = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    badgeIcon = Book;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in pb-24">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 dark:border-slate-800 relative z-10">
         <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:scale-105 transition-transform rtl:right-6 rtl:left-auto">
            <ChevronRight size={20} className="rotate-180 text-slate-600 dark:text-slate-300 rtl:rotate-0" />
         </button>
         
         <div className="flex flex-col items-center">
            {/* Avatar Section */}
            <div 
              className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 p-1 mb-4 shadow-lg shadow-emerald-500/20 relative group cursor-pointer"
              onClick={triggerFileInput}
            >
               <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
               </div>
               <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                  <Camera size={16} className="text-emerald-500" />
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleFileChange}
               />
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-center font-bold text-lg text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button onClick={handleSaveProfile} className="p-1.5 bg-emerald-500 text-white rounded-full">
                  <CheckIcon size={16} />
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                {name} 
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                  <Edit2 size={16} />
                </button>
              </h2>
            )}
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">{t.memberSince} {joinDate}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${badgeColor}`}>
               {React.createElement(badgeIcon, { size: 14 })}
               {badge}
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
         
         {/* Account Connection Section */}
         <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 px-1">{t.connectAccounts}</h3>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                     <GoogleIcon />
                  </div>
                  <div>
                     <p className="font-bold text-sm text-slate-800 dark:text-slate-100">Google</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">
                       {isGoogleConnected ? t.googleConnected : t.connectGoogle}
                     </p>
                  </div>
               </div>
               <button 
                 onClick={handleGoogleConnect}
                 disabled={isConnecting}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                   isGoogleConnected 
                     ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400' 
                     : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                 }`}
               >
                 {isConnecting && <Loader2 size={12} className="animate-spin" />}
                 {isConnecting 
                    ? t.googleLoading 
                    : isGoogleConnected 
                        ? t.disconnect 
                        : t.connectGoogle
                 }
               </button>
            </div>
            {!scriptLoaded && !isGoogleConnected && (
                <div className="flex items-center gap-2 mt-2 px-2 text-amber-500 text-[10px]">
                    <AlertCircle size={10} />
                    <span>{t.scriptError}</span>
                </div>
            )}
         </div>

         {/* Stats Grid */}
         <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 px-1 flex items-center gap-2">
               <BarChart3 size={18} /> {t.stats}
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {/* Hifz Card */}
               <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                     <Book size={20} />
                  </div>
                  <div>
                     <span className="block text-2xl font-bold text-slate-800 dark:text-slate-100">{hifzCount}</span>
                     <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">{t.versesMemorized}</span>
                  </div>
               </div>

               {/* Hadiths Card */}
               <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                     <Bookmark size={20} />
                  </div>
                  <div>
                     <span className="block text-2xl font-bold text-slate-800 dark:text-slate-100">{hadithCount}</span>
                     <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">{t.savedHadiths}</span>
                  </div>
               </div>

               {/* Prayer Streak Card (Full Width) */}
               <div className="col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-2xl text-white shadow-lg shadow-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Activity size={24} />
                     </div>
                     <div>
                        <span className="block text-3xl font-bold">{prayerStreak}</span>
                        <span className="text-xs text-emerald-100 font-medium uppercase tracking-wider">{t.prayerStreak}</span>
                     </div>
                  </div>
                  <div className="h-10 w-10">
                     <Award size={40} className="text-white/20" />
                  </div>
               </div>
            </div>
         </div>

         {/* Achievements List */}
         <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 px-1">{t.achievements}</h3>
            <div className="space-y-3">
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 opacity-100">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <User size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.novice}</h4>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500 w-full"></div>
                     </div>
                  </div>
               </div>
               
               <div className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 ${totalScore > 50 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                     <Book size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.seeker}</h4>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all" style={{ width: `${Math.min(100, (totalScore / 50) * 100)}%` }}></div>
                     </div>
                  </div>
               </div>

               <div className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 ${totalScore > 200 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                     <Award size={20} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.devoted}</h4>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, (totalScore / 200) * 100)}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Simple check icon component helper
const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default UserProfile;
