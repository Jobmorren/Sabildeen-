
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Heart, Share2 } from 'lucide-react';

interface StoryItem {
  id: string;
  type: 'verse' | 'hadith' | 'quote';
  content: {
    arabic?: string;
    text: string;
    reference: string;
  };
  background: string; // CSS classes for gradient/image
  duration?: number; // seconds
}

interface StoryGroup {
  id: string;
  title: string;
  avatarColor: string;
  viewed: boolean;
  items: StoryItem[];
}

interface StoriesFeatureProps {
  language?: string;
}

// Mock Data Generators for "Daily" content
const GET_STORIES = (lang: string): StoryGroup[] => {
  const t = {
    verse: lang === 'fr' ? 'Verset du Jour' : 'Verse of the Day',
    hadith: lang === 'fr' ? 'Hadith du Jour' : 'Hadith of the Day',
    dhikr: lang === 'fr' ? 'Rappel' : 'Reminder',
  };

  return [
    {
      id: 'daily_verse',
      title: t.verse,
      avatarColor: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      viewed: false,
      items: [
        {
          id: 'v1',
          type: 'verse',
          content: {
            arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
            text: lang === 'fr' ? "A côté de la difficulté est, certes, une facilité !" : "For indeed, with hardship [will be] ease.",
            reference: "Surah Ash-Sharh 94:5"
          },
          background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
          duration: 7
        },
        {
          id: 'v2',
          type: 'verse',
          content: {
            arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
            text: lang === 'fr' ? "Et dis : 'Ô mon Seigneur, accrois mes connaissances !'" : "And say, 'My Lord, increase me in knowledge.'",
            reference: "Surah Taha 20:114"
          },
          background: "bg-gradient-to-bl from-indigo-900 via-blue-800 to-indigo-900",
          duration: 6
        }
      ]
    },
    {
      id: 'daily_hadith',
      title: t.hadith,
      avatarColor: 'bg-gradient-to-br from-amber-400 to-orange-600',
      viewed: false,
      items: [
        {
          id: 'h1',
          type: 'hadith',
          content: {
            arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
            text: lang === 'fr' ? "Aucun de vous ne sera (vraiment) croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même." : "None of you truly believes until he loves for his brother what he loves for himself.",
            reference: "Bukhari & Muslim"
          },
          background: "bg-gradient-to-tr from-rose-900 via-red-800 to-orange-900",
          duration: 8
        }
      ]
    },
    {
      id: 'reminder',
      title: t.dhikr,
      avatarColor: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      viewed: false,
      items: [
        {
          id: 'r1',
          type: 'quote',
          content: {
            text: lang === 'fr' ? "La patience est une lumière." : "Patience is illumination.",
            reference: "Prophet Muhammad ﷺ"
          },
          background: "bg-gradient-to-b from-teal-800 to-emerald-900",
          duration: 5
        }
      ]
    }
  ];
};

const StoriesFeature: React.FC<StoriesFeatureProps> = ({ language = 'en' }) => {
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    setStories(GET_STORIES(language));
  }, [language]);

  // Handle Story Timer
  useEffect(() => {
    if (activeGroupIndex === null || isPaused) return;

    const currentGroup = stories[activeGroupIndex];
    const currentStory = currentGroup.items[activeStoryIndex];
    const duration = (currentStory.duration || 5) * 1000;
    const step = 50; // update every 50ms

    const tick = () => {
      setProgress(prev => {
        const newProgress = prev + (step / duration) * 100;
        if (newProgress >= 100) {
          handleNext();
          return 0;
        }
        return newProgress;
      });
    };

    const id = window.setInterval(tick, step);
    return () => window.clearInterval(id);
  }, [activeGroupIndex, activeStoryIndex, isPaused, stories]);

  const openStory = (index: number) => {
    setActiveGroupIndex(index);
    setActiveStoryIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveGroupIndex(null);
    setActiveStoryIndex(0);
    setProgress(0);
  };

  const handleNext = () => {
    if (activeGroupIndex === null) return;
    
    const currentGroup = stories[activeGroupIndex];
    
    if (activeStoryIndex < currentGroup.items.length - 1) {
      // Next story in same group
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Next group
      if (activeGroupIndex < stories.length - 1) {
        // Mark current as viewed
        const newStories = [...stories];
        newStories[activeGroupIndex].viewed = true;
        setStories(newStories);
        
        setActiveGroupIndex(prev => (prev !== null ? prev + 1 : null));
        setActiveStoryIndex(0);
        setProgress(0);
      } else {
        // Close
        const newStories = [...stories];
        newStories[activeGroupIndex].viewed = true;
        setStories(newStories);
        closeStory();
      }
    }
  };

  const handlePrev = () => {
    if (activeGroupIndex === null) return;

    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
    } else {
      if (activeGroupIndex > 0) {
        setActiveGroupIndex(prev => (prev !== null ? prev - 1 : null));
        // Go to last story of previous group
        const prevGroup = stories[activeGroupIndex - 1];
        setActiveStoryIndex(prevGroup.items.length - 1);
        setProgress(0);
      } else {
        // Start of first story, reset progress
        setProgress(0);
      }
    }
  };

  const activeGroup = activeGroupIndex !== null ? stories[activeGroupIndex] : null;
  const activeStory = activeGroup ? activeGroup.items[activeStoryIndex] : null;

  return (
    <>
      {/* Dashboard Story Bar (WhatsApp Style) */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
        {stories.map((group, idx) => (
          <button 
            key={group.id}
            onClick={() => openStory(idx)}
            className="flex flex-col items-center gap-2 min-w-[72px] group"
          >
            <div className={`w-[72px] h-[72px] rounded-full p-[3px] ${group.viewed ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'}`}>
              <div className={`w-full h-full rounded-full border-[3px] border-white dark:border-slate-950 flex items-center justify-center ${group.avatarColor} shadow-sm overflow-hidden relative`}>
                 {/* Preview Content inside bubble */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                 <span className="text-[10px] text-white font-bold uppercase tracking-widest relative z-10">{group.id.slice(0,1)}</span>
              </div>
            </div>
            <span className={`text-xs font-medium truncate w-full text-center ${group.viewed ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
              {group.title}
            </span>
          </button>
        ))}
      </div>

      {/* Full Screen Story Viewer */}
      {activeGroup && activeStory && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in touch-none">
          
          {/* Background Layer with patterns/gradients */}
          <div className={`absolute inset-0 ${activeStory.background} transition-colors duration-700`}>
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
             {/* Decorative Islamic Pattern SVG Overlay */}
             <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] animate-pulse-slow">
                   <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
                   <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="white" strokeWidth="0.5" fill="none" />
                </svg>
             </div>
          </div>

          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-4 safe-area-top">
            {activeGroup.items.map((item, idx) => (
              <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all ease-linear"
                  style={{ 
                    width: idx < activeStoryIndex ? '100%' : idx === activeStoryIndex ? `${progress}%` : '0%',
                    transitionDuration: idx === activeStoryIndex ? '50ms' : '0ms'
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Header Controls */}
          <div className="absolute top-8 left-0 right-0 z-20 flex justify-between items-center px-4 py-2 mt-4">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${activeGroup.avatarColor} border border-white/20`}></div>
                <div>
                   <p className="text-white font-bold text-sm shadow-sm">{activeGroup.title}</p>
                   <p className="text-white/60 text-xs">Now</p>
                </div>
             </div>
             <button 
                onClick={closeStory}
                className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
             >
                <X size={20} />
             </button>
          </div>

          {/* Touch Zones */}
          <div className="absolute inset-0 z-10 flex">
             <div 
                className="w-1/3 h-full" 
                onClick={handlePrev}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
             ></div>
             <div 
                className="w-2/3 h-full" 
                onClick={handleNext}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
             ></div>
          </div>

          {/* Story Content */}
          <div className="relative z-0 flex-1 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
             
             {activeStory.content.arabic && (
                <div className="mb-8">
                   <p className="font-arabic text-3xl md:text-4xl text-white leading-[2.5] drop-shadow-lg" dir="rtl">
                      {activeStory.content.arabic}
                   </p>
                </div>
             )}

             <div className="bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl max-w-sm">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
                   "{activeStory.content.text}"
                </p>
             </div>

             <div className="mt-8 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider">
                   {activeStory.content.reference}
                </p>
             </div>

          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-10 flex justify-center gap-6 safe-area-bottom">
             {/* Pause Indicator if needed */}
             {isPaused && (
                <div className="absolute bottom-24 bg-black/50 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm">
                   Paused
                </div>
             )}
          </div>

        </div>
      )}
    </>
  );
};

export default StoriesFeature;
