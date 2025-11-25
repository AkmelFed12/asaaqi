import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Note: In a production environment, this should be proxied through a backend.
// For this demo, we assume the API key is available in the environment.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateQuestions = async (count: number = 6): Promise<Question[]> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock data.");
    return mockQuestions.slice(0, count);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Génère ${count} questions à choix multiples (QCM) sur l'Islam (Histoire, Coran, Hadith, Fiqh) en français. Les questions doivent être respectueuses, précises et variées.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING, description: "La question posée" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 choix de réponse"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "L'index de la bonne réponse (0-3)" },
              explanation: { type: Type.STRING, description: "Une courte explication de la réponse" }
            },
            required: ["questionText", "options", "correctAnswerIndex"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Réponse vide de l'IA");
    
    return JSON.parse(text) as Question[];

  } catch (error) {
    console.error("Erreur lors de la génération des questions:", error);
    return mockQuestions.slice(0, count);
  }
};

// Fallback questions in case API fails or key is missing
const mockQuestions: Question[] = [
  {
    questionText: "Quelle sourate est connue comme le 'Cœur du Coran' ?",
    options: ["Al-Fatiha", "Ya-Sin", "Al-Baqara", "Al-Ikhlas"],
    correctAnswerIndex: 1,
    explanation: "Le Prophète (paix sur lui) a dit que tout a un cœur, et le cœur du Coran est la sourate Ya-Sin."
  },
  {
    questionText: "En quelle année l'Hégire (migration vers Médine) a-t-elle eu lieu ?",
    options: ["610 après J.C.", "622 après J.C.", "632 après J.C.", "570 après J.C."],
    correctAnswerIndex: 1,
    explanation: "L'Hégire a eu lieu en 622 après J.C., marquant le début du calendrier islamique."
  },
  {
    questionText: "Lequel de ces piliers est le premier pilier de l'Islam ?",
    options: ["La Salat (Prière)", "La Zakat (Aumône)", "La Shahada (Attestation de foi)", "Le Hajj (Pèlerinage)"],
    correctAnswerIndex: 2,
    explanation: "La Shahada est le fondement de la foi et le premier pilier."
  },
  {
    questionText: "Combien y a-t-il de sourates dans le Saint Coran ?",
    options: ["110", "112", "114", "116"],
    correctAnswerIndex: 2,
    explanation: "Il y a 114 sourates dans le Saint Coran."
  },
  {
    questionText: "Quel compagnon a été le premier Calife de l'Islam ?",
    options: ["Umar ibn al-Khattab", "Ali ibn Abi Talib", "Uthman ibn Affan", "Abu Bakr as-Siddiq"],
    correctAnswerIndex: 3,
    explanation: "Abu Bakr as-Siddiq (qu'Allah l'agrée) fut le premier Calife après la mort du Prophète."
  },
  {
     questionText: "Quelle est la prière effectuée juste après le coucher du soleil ?",
     options: ["Dohr", "Asr", "Maghrib", "Isha"],
     correctAnswerIndex: 2,
     explanation: "La prière du Maghrib est effectuée juste après le coucher du soleil."
  }
];