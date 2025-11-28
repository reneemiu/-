import { GoogleGenAI, Type } from "@google/genai";
import { WordChallenge } from "../types";

// Helper to convert raw zhuyin string to keys is complex without a dictionary, 
// so we ask Gemini to provide the exact key mapping sequence in the JSON.
export const fetchNewWords = async (topic: string = "可愛動物"): Promise<WordChallenge[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Using fallback data.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
  You are an educational assistant for 2nd grade students in Taiwan.
  Generate a list of 5 Traditional Chinese words related to the topic provided.
  The words should be simple (2-3 characters).
  
  CRITICAL: You must decompose each character into its standard Zhuyin (Bopomofo) keyboard keys.
  
  Key Mapping Reference (Standard Layout):
  ㄅ:1, ㄆ:q, ㄇ:a, ㄈ:z
  ㄉ:2, ㄊ:w, ㄋ:s, ㄌ:x
  ㄍ:e, ㄎ:d, ㄏ:c
  ㄐ:r, ㄑ:f, ㄒ:v
  ㄓ:5, ㄔ:t, ㄕ:g, ㄖ:b
  ㄗ:y, ㄘ:h, ㄙ:n
  ㄧ:u, ㄨ:j, ㄩ:m
  ㄚ:8, ㄛ:i, ㄜ:k, ㄝ:,
  ㄞ:9, ㄟ:o, ㄠ:l, ㄡ:.
  ㄢ:0, ㄣ:p, ㄤ:;, ㄥ:/
  ㄦ:-
  Tone 1 (no symbol): ' ' (spacebar)
  Tone 2 (ˊ): 6
  Tone 3 (ˇ): 3
  Tone 4 (ˋ): 4
  Neutral (˙): 7

  Example Output Structure:
  {
    "word": "花",
    "hint": "植物",
    "chars": [
      { 
        "char": "花", 
        "zhuyin": ["ㄏ", "ㄨ", "ㄚ"], 
        "keys": ["c", "j", "8", " "], // Note the space for Tone 1
        "tone": " " 
      }
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 words about "${topic}".`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              hint: { type: Type.STRING },
              chars: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    char: { type: Type.STRING },
                    zhuyin: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keys: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tone: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as WordChallenge[];
    }
    return [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};