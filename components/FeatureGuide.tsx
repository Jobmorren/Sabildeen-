
import React from 'react';
import { ArrowLeft, BookOpen, Moon, Compass, MessageCircle, MapPin, GraduationCap, Clock, Hand, Heart, Sparkles, Search } from 'lucide-react';

interface FeatureGuideProps {
  onBack: () => void;
  language?: string;
}

const TRANSLATIONS = {
  en: {
    title: "App Guide",
    subtitle: "Discover all features",
    howTo: "How to use:",
    features: [
      {
        title: "Prayer Times",
        desc: "Accurate timings based on your location.",
        how: "Check the home dashboard for the next prayer. Tap 'Prayer Catalog' to see the full monthly schedule.",
        icon: Clock,
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      },
      {
        title: "Quran Reader",
        desc: "Read, listen, and memorize the Holy Quran.",
        how: "Select a Surah to read. Tap a verse to play audio.",
        icon: BookOpen,
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
      },
      {
        title: "Qibla Finder",
        desc: "Locate the direction of the Kaaba.",
        how: "Go to Qibla tab. Rotate your phone until the compass aligns with the Kaaba icon. Ensure GPS is on.",
        icon: Compass,
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      },
      {
        title: "AI Companion",
        desc: "Ask Islamic questions to Sabildeen AI.",
        how: "Go to the Chat tab. Type your question about history, fiqh basics, or spirituality to get an instant answer.",
        icon: MessageCircle,
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
      },
      {
        title: "Mosque Finder",
        desc: "Find nearby places of worship.",
        how: "Tap 'Mosques' on the home screen. The app will list the closest mosques with ratings.",
        icon: MapPin,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      },
      {
        title: "Academy & Hifz",
        desc: "Learn religion and track memorization.",
        how: "Use the Academy tab to access lessons. Use the Hifz Tracker to mark memorized verses.",
        icon: GraduationCap,
        color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
      },
      {
        title: "Tasbih Counter",
        desc: "Digital Dhikr counter.",
        how: "Tap the large circle to count. You can set custom targets or reset the counter anytime.",
        icon: Hand,
        color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
      },
      {
        title: "Halal Scanner",
        desc: "Check ingredients via camera.",
        how: "Open the scanner, point your camera at an ingredients list. AI will analyze if it's Halal or doubtful.",
        icon: Search,
        color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400"
      }
    ]
  },
  fr: {
    title: "Guide de l'App",
    subtitle: "Découvrez toutes les fonctionnalités",
    howTo: "Comment utiliser :",
    features: [
      {
        title: "Horaires de Prière",
        desc: "Horaires précis basés sur votre position.",
        how: "Consultez l'accueil pour la prochaine prière. Appuyez sur le widget pour voir le calendrier mensuel.",
        icon: Clock,
        color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      },
      {
        title: "Lecture du Coran",
        desc: "Lisez, écoutez et mémorisez le Saint Coran.",
        how: "Choisissez une Sourate. Appuyez sur un verset pour l'audio.",
        icon: BookOpen,
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
      },
      {
        title: "Boussole Qibla",
        desc: "Trouvez la direction de la Kaaba.",
        how: "Allez dans l'onglet Qibla. Tournez votre téléphone jusqu'à ce que la boussole s'aligne. Activez le GPS.",
        icon: Compass,
        color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      },
      {
        title: "Compagnon IA",
        desc: "Posez vos questions à l'IA Sabildeen.",
        how: "Allez dans l'onglet Chat. Écrivez votre question sur l'histoire ou la spiritualité pour une réponse instantanée.",
        icon: MessageCircle,
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
      },
      {
        title: "Trouver une Mosquée",
        desc: "Localisez les lieux de culte proches.",
        how: "Appuyez sur 'Mosquées' à l'accueil. L'application listera les mosquées les plus proches.",
        icon: MapPin,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      },
      {
        title: "Académie & Hifz",
        desc: "Apprenez la religion et suivez votre mémorisation.",
        how: "Utilisez l'Académie pour les leçons. Le Hifz Tracker permet de cocher les versets appris.",
        icon: GraduationCap,
        color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
      },
      {
        title: "Compteur Tasbih",
        desc: "Chapelet numérique pour le Dhikr.",
        how: "Appuyez sur le grand cercle pour compter. Définissez des objectifs ou réinitialisez à tout moment.",
        icon: Hand,
        color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
      },
      {
        title: "Scanner Halal",
        desc: "Vérifiez les ingrédients par caméra.",
        how: "Ouvrez le scanner (via profil ou accueil), pointez la liste d'ingrédients. L'IA analyse le statut Halal.",
        icon: Search,
        color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400"
      }
    ]
  }
};

const FeatureGuide: React.FC<FeatureGuideProps> = ({ onBack, language = 'en' }) => {
  // Default to English if language not found, or use provided language
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
      {/* Header */}
      <div className="p-6 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-20 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="grid gap-6">
          {t.features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{feature.desc}</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">{t.howTo}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.how}</p>
                    </div>
                  </div>
                </div>
                {/* Decorative background blob */}
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/10 transition-colors z-0"></div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
              <Sparkles size={14} /> Sabildeen v1.3
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGuide;
