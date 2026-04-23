
import React, { useState, useEffect } from 'react';
import { RotateCcw, Compass, Navigation, ArrowUp, Smartphone } from 'lucide-react';

interface QiblaFinderProps {
  location: { lat: number; lng: number } | null;
  onBack: () => void;
  language?: string;
}

const TRANSLATIONS = {
  en: { title: "Qibla Finder", locNeeded: "Location Needed", enableLoc: "Please enable location services.", goBack: "Go Back", north: "North", facingQibla: "You are facing Qibla", rotatePhone: "Rotate your phone", enableCompass: "Enable Compass", notSupported: "Compass not supported.", qiblaAt: "Qibla is at" },
  fr: { title: "Boussole Qibla", locNeeded: "Localisation requise", enableLoc: "Activez la localisation.", goBack: "Retour", north: "Nord", facingQibla: "Vous êtes face à la Qibla", rotatePhone: "Tournez votre téléphone", enableCompass: "Activer boussole", notSupported: "Non supporté.", qiblaAt: "Qibla à" },
  es: { title: "Brújula Qibla", locNeeded: "Ubicación requerida", enableLoc: "Activa la ubicación.", goBack: "Volver", north: "Norte", facingQibla: "Miras a la Qibla", rotatePhone: "Gira tu teléfono", enableCompass: "Activar brújula", notSupported: "No soportado.", qiblaAt: "Qibla en" },
  wo: { title: "Jubluway", locNeeded: "Xam barab", enableLoc: "Takkal GPS bi.", goBack: "Dellu", north: "Bëj-Gànnaar", facingQibla: "Jublu nga Qibla", rotatePhone: "Wëndéélal telefon bi", enableCompass: "Takk boussole", notSupported: "Baxul ci bi telefon.", qiblaAt: "Qibla mu ngi ci" },
  ar: { title: "القبلة", locNeeded: "الموقع مطلوب", enableLoc: "يرجى تفعيل الموقع.", goBack: "رجوع", north: "شمال", facingQibla: "أنت تواجه القبلة", rotatePhone: "أدر هاتفك", enableCompass: "تفعيل البوصلة", notSupported: "غير مدعوم.", qiblaAt: "القبلة عند" }
};

const QiblaFinder: React.FC<QiblaFinderProps> = ({ location, onBack, language = 'en' }) => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    if (location) {
      const { lat, lng } = location;
      const KAABA_LAT = 21.422487;
      const KAABA_LNG = 39.826206;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      const phi = toRad(lat);
      const lambda = toRad(lng);
      const phiK = toRad(KAABA_LAT);
      const lambdaK = toRad(KAABA_LNG);

      const y = Math.sin(lambdaK - lambda);
      const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
      
      let qibla = toDeg(Math.atan2(y, x));
      qibla = (qibla + 360) % 360;
      setQiblaBearing(qibla);
    }
  }, [location]);

  useEffect(() => {
    // @ts-ignore
    const isIOSCheck = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
    setIsIOS(isIOSCheck);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compass = 0;
      // @ts-ignore
      if (e.webkitCompassHeading) {
        // @ts-ignore
        compass = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        compass = Math.abs(e.alpha - 360);
      }
      setHeading(compass);
    };

    if (!isIOSCheck) {
      if ('ondeviceorientationabsolute' in window) {
         (window as any).addEventListener('deviceorientationabsolute', handleOrientation as any, true);
      } else if ('ondeviceorientation' in window) {
         (window as any).addEventListener('deviceorientation', handleOrientation, true);
      } else {
         setIsSupported(false);
      }
      setPermissionGranted(true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if ('ondeviceorientationabsolute' in window) {
        (window as any).removeEventListener('deviceorientationabsolute', handleOrientation as any);
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      // @ts-ignore
      const response = await DeviceOrientationEvent.requestPermission();
      if (response === 'granted') {
        setPermissionGranted(true);
        // @ts-ignore
        window.addEventListener('deviceorientation', (e) => {
           // @ts-ignore
           setHeading(e.webkitCompassHeading || 0);
        }, true);
      } else {
        alert('Permission denied');
      }
    } catch (err) {
      console.error(err);
      alert('Error requesting permission');
    }
  };

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
          <Navigation size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.locNeeded}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t.enableLoc}</p>
        <button onClick={onBack} className="mt-6 text-emerald-600 dark:text-emerald-400 font-medium hover:underline">{t.goBack}</button>
      </div>
    );
  }

  const compassRotation = -heading;
  const isAligned = Math.abs(heading - qiblaBearing) < 5 || Math.abs((heading - 360) - qiblaBearing) < 5;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-fade-in relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <RotateCcw size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative pb-24">
        <div className="text-center mb-10 z-10">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
               <Compass size={16} className="text-emerald-500" />
               <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{Math.round(qiblaBearing)}° {t.north}</span>
            </div>
            {isAligned ? (
              <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">{t.facingQibla}</h2>
            ) : (
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t.rotatePhone}</h2>
            )}
        </div>

        <div className="relative w-72 h-72 md:w-80 md:h-80 mb-8 flex items-center justify-center z-0">
            {isIOS && !permissionGranted && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full">
                  <button onClick={requestPermission} className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform">{t.enableCompass}</button>
               </div>
            )}

            {!isSupported && !isIOS && (
               <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-6 text-center">
                  <Smartphone size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.notSupported}</p>
                  <p className="text-xs text-slate-400 mt-1">{t.qiblaAt} {Math.round(qiblaBearing)}°.</p>
               </div>
            )}

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-300 dark:text-slate-600">
               <ArrowUp size={24} />
            </div>

            <div 
              className="w-full h-full rounded-full border-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl relative transition-all duration-300 ease-out"
              style={{ transform: `rotate(${compassRotation}deg)` }}
            >
               <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="text-red-500 font-bold text-lg">N</span>
                  <div className="w-1 h-2 bg-red-500 rounded-full"></div>
               </div>
               
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 dark:bg-slate-300 rounded-full z-20 border-2 border-slate-100 dark:border-slate-600"></div>

               <div 
                 className="absolute top-1/2 left-1/2 w-1 h-1/2 origin-bottom z-10"
                 style={{ transform: `translate(-50%, -100%) rotate(${qiblaBearing}deg)` }}
               >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                     <div className={`w-8 h-8 bg-black rounded-md border border-amber-400 flex items-center justify-center shadow-lg ${isAligned ? 'ring-4 ring-emerald-400/50' : ''}`}>
                        <div className="w-full h-[1px] bg-amber-400 mt-[-4px]"></div>
                     </div>
                     <div className={`w-1 h-16 mt-2 rounded-full ${isAligned ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;
