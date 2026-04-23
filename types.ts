
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface PlaceResult {
  title: string;
  uri: string;
  snippet?: string;
  rating?: number;
  userRatingCount?: number;
  type?: 'mosque';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DailyVerse {
  arabic: string;
  translation: string;
  transliteration?: string;
  reference: string;
  reflection: string;
}

export interface DailyHadith {
  arabic: string;
  translation: string;
  source: string;
  narrator: string;
  reflection: string;
  category: string;
}

export interface DailyStory {
  title: string;
  theme: string;
  story: string;
  quran: {
    arabic: string;
    translation: string;
    transliteration?: string;
    reference: string;
  };
  hadith: {
    arabic: string;
    translation: string;
    source: string;
  };
  lesson: string;
}

export interface HalalCheckResult {
  status: 'halal' | 'haram' | 'doubtful';
  reason: string;
  concerns: string[];
}

export interface HifzProgress {
  surahNumber: number;
  memorizedVerses: number[];
  totalVerses: number;
}

export interface ProphetStory {
  name: string;
  arabicName: string;
  summary: string;
  period: string;
  location: string;
  keyEvents: string[];
  miracles: string[];
  trials: string[];
  lessons: string[];
  quranicReferences: string[];
  keyVerse?: {
    arabic: string;
    translation: string;
    reference: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface Hadith {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades?: { grade: string; name: string }[];
  reference?: { book: number; hadith: number };
}

export interface SavedHadith {
  id: string;
  bookId: string;
  bookName: string;
  en: Hadith;
  ar?: Hadith;
  timestamp: number;
  lang?: string;
}
