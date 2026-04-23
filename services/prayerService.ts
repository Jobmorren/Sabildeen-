import { PrayerTimes, HijriDate } from "../types";
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan';

const adjustTime = (time: string, minutes: number): string => {
  const cleanTime = time.split(' ')[0];
  const [h, m] = cleanTime.split(':').map(Number);
  
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + minutes);
  
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const getPrayerTimes = async (
  lat: number, 
  lng: number, 
  methodValue: number = 2, 
  offsets: Record<string, number> = {}
): Promise<{ timings: PrayerTimes, date: HijriDate } | null> => {
  try {
    const date = new Date();
    const coordinates = new Coordinates(lat, lng);
    
    let params = CalculationMethod.MuslimWorldLeague();
    if (methodValue === 3) params = CalculationMethod.Egyptian();
    if (methodValue === 1) params = CalculationMethod.Karachi();
    if (methodValue === 4) params = CalculationMethod.UmmAlQura();
    if (methodValue === 5) params = CalculationMethod.Dubai();
    if (methodValue === 12) params = CalculationMethod.NorthAmerica();
    
    params.madhab = 'shafi'; // Default

    const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

    const baseTimings: PrayerTimes = {
      Fajr: formatTime(prayerTimes.fajr),
      Sunrise: formatTime(prayerTimes.sunrise),
      Dhuhr: formatTime(prayerTimes.dhuhr),
      Asr: formatTime(prayerTimes.asr),
      Maghrib: formatTime(prayerTimes.maghrib),
      Isha: formatTime(prayerTimes.isha),
    };

    // Apply individual offsets
    for (const prayer in offsets) {
      if (baseTimings[prayer]) {
        baseTimings[prayer] = adjustTime(baseTimings[prayer], offsets[prayer]);
      }
    }

    // Since we are generating offline, we need a generic Hijri date structure
    // For full offline hijri calendar, it's complex, so we format standard one.
    const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const hijriString = formatter.format(date); // e.g. "Ramadan 15, 1445 AH"

    return {
      timings: baseTimings,
      date: {
        date: hijriString,
        format: "DD-MM-YYYY",
        day: date.getDate().toString(),
        weekday: { en: date.toLocaleDateString('en-US', {weekday:'long'}), ar: '' },
        month: { number: 1, en: hijriString.split(' ')[0], ar: '' },
        year: hijriString.split(' ')[2] || "1445",
        designation: { abbreviated: "AH", expanded: "Anno Hegirae" }
      }
    };
  } catch (error) {
    console.error("Error calculating offline prayer times:", error);
    return null;
  }
};