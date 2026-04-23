
import { GoogleGenAI, Type } from "@google/genai";
import { DailyVerse, PlaceResult, DailyHadith, HalalCheckResult, ProphetStory, QuizQuestion, DailyStory } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const cleanAndParseJSON = (text: string) => {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json\s*|\s*```/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    throw new Error("Invalid JSON format");
  }
};

// --- RANDOMIZED FALLBACK DATA (For when API fails) ---

const FALLBACK_VERSES: DailyVerse[] = [
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "For indeed, with hardship [will be] ease.", transliteration: "Fa inna ma'al-'usri yusra", reference: "Surah Ash-Sharh 94:5", reflection: "No matter how difficult the situation, relief is guaranteed by Allah's promise." },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", translation: "And say, 'My Lord, increase me in knowledge.'", transliteration: "Wa qul Rabbi zidni 'ilma", reference: "Surah Taha 20:114", reflection: "Always seek to learn and grow, for knowledge is a light from Allah." },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Indeed, Allah is with the patient.", transliteration: "Innallaha ma'as-sabirin", reference: "Surah Al-Baqarah 2:153", reflection: "Patience brings you closer to Allah and His support." },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", translation: "And whoever fears Allah - He will make for him a way out.", transliteration: "Wa man yattaqillaha yaj'al lahu makhraja", reference: "Surah At-Talaq 65:2", reflection: "Taqwa is the key to solving life's unsolvable problems." }
];

const FALLBACK_HADITHS: DailyHadith[] = [
  { arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", translation: "Actions are judged by intentions.", source: "Sahih Bukhari & Muslim", narrator: "Umar ibn Al-Khattab (RA)", reflection: "Sincerity is the foundation of all worship.", category: "Faith" },
  { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", translation: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Sahih Bukhari", narrator: "Anas ibn Malik (RA)", reflection: "True faith requires empathy and selflessness.", category: "Social" },
  { arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", translation: "A good word is charity.", source: "Sahih Bukhari", narrator: "Abu Hurairah (RA)", reflection: "Kindness costs nothing but has immense value.", category: "Character" },
  { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", translation: "The best among you is the one who learns the Quran and teaches it.", source: "Sahih Bukhari", narrator: "Uthman ibn Affan (RA)", reflection: "Knowledge sharing is a noble act.", category: "Knowledge" }
];

const FALLBACK_STORIES: DailyStory[] = [
  { 
    title: "The Patience of Prophet Ayyub (AS)", 
    theme: "Patience (Sabr)", 
    story: "Prophet Ayyub (Job) was a wealthy man who lost everything—health, wealth, and family. Yet, he remained patient and grateful. After years of trial, Allah restored everything to him in multiples.", 
    quran: { arabic: "وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ", translation: "And Job, when he called to his Lord, 'Adversity has touched me, and You are the Most Merciful.'", transliteration: "Wa Ayyuba idh nada Rabbahu anni massaniyad-durru wa anta Arhamur-Rahimin", reference: "Surah Al-Anbya 21:83" }, 
    hadith: { arabic: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ", translation: "Strange is the affair of the believer, verily all his affairs are good for him.", source: "Sahih Muslim" }, 
    lesson: "True patience in adversity leads to immense reward." 
  },
  { 
    title: "The Honesty of the Merchant", 
    theme: "Honesty", 
    story: "A merchant once sold a garment with a hidden defect. His employee forgot to tell the buyer. The merchant chased the buyer for miles to return the money or inform him, fearing Allah's judgment.", 
    quran: { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ", translation: "O you who have believed, fear Allah and be with those who are true.", transliteration: "Ya ayyuhalladhina amanut-taqullaha wa kunu ma'as-sadiqin", reference: "Surah At-Tawbah 9:119" }, 
    hadith: { arabic: "الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا", translation: "The buyer and seller have the option (to cancel) as long as they have not separated.", source: "Sahih Bukhari" }, 
    lesson: "Integrity in business brings Barakah (blessing)." 
  }
];

const FALLBACK_PROPHET_STORIES: Record<string, ProphetStory> = {}; 
const FALLBACK_QUIZ_POOL: QuizQuestion[] = [
  { question: "How many surahs are in the Quran?", options: ["110", "114", "112", "116"], correctAnswer: 1, explanation: "There are 114 Surahs in the Holy Quran." },
  { question: "Which Prophet built the Kaaba?", options: ["Musa (AS)", "Isa (AS)", "Ibrahim (AS)", "Nuh (AS)"], correctAnswer: 2, explanation: "Prophet Ibrahim (AS) and his son Ismail (AS) built the Kaaba." },
  { question: "What is the third pillar of Islam?", options: ["Salah", "Zakat", "Hajj", "Sawm"], correctAnswer: 1, explanation: "Zakat (Charity) is the third pillar of Islam." }
];

// Helper to get random item from array
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getLanguageName = (code: string) => {
  switch (code) {
    case 'fr': return 'French';
    case 'ar': return 'Arabic';
    case 'es': return 'Spanish';
    case 'wo': return 'Wolof';
    default: return 'English';
  }
};

const handleQuotaError = (error: any, context: string) => {
  if (error.message?.includes('429') || error.message?.includes('quota') || error.status === 429) {
    console.warn(`Gemini API Quota Exceeded for ${context}. Switching to random fallback content.`);
  } else {
    console.error(`${context} Error (Using Fallback):`, error);
  }
};

export const generateDailyVerse = async (language: string = 'en'): Promise<DailyVerse | null> => {
  if (!apiKey) return getRandom(FALLBACK_VERSES);
  
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a beautiful, inspiring Quranic verse for today. 
      It must be a valid Ayat.
      Include:
      - Arabic text
      - ${langName} translation
      - Transliteration (Latin script phonetic transcription)
      - Reference (Surah:Verse)
      - Brief reflection in ${langName}`,
      config: {
        systemInstruction: "You are a helpful Islamic assistant. Provide accurate Quranic verses in valid JSON format. Do not add markdown code blocks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabic: { type: Type.STRING },
            translation: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            reference: { type: Type.STRING },
            reflection: { type: Type.STRING },
          },
          required: ["arabic", "translation", "transliteration", "reference", "reflection"],
        },
      },
    });
    
    if (!response.text) throw new Error("Model returned empty text");
    const data = cleanAndParseJSON(response.text);
    if (!data.arabic || !data.translation) throw new Error("Invalid response structure");
    return data as DailyVerse;
  } catch (error) { 
    handleQuotaError(error, "Daily Verse");
    return getRandom(FALLBACK_VERSES);
  }
};

export const generateDailyHadith = async (language: string = 'en'): Promise<DailyHadith | null> => {
  if (!apiKey) return getRandom(FALLBACK_HADITHS);
  
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate an authentic Hadith for today. 
      Ensure output is valid JSON.
      Include:
      - Arabic text
      - ${langName} translation
      - Source (e.g. Sahih Bukhari)
      - Narrator
      - Reflection in ${langName}
      - Category in ${langName}`,
      config: {
        systemInstruction: "You are a knowledgeable Islamic assistant providing authentic Hadiths in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabic: { type: Type.STRING },
            translation: { type: Type.STRING },
            source: { type: Type.STRING },
            narrator: { type: Type.STRING },
            reflection: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["arabic", "translation", "source", "narrator", "reflection", "category"],
        },
      },
    });
    
    if (!response.text) throw new Error("Model returned empty text");
    const data = cleanAndParseJSON(response.text);
    if (!data.arabic || !data.translation) throw new Error("Invalid response structure");
    return data as DailyHadith;
  } catch (error) { 
    handleQuotaError(error, "Daily Hadith");
    return getRandom(FALLBACK_HADITHS);
  }
};

export const generateDailyStory = async (language: string = 'en'): Promise<DailyStory | null> => {
  if (!apiKey) return getRandom(FALLBACK_STORIES);
  
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a unique "Islamic Story of the Day".
      It should connect a specific Surah/Ayah, a Hadith, and a short narrative or historical event.
      Language: ${langName}.
      
      Structure:
      1. Title & Theme.
      2. The Narrative (Story).
      3. A relevant Quran Verse (Arabic, Translation, Transliteration).
      4. A relevant Hadith (Arabic + Translation).
      5. A key lesson.`,
      config: {
        systemInstruction: "You are a storyteller specializing in Islamic history and values.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            theme: { type: Type.STRING },
            story: { type: Type.STRING },
            quran: {
              type: Type.OBJECT,
              properties: {
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
                transliteration: { type: Type.STRING },
                reference: { type: Type.STRING },
              },
              required: ["arabic", "translation", "transliteration", "reference"]
            },
            hadith: {
              type: Type.OBJECT,
              properties: {
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
                source: { type: Type.STRING },
              },
              required: ["arabic", "translation", "source"]
            },
            lesson: { type: Type.STRING },
          },
          required: ["title", "theme", "story", "quran", "hadith", "lesson"],
        },
      },
    });
    
    if (!response.text) throw new Error("Model returned empty text");
    const data = cleanAndParseJSON(response.text);
    if (!data.title) throw new Error("Invalid response structure");
    return data as DailyStory;
  } catch (error) {
    handleQuotaError(error, "Daily Story");
    return getRandom(FALLBACK_STORIES);
  }
};

export const generateProphetStory = async (prophetName: string, language: string = 'en'): Promise<ProphetStory | null> => {
  if (!apiKey) {
    const fallback = FALLBACK_PROPHET_STORIES[prophetName];
    if (fallback) return fallback;
    const match = Object.keys(FALLBACK_PROPHET_STORIES).find(key => prophetName.includes(key));
    if (match) return FALLBACK_PROPHET_STORIES[match];
    return null;
  }

  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tell me the detailed story of Prophet ${prophetName} AS. 
      Provide:
      1. A rich, engaging biography.
      2. Historical period & location.
      3. Key life events.
      4. Miracles.
      5. Major trials (hardships).
      6. Spiritual lessons.
      7. A key Quranic verse.
      8. References.
      
      Language: ${langName}.`,
      config: {
        systemInstruction: "You are an expert in Islamic history and Prophetic stories.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            arabicName: { type: Type.STRING },
            summary: { type: Type.STRING },
            period: { type: Type.STRING },
            location: { type: Type.STRING },
            keyEvents: { type: Type.ARRAY, items: { type: Type.STRING } },
            miracles: { type: Type.ARRAY, items: { type: Type.STRING } },
            trials: { type: Type.ARRAY, items: { type: Type.STRING } },
            lessons: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyVerse: {
              type: Type.OBJECT,
              properties: {
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
                reference: { type: Type.STRING },
              },
              required: ["arabic", "translation", "reference"]
            },
            quranicReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "arabicName", "summary", "period", "location", "keyEvents", "miracles", "trials", "lessons", "quranicReferences"],
        },
      },
    });
    
    if (!response.text) throw new Error("Model returned empty text");
    const data = cleanAndParseJSON(response.text);
    return data as ProphetStory;
  } catch (error) { 
    handleQuotaError(error, "Prophet Story");
    const fallback = FALLBACK_PROPHET_STORIES[prophetName];
    if (fallback) return fallback;
    const match = Object.keys(FALLBACK_PROPHET_STORIES).find(key => prophetName.includes(key));
    if (match) return FALLBACK_PROPHET_STORIES[match];
    return null; 
  }
};

export const getAyahTafsir = async (surah: number, ayah: number, text: string, language: string = 'en'): Promise<string | null> => {
  if (!apiKey) return "Tafsir currently unavailable without API Key.";
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise but insightful Tafsir (exegesis) for the following Quranic verse.
      Context: Surah ${surah}, Ayah ${ayah}.
      Verse: "${text}".
      
      The explanation should be easy to understand, spiritual, and grounded in Sunni tradition (e.g., Ibn Kathir, Jalalayn).
      Language: ${langName}.
      Maximum length: 100 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tafsir: { type: Type.STRING }
          },
          required: ["tafsir"]
        }
      }
    });
    
    if (!response.text) return null;
    const data = cleanAndParseJSON(response.text);
    return data.tafsir;
  } catch (error) {
    handleQuotaError(error, "Tafsir");
    return null;
  }
};

export const translateAyahToWolof = async (surah: number, ayah: number, arabicText: string): Promise<string | null> => {
  if (!apiKey) return "Translation unavailable without API Key.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide an accurate and respectful translation of the following Quranic verse (Ayah) into the Wolof language. 
      Context: Surah ${surah}, Ayah ${ayah}.
      Arabic text: "${arabicText}".
      
      Only provide the Wolof translation without any additional commentary. Use standard Wolof orthography (Alxuraan translation style).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING }
          },
          required: ["translation"]
        }
      }
    });
    
    if (!response.text) return null;
    const data = cleanAndParseJSON(response.text);
    return data.translation;
  } catch (error) {
    handleQuotaError(error, "Translate to Wolof");
    return null;
  }
};

export const getHadithExplanation = async (text: string, source: string, language: string = 'en'): Promise<string | null> => {
  if (!apiKey) return "Explanation currently unavailable without API Key.";
  
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise, spiritual, and easy-to-understand explanation (Sharh) for the following Hadith.
      
      Hadith Text: "${text}"
      Source: "${source}"
      
      Output Language: ${langName}.
      
      Format: Plain text, max 100 words. Focus on the core lesson and practical application.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING }
          },
          required: ["explanation"]
        }
      }
    });
    
    if (!response.text) return null;
    const data = cleanAndParseJSON(response.text);
    return data.explanation;
  } catch (error) {
    handleQuotaError(error, "Hadith Explanation");
    return null;
  }
};

// Generate a batch of authentic hadiths for a specific topic
export const generateHadithBatch = async (topic: string, count: number, language: string = 'en'): Promise<{arabic: string, text: string, source: string}[]> => {
  if (!apiKey) return [];
  const langName = getLanguageName(language);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} authentic Hadiths specifically about "${topic}".
      Sources must be Sahih Bukhari, Muslim, Tirmidhi, Abu Dawud, An-Nasai, or Ibn Majah.
      Ensure the hadiths are diverse and not duplicates.
      
      Language: ${langName}.
      
      Return valid JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              arabic: { type: Type.STRING },
              text: { type: Type.STRING },
              source: { type: Type.STRING },
            },
            required: ["arabic", "text", "source"],
          },
        },
      },
    });
    
    if (!response.text) return [];
    const data = cleanAndParseJSON(response.text);
    return data as {arabic: string, text: string, source: string}[];
  } catch (error) {
    handleQuotaError(error, "Generate Hadith Batch");
    return [];
  }
};

export const generateQuiz = async (topic: string, count: number = 3, language: string = 'en'): Promise<QuizQuestion[]> => {
  const langName = getLanguageName(language);
  
  if (!apiKey) return getRandom(FALLBACK_QUIZ_POOL) ? FALLBACK_QUIZ_POOL : [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} multiple-choice quiz questions about "${topic}".
      Language: ${langName}.
      Include 4 options for each question.`,
      config: {
        systemInstruction: "You are an Islamic educator creating engaging quizzes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });
    
    if (!response.text) throw new Error("Model returned empty text");
    const data = cleanAndParseJSON(response.text);
    return data as QuizQuestion[];
  } catch (error) {
    handleQuotaError(error, "Quiz Generation");
    return FALLBACK_QUIZ_POOL.slice(0, count);
  }
};

export const findMosques = async (lat: number, lng: number, language: string = 'en'): Promise<{ text: string, places: PlaceResult[] }> => {
  if (!apiKey) return { text: "", places: [] };
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // Use Gemini 2.0 Flash Exp for Maps Grounding
      contents: `Find the best rated mosques nearby. Reply in ${langName}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      },
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapPlaces = chunks.filter((c: any) => c.maps).map((c: any) => ({
      title: c.maps.title,
      uri: c.maps.uri,
      snippet: c.maps.placeAnswerSources?.reviewSnippets?.[0]?.snippet,
      type: 'mosque'
    }));
    return { text: response.text || "", places: mapPlaces };
  } catch (error) { 
    handleQuotaError(error, "Find Mosques");
    return { text: "", places: [] }; 
  }
};

export const chatWithAi = async (message: string, history: any[], language: string = 'en'): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  const langName = getLanguageName(language);
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Sabildeen, a knowledgeable Islamic AI. Help with Duas, history, and spiritual advice. Be concise and warm. Reply in ${langName}.`
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text || "No response from AI.";
  } catch (error) { 
    handleQuotaError(error, "Chat");
    return "Sorry, I cannot respond right now (Quota Limit)."; 
  }
};

export const checkHalalIngredients = async (base64Image: string, language: string = 'en'): Promise<HalalCheckResult | null> => {
  if (!apiKey) return null;
  const langName = getLanguageName(language);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: `Analyze the ingredient list in this image and determine if the product is Halal, Haram, or Doubtful. Provide the result in ${langName}.` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['halal', 'haram', 'doubtful'] },
            reason: { type: Type.STRING },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["status", "reason", "concerns"],
        },
      },
    });
    
    if (!response.text) return null;
    const data = cleanAndParseJSON(response.text);
    return data as HalalCheckResult;
  } catch (error) {
    handleQuotaError(error, "Halal Scan");
    return null;
  }
};

export const identifyQuranVerse = async (text: string): Promise<{ surah: number, ayah: number } | null> => {
  if (!apiKey) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the specific Quranic verse (Ayah) from this text: "${text}". Return Surah and Ayah number.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            surah: { type: Type.INTEGER },
            ayah: { type: Type.INTEGER },
          },
          required: ["surah", "ayah"],
        },
      },
    });
    
    if (!response.text) return null;
    const data = cleanAndParseJSON(response.text);
    return data as { surah: number, ayah: number };
  } catch (error) {
    handleQuotaError(error, "Identify Verse");
    return null;
  }
};
