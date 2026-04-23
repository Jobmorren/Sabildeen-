import React, { useRef, useCallback } from 'react';

export const useLongPressTTS = (text: string, language: string = 'en') => {
  const timerRef = useRef<any>(null);

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // We do not preventDefault here to allow scrolling to start if the user moves immediately
    timerRef.current = setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        
        // Clean text (remove simple markdown like asterisks)
        const cleanText = text.replace(/[\*\_\#]/g, ''); 
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        const langMap: Record<string, string> = {
          'en': 'en-US',
          'fr': 'fr-FR',
          'es': 'es-ES',
          'ar': 'ar-SA',
          'wo': 'fr-FR' // Fallback for Wolof to French voice usually
        };
        
        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 0.9; // Slightly slower for better clarity
        
        window.speechSynthesis.speak(utterance);
        
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }, 600); // 600ms threshold for long press
  }, [text, language]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchEnd: stop,
    onTouchMove: stop // Cancel if user scrolls
  };
};