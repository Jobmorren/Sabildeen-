
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Ayah {
  number: number;
  audio: string;
  arabic: string;
  translation: string;
}

interface AudioContextType {
  isPlaying: boolean;
  currentSurah: { name: string; number: number } | null;
  currentReciter: string | null;
  currentAyahIndex: number;
  playlist: Ayah[];
  progress: number;
  isBuffering: boolean;
  surahEnded: boolean; // New flag
  playbackRate: number;
  playSurah: (playlist: Ayah[], surahInfo: { name: string; number: number }, reciterName: string, startIndex?: number) => void;
  togglePlay: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seek: (index: number) => void;
  seekTime: (seconds: number) => void;
  changePlaybackRate: (rate: number) => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playlist, setPlaylist] = useState<Ayah[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [currentSurah, setCurrentSurah] = useState<{ name: string; number: number } | null>(null);
  const [currentReciter, setCurrentReciter] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [surahEnded, setSurahEnded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Element (Once)
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle Event Listeners (Re-bind when playlist changes to avoid stale closures)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentAyahIndex(prev => {
        if (prev < playlist.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false); // End of Surah playback
          setSurahEnded(true); // Signal that surah finished naturally
          return 0;
        }
      });
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = (e: any) => {
        // Ignore AbortError from user interruptions
        if (e && e.target && e.target.error && e.target.error.code !== 20) { // 20 is Abort
             console.error("Audio Error", e);
             setIsBuffering(false);
             setIsPlaying(false);
        }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
    };
  }, [playlist]); 

  // Sync Audio State & Source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playlist.length === 0) return;

    const ayah = playlist[currentAyahIndex];
    if (ayah) {
        // Guard: Check if audio source exists
        if (!ayah.audio) {
            if (isPlaying) setIsPlaying(false);
            return;
        }

        // If source changed, update it
        if (audio.src !== ayah.audio) {
            audio.src = ayah.audio;
            audio.playbackRate = playbackRate;
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        // Ignore AbortError (interrupted by pause) and NotSupportedError (empty source)
                        if (e.name !== 'AbortError' && e.name !== 'NotSupportedError') {
                            console.error("Play error:", e);
                        }
                    });
                }
            }
        } else {
            // Source same, check play/pause state mismatch
            if (isPlaying && audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (e.name !== 'AbortError' && e.name !== 'NotSupportedError') {
                            console.error("Resume error:", e);
                        }
                    });
                }
            } else if (!isPlaying && !audio.paused) {
                audio.pause();
            }
        }
    }
    
    // Update MediaSession (Lock Screen Controls)
    if ('mediaSession' in navigator && currentSurah) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Surah ${currentSurah.name}`,
        artist: currentReciter || 'Quran Recitation',
        album: `Ayah ${ayah?.number}`,
        artwork: [
          { src: 'https://raw.githubusercontent.com/google-fonts/noto-emoji/main/png/512/emoji_u1f54c.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevAyah());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextAyah());
    }

  }, [currentAyahIndex, playlist, isPlaying, currentSurah, currentReciter]);

  const playSurah = (newPlaylist: Ayah[], surahInfo: { name: string; number: number }, reciterName: string, startIndex = 0) => {
    setSurahEnded(false); // Reset the flag when starting a new surah
    setPlaylist(newPlaylist);
    setCurrentSurah(surahInfo);
    setCurrentReciter(reciterName);
    setCurrentAyahIndex(startIndex);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const nextAyah = () => {
    setCurrentAyahIndex(prev => {
      if (prev < playlist.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        setSurahEnded(true); // Also trigger if user clicks next on last ayah
        return 0;
      }
    });
  };

  const prevAyah = () => {
    setCurrentAyahIndex(prev => (prev > 0 ? prev - 1 : 0));
  };

  const seek = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
    }
  };

  const seekTime = (seconds: number) => {
    if (audioRef.current) {
      // Calculate new time and bound it between 0 and duration
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration || 0));
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setSurahEnded(false);
    setPlaylist([]);
    setCurrentSurah(null);
    if (audioRef.current) {
      audioRef.current.src = "";
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentSurah,
      currentReciter,
      currentAyahIndex,
      playlist,
      progress,
      isBuffering,
      surahEnded,
      playbackRate,
      playSurah,
      togglePlay,
      nextAyah,
      prevAyah,
      seek,
      seekTime,
      changePlaybackRate,
      closePlayer
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
