
import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, SkipForward, SkipBack, X, Disc, ChevronUp, ChevronDown, RotateCcw, RotateCw, Gauge, BookOpen } from 'lucide-react';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 2.5];

interface MiniPlayerProps {
  onReadFullSurah?: (surahNumber: number) => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onReadFullSurah }) => {
  const { 
    isPlaying, currentSurah, currentReciter, playlist, currentAyahIndex, 
    togglePlay, nextAyah, prevAyah, closePlayer, progress, seekTime, 
    playbackRate, changePlaybackRate, seek
  } = useAudio();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const activeAyahRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentAyahIndex, isExpanded]);

  if (!currentSurah || playlist.length === 0) return null;

  const currentAyah = playlist[currentAyahIndex];

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none animate-fade-in">
        {/* Backdrop (clickable to close) */}
        <div 
          className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm" 
          onClick={() => { setIsExpanded(false); setShowSpeedMenu(false); }} 
        />
        
        {/* Expanded Player Panel */}
        <div className="relative w-full bg-slate-900 rounded-t-3xl p-6 pointer-events-auto shadow-2xl border-t border-slate-700/50 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
             <button onClick={() => { setIsExpanded(false); setShowSpeedMenu(false); }} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
               <ChevronDown size={28} />
             </button>
             <div className="flex-1 px-4 text-center">
               <h3 className="font-bold text-white text-lg flex items-center justify-center gap-2">
                 {currentSurah.name}
                 {onReadFullSurah && (
                   <button 
                     onClick={() => {
                       setIsExpanded(false);
                       setShowSpeedMenu(false);
                       onReadFullSurah(currentSurah.number);
                     }}
                     className="w-7 h-7 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                     title="Read full surah in catalog"
                   >
                     <BookOpen size={14} />
                   </button>
                 )}
               </h3>
               <p className="text-sm text-emerald-400">{currentReciter}</p>
             </div>
             <button onClick={() => { setIsExpanded(false); setShowSpeedMenu(false); closePlayer(); }} className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors">
               <X size={24} />
             </button>
          </div>

          {/* Full Surah Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto min-h-0 mb-4 px-2 space-y-8 pb-10 scrollbar-hide">
             {playlist.map((ayah, index) => {
               const isActive = index === currentAyahIndex;
               return (
                 <div 
                   key={index} 
                   ref={isActive ? activeAyahRef : null}
                   onClick={() => seek(index)}
                   className={`transition-all duration-300 p-4 rounded-xl cursor-pointer ${isActive ? 'bg-slate-800/80 border border-emerald-500/30' : 'hover:bg-slate-800/40 opacity-60 hover:opacity-100'}`}
                 >
                   {ayah.arabic && (
                     <p className={`text-2xl md:text-3xl text-right leading-[2.5] font-arabic dir-rtl mb-4 ${isActive ? 'text-emerald-400' : 'text-slate-200'}`} style={{ direction: 'rtl' }}>
                       {ayah.arabic}
                       <span className={`inline-flex items-center justify-center ml-2 w-8 h-8 rounded-full text-sm font-sans ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                         {ayah.number}
                       </span>
                     </p>
                   )}
                   {ayah.translation && (
                     <p className={`text-[15px] leading-relaxed ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                       {ayah.translation}
                     </p>
                   )}
                 </div>
               );
             })}
          </div>

          {/* Progress Bar & Speed */}
          <div className="w-full relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                Ayah {currentAyah.number} / {playlist.length}
              </span>

              <div className="relative">
                <button 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md transition-colors ${showSpeedMenu ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'}`}
                >
                  <Gauge size={14} />
                  {playbackRate}x
                </button>
                
                {/* Speed Menu */}
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fade-in z-10 flex flex-col">
                    {SPEED_OPTIONS.map(rate => (
                      <button 
                        key={rate}
                        onClick={() => { changePlaybackRate(rate); setShowSpeedMenu(false); }}
                        className={`px-4 py-2 text-sm text-left hover:bg-slate-700 transition-colors ${playbackRate === rate ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-300'}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
               <div 
                  className="h-full bg-emerald-500 transition-all duration-300 ease-linear rounded-full flex justify-end" 
                  style={{ width: `${progress}%` }} 
               >
                 <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
               </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pb-4">
             <button 
               onClick={() => seekTime(-10)}
               className="p-2 text-slate-400 hover:text-white transition-colors flex flex-col items-center gap-1"
             >
               <RotateCcw size={22} />
               <span className="text-[10px] font-bold">10</span>
             </button>

             <button 
                onClick={prevAyah}
                className="p-3 text-slate-300 hover:text-white transition-colors"
                disabled={currentAyahIndex === 0}
             >
                <SkipBack size={26} fill="currentColor" className={currentAyahIndex === 0 ? "opacity-50" : ""} />
             </button>
             
             <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 transform hover:scale-105 active:scale-95 mx-2"
             >
                {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
             </button>
             
             <button 
                onClick={nextAyah}
                className="p-3 text-slate-300 hover:text-white transition-colors"
                disabled={currentAyahIndex === playlist.length - 1}
             >
                <SkipForward size={26} fill="currentColor" className={currentAyahIndex === playlist.length - 1 ? "opacity-50" : ""} />
             </button>

             <button 
               onClick={() => seekTime(10)}
               className="p-2 text-slate-400 hover:text-white transition-colors flex flex-col items-center gap-1"
             >
               <RotateCw size={22} />
               <span className="text-[10px] font-bold">10</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact Floating Mode
  return (
    <div className="fixed bottom-[80px] left-0 right-0 px-4 z-40 animate-fade-in-up transition-transform">
      <div 
        onClick={() => setIsExpanded(true)}
        className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-700/50 flex flex-col gap-2 text-white max-w-sm mx-auto cursor-pointer hover:bg-slate-800 transition-colors"
      >
        {/* Dynamic Ayah Preview (if Arabic is available) */}
        {currentAyah?.arabic && (
            <div className="px-1 pt-1 pb-2 border-b border-slate-700/50">
               <p className="text-right text-[15px] font-arabic leading-loose text-slate-200 line-clamp-2" style={{ direction: 'rtl' }}>
                 {currentAyah.arabic}
               </p>
            </div>
        )}

        {/* Audio Controls row */}
        <div className="flex items-center gap-3 pt-1">
          {/* Animated Icon */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <Disc size={20} className="text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate flex items-center gap-2">
               {currentSurah.name}
               <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                  Ayah {currentAyah.number}
               </span>
            </h4>
            <p className="text-xs text-slate-400 truncate">{currentReciter}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-9 h-9 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-600 transition-colors"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); closePlayer(); }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MiniPlayer;
