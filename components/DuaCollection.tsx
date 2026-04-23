
import React, { useState } from 'react';
import { Search, ArrowLeft, Heart, Copy, Check, Sun, Moon, Plane, Shield, BookHeart, Sparkles, Coffee, Users, CloudRain, GraduationCap, Activity, Gift, Star, BookOpen } from 'lucide-react';

interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

interface DuaCollectionProps {
  onBack: () => void;
  language?: string;
}

const CATEGORIES = [
  { id: 'all', label_en: 'All', label_fr: 'Tout', icon: Sparkles },
  { id: 'prayer', label_en: 'Prayer (Salah)', label_fr: 'Prière (Salat)', icon: BookHeart },
  { id: 'morning_evening', label_en: 'Morning & Evening', label_fr: 'Matin & Soir', icon: Sun },
  { id: 'quranic', label_en: 'Quranic (Rabbana)', label_fr: 'Coraniques (Rabbana)', icon: BookOpen },
  { id: 'daily', label_en: 'Daily Life', label_fr: 'Vie Quotidienne', icon: Coffee },
  { id: 'emotions', label_en: 'Emotions & Tests', label_fr: 'Épreuves & Émotions', icon: CloudRain },
  { id: 'family', label_en: 'Family', label_fr: 'Famille', icon: Users },
  { id: 'ramadan', label_en: 'Fasting & Ramadan', label_fr: 'Jeûne & Ramadan', icon: Moon },
  { id: 'travel', label_en: 'Travel', label_fr: 'Voyage', icon: Plane },
  { id: 'forgiveness', label_en: 'Forgiveness', label_fr: 'Pardon', icon: Heart },
  { id: 'social', label_en: 'Social', label_fr: 'Social', icon: Gift },
];

const DUAS_DATA: Record<string, Dua[]> = {
  en: [
    // --- PRAYER (Salah) ---
    {
      id: 'pr1', category: 'prayer', title: 'Opening Dua (Istiftah)',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
      transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
      translation: "Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is no god other than You.",
      reference: "Abu Dawud"
    },
    {
      id: 'pr2', category: 'prayer', title: 'While Bowing (Ruku)',
      arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      transliteration: "Subhana Rabbiyal-Azim",
      translation: "Glory to my Lord the Exalted. (3 times)",
      reference: "Muslim"
    },
    {
      id: 'pr3', category: 'prayer', title: 'Rising from Ruku',
      arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
      transliteration: "Rabbana wa lakal-hamd, hamdan kathiran tayyiban mubarakan fih",
      translation: "Our Lord, to You be praise, much good and blessed praise.",
      reference: "Bukhari"
    },
    {
      id: 'pr4', category: 'prayer', title: 'In Prostration (Sujud)',
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
      transliteration: "Subhana Rabbiyal-A'la",
      translation: "Glory is to my Lord, the Most High. (3 times)",
      reference: "Muslim"
    },
    {
      id: 'pr5', category: 'prayer', title: 'Between Two Sujood',
      arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
      transliteration: "Rabbighfir li, Rabbighfir li",
      translation: "Lord, forgive me. Lord, forgive me.",
      reference: "Abu Dawud"
    },
    {
      id: 'pr6', category: 'prayer', title: 'Tashahhud (Full)',
      arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallah wa ash-hadu anna Muhammadan 'abduhu wa Rasuluh.",
      translation: "Greetings, prayers and all good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and on the righteous servants of Allah. I testify that there is no god but Allah, and I testify that Muhammad is His servant and Messenger.",
      reference: "Bukhari & Muslim"
    },
    {
      id: 'pr7', category: 'prayer', title: 'Salawat (Ibrahimiyyah)',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ...',
      transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid...",
      translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim; You are indeed Worthy of Praise, Full of Glory.",
      reference: "Bukhari"
    },
    {
      id: 'pr8', category: 'prayer', title: 'Dhikr After Prayer',
      arabic: 'أَسْتَغْفِرُ اللَّهَ (3)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      transliteration: "Astaghfirullah (3x). Allahumma antas-Salam wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
      translation: "I ask Allah for forgiveness (3 times). O Allah, You are Peace and from You is peace. Blessed are You, O Owner of Majesty and Honor.",
      reference: "Muslim"
    },

    // --- QURANIC (RABBANA) ---
    {
      id: 'q1', category: 'quranic', title: 'Good in Both Worlds',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
      translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
      reference: "Surah Al-Baqarah 2:201"
    },
    {
      id: 'q2', category: 'quranic', title: 'Forgiveness & Mercy',
      arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
      transliteration: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin",
      translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
      reference: "Surah Al-A'raf 7:23"
    },
    {
      id: 'q3', category: 'quranic', title: 'Steadfastness',
      arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
      transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah",
      translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.",
      reference: "Surah Ali 'Imran 3:8"
    },
    {
      id: 'q4', category: 'quranic', title: 'Acceptance',
      arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Rabbana taqabbal minna innaka antas-sami'ul-'alim",
      translation: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.",
      reference: "Surah Al-Baqarah 2:127"
    },
    {
      id: 'q5', category: 'quranic', title: 'Patience',
      arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
      translation: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
      reference: "Surah Al-Baqarah 2:250"
    },

    // --- RAMADAN & FASTING ---
    {
      id: 'ram1', category: 'ramadan', title: 'Breaking Fast (Iftar)',
      arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      transliteration: "Dhahabadh-dhama'u wabtallatil-'uruqu wa thabatal-ajru insha'Allah",
      translation: "The thirst is gone, the veins are moistened, and the reward is established, if Allah wills.",
      reference: "Abu Dawud"
    },
    {
      id: 'ram2', category: 'ramadan', title: 'Laylatul Qadr',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
      translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
      reference: "Tirmidhi"
    },
    {
      id: 'ram3', category: 'ramadan', title: 'Sighting the Crescent',
      arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ',
      transliteration: "Allahumma ahillahu 'alayna bil-amni wal-iman, was-salamati wal-Islam",
      translation: "O Allah, bring it to us with security and faith, safety and Islam.",
      reference: "Tirmidhi"
    },

    // --- EMOTIONS ---
    {
      id: 'em1', category: 'emotions', title: 'Anxiety & Sorrow',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ...',
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal...",
      translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness...",
      reference: "Bukhari"
    },
    {
      id: 'em2', category: 'emotions', title: 'Distress (Yunus)',
      arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
      translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      reference: "Surah Al-Anbya 21:87"
    },
    {
      id: 'em3', category: 'emotions', title: 'Settling Debt',
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      transliteration: "Allahummak-fini bihalalika 'an haramik, wa aghnini bifadlika 'amman siwak",
      translation: "O Allah, suffice me with Your lawful against Your prohibited, and make me independent of all those besides You.",
      reference: "Tirmidhi"
    },

    // --- FORGIVENESS ---
    {
      id: 'for1', category: 'forgiveness', title: 'General Forgiveness',
      arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ',
      transliteration: "Rabbighfir warham wa anta khairur-rahimin",
      translation: "My Lord, forgive and have mercy, and You are the best of the merciful.",
      reference: "Surah Al-Mu'minun 23:118"
    },
    {
      id: 'for2', category: 'forgiveness', title: 'Simple Istighfar',
      arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      transliteration: "Astaghfirullaha wa atubu ilayh",
      translation: "I seek forgiveness from Allah and repent to Him.",
      reference: "Bukhari"
    },
    {
      id: 'for3', category: 'forgiveness', title: 'For Parents',
      arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ',
      transliteration: "Rabbighfir li wa liwalidayya",
      translation: "My Lord, forgive me and my parents.",
      reference: "Surah Nuh 71:28"
    },

    // --- SOCIAL ---
    {
      id: 'soc1', category: 'social', title: 'End of Gathering',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
      transliteration: "Subhanakallahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk",
      translation: "Glory is to You, O Allah, and praise. I bear witness that there is no god but You. I seek Your forgiveness and repent to You.",
      reference: "Tirmidhi"
    },
    {
      id: 'soc2', category: 'social', title: 'Visiting Sick',
      arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ',
      transliteration: "La ba'sa tahurun insha'Allah",
      translation: "Do not worry, it will be a purification (from sins), if Allah wills.",
      reference: "Bukhari"
    },
    {
      id: 'soc3', category: 'social', title: 'Thanking Someone',
      arabic: 'جَزَاكَ اللَّهُ خَيْرًا',
      transliteration: "Jazakallahu khayran",
      translation: "May Allah reward you with good.",
      reference: "Tirmidhi"
    },

    // --- TRAVEL ---
    {
      id: 't1', category: 'travel', title: 'Start of Journey',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ...',
      transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin...",
      translation: "Glory to Him who has subjected this to us, and we could not have otherwise subdued it.",
      reference: "Surah Az-Zukhruf 43:13"
    },
    {
      id: 't2', category: 'travel', title: 'To a Traveler',
      arabic: 'أَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ',
      transliteration: "Astawdi'ullaha dinaka wa amanataka wa khawatima 'amalik",
      translation: "I entrust your religion, your trust (faithfulness), and the ends of your deeds to Allah.",
      reference: "Abu Dawud"
    },
    {
      id: 't3', category: 'travel', title: 'Return from Travel',
      arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
      transliteration: "Ayibuna ta'ibuna 'abiduna lirabbina hamidun",
      translation: "We are returning, repenting, worshipping, and praising our Lord.",
      reference: "Muslim"
    },

    // --- DAILY LIFE ---
    {
      id: 'd10', category: 'daily', title: 'Entering Market',
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ...',
      transliteration: "La ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamdu, yuhyi wa yumit, wa huwa hayyun la yamut...",
      translation: "There is no deity but Allah Alone... He gives life and causes death, and He is living and does not die...",
      reference: "Tirmidhi"
    },
    {
      id: 'd11', category: 'daily', title: 'Looking in Mirror',
      arabic: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
      transliteration: "Allahumma anta hassanta khalqi fahassin khuluqi",
      translation: "O Allah, just as You have made my external features beautiful, make my character beautiful as well.",
      reference: "Hisn al-Muslim"
    },
    {
      id: 'd12', category: 'daily', title: 'Sneezing',
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: "Alhamdulillah",
      translation: "All praise is for Allah. (The listener says: YarhamukAllah)",
      reference: "Bukhari"
    },
    {
      id: 'd13', category: 'daily', title: 'When Angry',
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: "A'udhu billahi minash-shaytanir-rajim",
      translation: "I seek refuge with Allah from Satan the Accursed.",
      reference: "Bukhari"
    },
    {
      id: 'd1', category: 'daily', title: 'Waking Up',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
      translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
      reference: "Bukhari"
    },
    {
      id: 'd2', category: 'daily', title: 'Before Sleeping',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your Name, O Allah, I die and I live.",
      reference: "Bukhari"
    },
    {
      id: 'd5', category: 'daily', title: 'Before Eating',
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: "Bismillah",
      translation: "In the Name of Allah.",
      reference: "Bukhari"
    },
    {
      id: 'd6', category: 'daily', title: 'After Eating',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
      translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
      reference: "Tirmidhi"
    },
    {
      id: 'd7', category: 'daily', title: 'Leaving Home',
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: "Bismillahi tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah",
      translation: "In the Name of Allah, I place my trust in Allah. There is no might nor power except with Allah.",
      reference: "Abu Dawud"
    },
    
    // --- MORNING & EVENING ---
    {
      id: 'me1', category: 'morning_evening', title: 'Sayyidul Istighfar',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ...',
      transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka...",
      translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your slave...",
      reference: "Bukhari"
    },
    {
      id: 'me2', category: 'morning_evening', title: 'Protection',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Bismillahi alladhi la yadurru ma'asmihi shay'un...",
      translation: "In the Name of Allah with Whose Name there is protection against every kind of harm...",
      reference: "Abu Dawud (3x)"
    },
    {
      id: 'me3', category: 'morning_evening', title: 'Satisfaction',
      arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
      transliteration: "Radhitu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin nabiyya",
      translation: "I am pleased with Allah as my Lord, Islam as my religion and Muhammad as my Prophet.",
      reference: "Abu Dawud"
    },
    {
      id: 'me4', category: 'morning_evening', title: 'Morning Dhikr',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
      transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah",
      translation: "We have reached the morning and at this very time all sovereignty belongs to Allah...",
      reference: "Muslim"
    },

    // --- FAMILY ---
    {
      id: 'f1', category: 'family', title: 'For Parents',
      arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: "Rabbi rhamhuma kama rabbayani saghira",
      translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
      reference: "Surah Al-Isra 17:24"
    },
    {
      id: 'f2', category: 'family', title: 'Spouse & Offspring',
      arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
      transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin",
      translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes.",
      reference: "Surah Al-Furqan 25:74"
    },
    {
      id: 'f3', category: 'family', title: 'For Newlyweds',
      arabic: 'بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
      transliteration: "Barakallahu laka, wa baraka 'alayka, wa jama'a baynakuma fi khayr",
      translation: "May Allah bless you, and shower His blessings upon you, and join you together in goodness.",
      reference: "Abu Dawud"
    },
    {
      id: 'f4', category: 'family', title: 'Protecting Children',
      arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
      transliteration: "U'idhukuma bikalimatillahit-tammah min kulli shaytanin wa hammah, wa min kulli 'aynin lammah",
      translation: "I seek protection for you in the Perfect Words of Allah from every devil and every beast, and from every envious blameworthy eye.",
      reference: "Bukhari"
    }
  ],
  fr: [
    // --- PRIÈRE (Salat) ---
    {
      id: 'pr1', category: 'prayer', title: 'Ouverture (Istiftah)',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
      transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
      translation: "Gloire et pureté à Toi, ô Allah, et à Toi la louange. Béni soit Ton Nom, élevé soit Ta Majesté, et il n'y a pas d'autre divinité que Toi.",
      reference: "Abu Dawud"
    },
    {
      id: 'pr2', category: 'prayer', title: 'Inclinaison (Ruku)',
      arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      transliteration: "Subhana Rabbiyal-Azim",
      translation: "Gloire et pureté à mon Seigneur le Très Grand. (3 fois)",
      reference: "Muslim"
    },
    {
      id: 'pr3', category: 'prayer', title: 'Redressement',
      arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
      transliteration: "Rabbana wa lakal-hamd, hamdan kathiran tayyiban mubarakan fih",
      translation: "Ô notre Seigneur, à Toi la louange, une louange abondante, bénie et pure.",
      reference: "Bukhari"
    },
    {
      id: 'pr4', category: 'prayer', title: 'Prosternation (Sujud)',
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
      transliteration: "Subhana Rabbiyal-A'la",
      translation: "Gloire et pureté à mon Seigneur le Très Haut. (3 fois)",
      reference: "Muslim"
    },
    {
      id: 'pr5', category: 'prayer', title: 'Entre deux Sujood',
      arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
      transliteration: "Rabbighfir li, Rabbighfir li",
      translation: "Seigneur, pardonne-moi. Seigneur, pardonne-moi.",
      reference: "Abu Dawud"
    },
    {
      id: 'pr6', category: 'prayer', title: 'Tashahhud (Complet)',
      arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh...",
      translation: "Les salutations sont pour Allah, ainsi que les prières et les bonnes œuvres. Que la paix soit sur toi, ô Prophète, ainsi que la miséricorde d'Allah et Ses bénédictions. Que la paix soit sur nous et sur les vertueux serviteurs d'Allah. J'atteste qu'il n'y a pas de divinité sauf Allah, et j'atteste que Muhammad est Son serviteur et Son Messager.",
      reference: "Bukhari & Muslim"
    },
    {
      id: 'pr7', category: 'prayer', title: 'Salawat (Ibrahimiyyah)',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ...',
      transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad...",
      translation: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad comme Tu as prié sur Ibrahim et sur la famille d'Ibrahim, Tu es certes Digne de louange et de gloire...",
      reference: "Bukhari"
    },
    {
      id: 'pr8', category: 'prayer', title: 'Dhikr après la Prière',
      arabic: 'أَسْتَغْفِرُ اللَّهَ (3)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      transliteration: "Astaghfirullah (3x). Allahumma antas-Salam wa minkas-salam...",
      translation: "Je demande pardon à Allah (3 fois). Ô Allah, Tu es la Paix et la paix vient de Toi. Béni sois-Tu, ô Détenteur de la Majesté et de la Noblesse.",
      reference: "Muslim"
    },

    // --- CORANIQUES (RABBANA) ---
    {
      id: 'q1', category: 'quranic', title: 'Bien ici-bas et au-delà',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
      translation: "Seigneur, donne-nous dans ce monde un bien, et dans l'au-delà un bien, et protège-nous du châtiment du Feu.",
      reference: "Sourate Al-Baqarah 2:201"
    },
    {
      id: 'q2', category: 'quranic', title: 'Pardon & Miséricorde',
      arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
      transliteration: "Rabbana zalamna anfusana wa in lam taghfir lana...",
      translation: "Ô notre Seigneur, nous avons fait du tort à nous-mêmes. Et si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons très certainement du nombre des perdants.",
      reference: "Sourate Al-A'raf 7:23"
    },
    {
      id: 'q3', category: 'quranic', title: 'Fermeté du Cœur',
      arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
      transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana...",
      translation: "Seigneur, ne laisse pas dévier nos cœurs après que Tu nous aies guidés, et accorde-nous Ta miséricorde.",
      reference: "Sourate Ali 'Imran 3:8"
    },
    {
      id: 'q4', category: 'quranic', title: 'Acceptation',
      arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Rabbana taqabbal minna innaka antas-sami'ul-'alim",
      translation: "Seigneur, accepte ceci de notre part ! Car c'est Toi l'Audient, l'Omniscient.",
      reference: "Sourate Al-Baqarah 2:127"
    },
    {
      id: 'q5', category: 'quranic', title: 'Patience & Victoire',
      arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana...",
      translation: "Seigneur, déverse sur nous l'endurance, affermis nos pas et donne-nous la victoire sur le peuple infidèle.",
      reference: "Sourate Al-Baqarah 2:250"
    },

    // --- RAMADAN & JEÛNE ---
    {
      id: 'ram1', category: 'ramadan', title: 'Rupture du Jeûne',
      arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      transliteration: "Dhahabadh-dhama'u wabtallatil-'uruqu wa thabatal-ajru insha'Allah",
      translation: "La soif est partie, les veines sont humidifiées et la récompense est assurée, si Allah le veut.",
      reference: "Abu Dawud"
    },
    {
      id: 'ram2', category: 'ramadan', title: 'Nuit du Destin',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
      translation: "Ô Allah, Tu es certes Pardonneur et Tu aimes le pardon, alors pardonne-moi.",
      reference: "Tirmidhi"
    },
    {
      id: 'ram3', category: 'ramadan', title: 'Nouvelle Lune',
      arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ',
      transliteration: "Allahumma ahillahu 'alayna bil-amni wal-iman, was-salamati wal-Islam",
      translation: "Ô Allah, apporte-nous avec cette lune la sécurité, la foi, le salut et l'Islam.",
      reference: "Tirmidhi"
    },

    // --- ÉMOTIONS ---
    {
      id: 'em1', category: 'emotions', title: 'Soucis & Tristesse',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ...',
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan...",
      translation: "Ô Allah, je cherche refuge auprès de Toi contre les soucis et la tristesse, l'impuissance et la paresse...",
      reference: "Bukhari"
    },
    {
      id: 'em2', category: 'emotions', title: 'Détresse (Younous)',
      arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
      translation: "Pas de divinité à part Toi ! Pureté à Toi ! J'ai été du nombre des injustes.",
      reference: "Sourate Al-Anbya 21:87"
    },
    {
      id: 'em3', category: 'emotions', title: 'Dettes & Besoin',
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      transliteration: "Allahummak-fini bihalalika 'an haramik, wa aghnini bifadlika 'amman siwak",
      translation: "Ô Allah, suffis-moi de Ton licite contre Ton illicite, et enrichis-moi par Ta grâce de tout autre que Toi.",
      reference: "Tirmidhi"
    },

    // --- PARDON ---
    {
      id: 'for1', category: 'forgiveness', title: 'Pardon Général',
      arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ',
      transliteration: "Rabbighfir warham wa anta khairur-rahimin",
      translation: "Seigneur, pardonne et fais miséricorde. C'est Toi le Meilleur des miséricordieux.",
      reference: "Sourate Al-Mu'minun 23:118"
    },
    {
      id: 'for2', category: 'forgiveness', title: 'Istighfar Simple',
      arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      transliteration: "Astaghfirullaha wa atubu ilayh",
      translation: "Je demande pardon à Allah et je me repens à Lui.",
      reference: "Bukhari"
    },
    {
      id: 'for3', category: 'forgiveness', title: 'Pour les Parents',
      arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ',
      transliteration: "Rabbighfir li wa liwalidayya",
      translation: "Seigneur ! Pardonne-moi, ainsi qu'à mes père et mère.",
      reference: "Sourate Nuh 71:28"
    },

    // --- SOCIAL ---
    {
      id: 'soc1', category: 'social', title: 'Fin d\'assemblée',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
      transliteration: "Subhanakallahumma wa bihamdika, ash-hadu an la ilaha illa anta...",
      translation: "Gloire et pureté à Toi, ô Allah, et à Toi la louange. J'atteste qu'il n'y a de divinité que Toi. Je demande Ton pardon et je me repens à Toi.",
      reference: "Tirmidhi"
    },
    {
      id: 'soc2', category: 'social', title: 'Visite au Malade',
      arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ',
      transliteration: "La ba'sa tahurun insha'Allah",
      translation: "Pas de mal, que cela soit une purification (des péchés) si Allah le veut.",
      reference: "Bukhari"
    },
    {
      id: 'soc3', category: 'social', title: 'Remerciement',
      arabic: 'جَزَاكَ اللَّهُ خَيْرًا',
      transliteration: "Jazakallahu khayran",
      translation: "Qu'Allah te rétribue par le bien.",
      reference: "Tirmidhi"
    },

    // --- VOYAGE ---
    {
      id: 't1', category: 'travel', title: 'Début du voyage',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ...',
      transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin...",
      translation: "Gloire à Celui qui nous a soumis tout cela alors que nous n'étions pas capables de le dominer.",
      reference: "Sourate Az-Zukhruf 43:13"
    },
    {
      id: 't2', category: 'travel', title: 'Au Voyageur',
      arabic: 'أَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ',
      transliteration: "Astawdi'ullaha dinaka wa amanataka wa khawatima 'amalik",
      translation: "Je confie à Allah ta religion, tes dépôts et la fin de tes œuvres.",
      reference: "Abu Dawud"
    },
    {
      id: 't3', category: 'travel', title: 'Retour de Voyage',
      arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
      transliteration: "Ayibuna ta'ibuna 'abiduna lirabbina hamidun",
      translation: "Nous revenons, repentants, adorateurs et louant notre Seigneur.",
      reference: "Muslim"
    },

    // --- VIE QUOTIDIENNE ---
    {
      id: 'd10', category: 'daily', title: 'Entrer au Marché',
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ...',
      transliteration: "La ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamdu...",
      translation: "Il n'y a de divinité qu'Allah, Seul sans associé... Il donne la vie et la mort, Il est Vivant et ne meurt pas...",
      reference: "Tirmidhi"
    },
    {
      id: 'd11', category: 'daily', title: 'Devant le miroir',
      arabic: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
      transliteration: "Allahumma anta hassanta khalqi fahassin khuluqi",
      translation: "Ô Allah, comme Tu as embelli mon apparence, embellis mon caractère.",
      reference: "Hisn al-Muslim"
    },
    {
      id: 'd12', category: 'daily', title: 'Après éternuement',
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: "Alhamdulillah",
      translation: "Louange à Allah. (Celui qui entend répond : YarhamukAllah).",
      reference: "Bukhari"
    },
    {
      id: 'd13', category: 'daily', title: 'Contre la colère',
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: "A'udhu billahi minash-shaytanir-rajim",
      translation: "Je cherche refuge auprès d'Allah contre Satan le maudit.",
      reference: "Bukhari"
    },
    {
      id: 'd1', category: 'daily', title: 'Au réveil',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
      translation: "Louange à Allah qui nous a rendu la vie après nous avoir fait mourir.",
      reference: "Bukhari"
    },
    {
      id: 'd2', category: 'daily', title: 'Avant de dormir',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "C'est en Ton nom, ô Allah, que je meurs et que je vis.",
      reference: "Bukhari"
    },
    {
      id: 'd5', category: 'daily', title: 'Avant de manger',
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: "Bismillah",
      translation: "Au nom d'Allah.",
      reference: "Bukhari"
    },
    {
      id: 'd6', category: 'daily', title: 'Après manger',
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
      translation: "Louange à Allah qui nous a nourris, abreuvés et faits musulmans.",
      reference: "Tirmidhi"
    },
    {
      id: 'd7', category: 'daily', title: 'Sortir de la maison',
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: "Bismillahi tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah",
      translation: "Au nom d'Allah, je place ma confiance en Allah. Il n'y a de force ni de puissance que par Allah.",
      reference: "Abu Dawud"
    },
    
    // --- MATIN & SOIR ---
    {
      id: 'me1', category: 'morning_evening', title: 'Maîtresse du Pardon',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ...',
      transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka...",
      translation: "Ô Allah, Tu es mon Seigneur, il n'y a de dieu que Toi. Tu m'as créé, je suis Ton serviteur...",
      reference: "Bukhari"
    },
    {
      id: 'me2', category: 'morning_evening', title: 'Protection absolue',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
      transliteration: "Bismillahi alladhi la yadurru ma'asmihi shay'un...",
      translation: "Au nom d'Allah, avec le Nom de Qui rien ne nuit sur terre ni dans le ciel.",
      reference: "Abu Dawud (3 fois)"
    },
    {
      id: 'me3', category: 'morning_evening', title: 'Satisfaction',
      arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
      transliteration: "Radhitu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin nabiyya",
      translation: "Je suis satisfait d'Allah comme Seigneur, de l'Islam comme religion et de Muhammad comme Prophète.",
      reference: "Abu Dawud (3 fois)"
    },
    {
      id: 'me4', category: 'morning_evening', title: 'Dhikr du matin',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
      transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah",
      translation: "Nous voici au matin et la royauté appartient à Allah. Louange à Allah.",
      reference: "Muslim"
    },
    
    // --- FAMILLE ---
    {
      id: 'f1', category: 'family', title: 'Pour les Parents',
      arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: "Rabbi rhamhuma kama rabbayani saghira",
      translation: "Ô mon Seigneur, fais-leur miséricorde comme ils m'ont élevé tout petit.",
      reference: "Sourate Al-Isra 17:24"
    },
    {
      id: 'f2', category: 'family', title: 'Conjoint & Enfants',
      arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
      transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin",
      translation: "Seigneur, donne-nous, en nos épouses et nos descendants, la joie des yeux.",
      reference: "Sourate Al-Furqan 25:74"
    },
    {
      id: 'f3', category: 'family', title: 'Pour les Mariés',
      arabic: 'بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
      transliteration: "Barakallahu laka, wa baraka 'alayka, wa jama'a baynakuma fi khayr",
      translation: "Qu'Allah bénisse ton union, qu'Il descende sur vous Ses bénédictions et vous unisse dans le bien.",
      reference: "Abu Dawud"
    },
    {
      id: 'f4', category: 'family', title: 'Protection Enfants',
      arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
      transliteration: "U'idhukuma bikalimatillahit-tammah min kulli shaytanin wa hammah, wa min kulli 'aynin lammah",
      translation: "Je cherche protection pour vous auprès des paroles parfaites d'Allah contre tout démon, tout animal venimeux et contre tout mauvais œil.",
      reference: "Bukhari"
    }
  ]
};

const DuaCollection: React.FC<DuaCollectionProps> = ({ onBack, language = 'en' }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = {
    title: language === 'fr' ? 'Citadelle du Croyant' : 'Fortress of the Believer',
    subtitle: language === 'fr' ? 'Invocations authentiques' : 'Authentic Supplications',
    search: language === 'fr' ? 'Rechercher une Doua...' : 'Search Dua...',
    copy: language === 'fr' ? 'Copié' : 'Copied'
  };

  const currentDuas = DUAS_DATA[language === 'fr' ? 'fr' : 'en'] || DUAS_DATA.en;

  const filteredDuas = currentDuas.filter(dua => {
    const matchesCategory = activeCategory === 'all' || dua.category === activeCategory;
    const matchesSearch = dua.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dua.translation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
      {/* Header */}
      <div className="p-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.subtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t.search} 
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={14} />
                {language === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {filteredDuas.map(dua => (
          <div key={dua.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {dua.title}
              </span>
              <button 
                onClick={() => handleCopy(`${dua.arabic}\n\n${dua.translation}`, dua.id)}
                className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors"
              >
                {copiedId === dua.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>

            <p className="font-arabic text-2xl text-right text-slate-800 dark:text-slate-100 leading-[2.2] mb-4" dir="rtl">
              {dua.arabic}
            </p>

            <div className="space-y-3">
              <p className="text-amber-600/90 dark:text-amber-400/90 text-sm italic font-medium leading-relaxed">
                {dua.transliteration}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {dua.translation}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-400 font-medium flex items-center gap-1">
              <BookHeart size={12} />
              Ref: {dua.reference}
            </div>
          </div>
        ))}

        {filteredDuas.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>{language === 'fr' ? 'Aucune invocation trouvée.' : 'No duas found.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaCollection;
