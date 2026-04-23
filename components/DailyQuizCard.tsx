import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

const QUIZZES = [
  {
    question: {
      en: "Which Prophet is mentioned the most times in the Quran?",
      fr: "Quel Prophète est mentionné le plus de fois dans le Coran ?",
      es: "¿Qué Profeta se menciona más veces en el Corán?",
      wo: "Benn Yónnent bi ñu gën a tudd ci Alxuraan?"
    },
    options: {
      en: ["Muhammad (PBUH)", "Musa (AS)", "Isa (AS)", "Ibrahim (AS)"],
      fr: ["Muhammad (SAW)", "Moussa (AS)", "Aissa (AS)", "Ibrahim (AS)"],
      es: ["Mahoma (BPD)", "Moisés (AS)", "Jesús (AS)", "Abraham (AS)"],
      wo: ["Muhammad (PSL)", "Musa (AS)", "Isa (AS)", "Ibrahima (AS)"]
    },
    correctIndex: 1,
    explanation: {
      en: "Prophet Musa (AS) is mentioned 136 times. His story contains numerous lessons about faith, patience, and resisting tyranny.",
      fr: "Le prophète Moussa (AS) est mentionné 136 fois. Son histoire contient de nombreuses leçons sur la foi, la patience et la résistance à la tyrannie.",
      es: "El profeta Moisés (AS) es mencionado 136 veces. Su historia contiene numerosas lecciones sobre fe, paciencia y resistencia.",
      wo: "Yónnent bi Musa (AS) ñu ngi ko tudd 136 yoon. Nettaliibi am na njariñ yu bare ci gëm, muñ ak bañ njaqare."
    }
  },
  {
    question: {
      en: "What is the longest Surah in the Quran?",
      fr: "Quelle est la sourate la plus longue du Coran ?",
      es: "¿Cuál es la Sura más larga del Corán?",
      wo: "Benn saar bi gën a gudd ci Alxuraan?"
    },
    options: {
      en: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"],
      fr: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"],
      es: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"],
      wo: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"]
    },
    correctIndex: 2,
    explanation: {
      en: "Surah Al-Baqarah is the longest Surah, containing 286 verses (Ayahs).",
      fr: "La sourate Al-Baqarah est la plus longue, contenant 286 versets (Ayats).",
      es: "La Sura Al-Baqarah es la más larga, contiene 286 versículos (Ayahs).",
      wo: "Saar Al-Baqarah moo gën a gudd, am na 286 aayat."
    }
  },
  {
    question: {
      en: "Over how many years was the Quran revealed to Prophet Muhammad?",
      fr: "Sur combien d'années le Coran a-t-il été révélé au Prophète Muhammad ?",
      es: "¿A lo largo de cuántos años fue revelado el Corán al Profeta Muhammad?",
      wo: "Ciy ñaata at lañu wàcce Alxuraan ci Yónnent bi Muhammad (PSL)?"
    },
    options: {
      en: ["10 years", "23 years", "33 years", "40 years"],
      fr: ["10 ans", "23 ans", "33 ans", "40 ans"],
      es: ["10 años", "23 años", "33 años", "40 años"],
      wo: ["10 at", "23 at", "33 at", "40 at"]
    },
    correctIndex: 1,
    explanation: {
      en: "The Quran was revealed over a period of approximately 23 years, starting when the Prophet was 40 until his passing at 63.",
      fr: "Le Coran a été révélé sur une période d'environ 23 ans, depuis les 40 ans du Prophète jusqu'à son décès à 63 ans.",
      es: "El Corán fue revelado durante unos 23 años, empezando cuando el Profeta tenía 40 años.",
      wo: "Alxuraan wàcc na ci 23 at, tambali bi Yónnent bi am 40 at ba mu faatoo cig 63 at."
    }
  },
  {
    question: {
      en: "Which angel is responsible for bringing revelations to the Prophets?",
      fr: "Quel ange est chargé d'apporter les révélations aux Prophètes ?",
      es: "¿Qué ángel es responsable de traer las revelaciones a los Profetas?",
      wo: "Benn malaaka bi ñu denk wàcce xibaar yi ci Yónnent yi?"
    },
    options: {
      en: ["Mika'il", "Israfil", "Jibreel", "Azrael"],
      fr: ["Mika'il", "Israfil", "Jibril", "Azrael"],
      es: ["Mika'il", "Israfil", "Yibril", "Azrael"],
      wo: ["Mikayil", "Israfil", "Jibril", "Azrael"]
    },
    correctIndex: 2,
    explanation: {
      en: "Angel Jibreel (AS) is the archangel tasked with conveying Allah's words to all His messengers.",
      fr: "L'ange Jibril (AS) est l'archange chargé de transmettre les paroles d'Allah à tous Ses messagers.",
      es: "El ángel Jibril (AS) transmite las palabras de Allah a todos Sus mensajeros.",
      wo: "Malaaka Jibril (AS) mooy malaaka mi ñu yamle won wàcce kàddug Yàlla ci Yónnent yi."
    }
  },
  {
    question: {
      en: "Which companion had the title 'Sword of Allah' (Saifullah)?",
      fr: "Quel compagnon avait le titre 'L'Épée d'Allah' (Saifullah) ?",
      es: "¿Qué compañero tenía el título 'Espada de Allah' (Saifullah)?",
      wo: "Benn sahaba bi ñu tudd 'Jaasiy Yàlla' (Saifullah)?"
    },
    options: {
      en: ["Ali bin Abi Talib", "Umar bin Al-Khattab", "Khalid bin Walid", "Hamza bin Abdul-Muttalib"],
      fr: ["Ali bin Abi Talib", "Umar bin Al-Khattab", "Khalid ibn al-Walid", "Hamza ibn Abd al-Muttalib"],
      es: ["Ali bin Abi Talib", "Umar bin Al-Khattab", "Khalid bin Walid", "Hamza bin Abdul-Muttalib"],
      wo: ["Aali bin Abi Talib", "Umar bin Al-Xattab", "Xaalid bin Waliid", "Xamza bin Abdul-Muttalib"]
    },
    correctIndex: 2,
    explanation: {
      en: "Khalid bin Walid was given this title by the Prophet (PBUH) for his unmatched military brilliance and dedication.",
      fr: "Khalid ibn al-Walid a reçu ce titre du Prophète (SAW) pour son génie militaire et son dévouement.",
      es: "Khalid bin Walid recibió este título del Profeta (BPD) por su brillantez militar.",
      wo: "Xaalid bin Waliid la Yónnent bi (PSL) jox tur wi ndax xaralaam ci xare ak takku ci diine."
    }
  }
];

interface DailyQuizCardProps {
  language?: string;
}

const DailyQuizCard: React.FC<DailyQuizCardProps> = ({ language = 'en' }) => {
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Generate a consistent pseudo-random index based on the day of the year
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const idx = dayOfYear % QUIZZES.length;
    setQuizIndex(idx);
    
    // Check if the user already answered today's quiz
    const todayStr = today.toISOString().split('T')[0];
    const saved = localStorage.getItem(`quiz_${todayStr}`);
    if (saved !== null) {
       setSelectedOption(parseInt(saved, 10));
       setIsAnswered(true);
    }
  }, []);

  const quiz = QUIZZES[quizIndex];
  const langKey = (['en', 'fr', 'es', 'wo'].includes(language) ? language : 'en') as 'en'|'fr'|'es'|'wo';
  
  const question = quiz.question[langKey];
  const options = quiz.options[langKey];
  const explanation = quiz.explanation[langKey];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`quiz_${todayStr}`, idx.toString());
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100/50 to-transparent dark:from-violet-900/10 rounded-bl-[100px] -z-0"></div>
      
      <div className="relative z-10">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-[15px] leading-relaxed">
          {question}
        </h3>

        <div className="space-y-2">
          {options.map((opt, idx) => {
            let buttonClass = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
            
            if (!isAnswered) {
              buttonClass += "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20";
            } else {
              if (idx === quiz.correctIndex) {
                // Correct answer styling
                buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
              } else if (idx === selectedOption) {
                // Wrong selected answer styling
                buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
              } else {
                // Other unselected answers
                buttonClass += "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionClick(idx)}
                className={buttonClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {isAnswered && idx === quiz.correctIndex && <CheckCircle2 size={18} className="text-emerald-500" />}
                  {isAnswered && idx === selectedOption && idx !== quiz.correctIndex && <XCircle size={18} className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-5 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50 animate-fade-in">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-violet-800 dark:text-violet-300 text-sm mb-1">
                  {selectedOption === quiz.correctIndex 
                    ? (language === 'fr' ? 'Excellent !' : language === 'es' ? '¡Excelente!' : language === 'wo' ? 'Rafetna!' : 'Excellent!') 
                    : (language === 'fr' ? 'La bonne réponse était :' : language === 'es' ? 'La respuesta correcta era:' : language === 'wo' ? 'Tontub dëgg bi mooy:' : 'The correct answer was:')}
                </p>
                <p className="text-sm text-violet-700/90 dark:text-violet-300/80 leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuizCard;
