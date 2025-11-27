import { GoogleGenAI, Type } from "@google/genai";
import { TranscriptionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are an expert transcriber and translator. 
Your task is to process the provided input (video or text) and produce a structured document.
1. Transcribe or process the original content exactly as it appears (Original Language).
2. Translate the content into fluent, natural-sounding Indonesian.
3. Return the result in a structured JSON format containing both the original text and the Indonesian translation.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    originalLanguage: { type: Type.STRING, description: "The name of the original language detected." },
    originalContent: { type: Type.STRING, description: "The full transcription or content in the original language." },
    indonesianTranslation: { type: Type.STRING, description: "The full translation in Indonesian." },
    summary: { type: Type.STRING, description: "A brief summary of the content in Indonesian." }
  },
  required: ["originalLanguage", "originalContent", "indonesianTranslation", "summary"]
};

export const processContent = async (
  input: { type: 'text' | 'video', content: string, mimeType?: string }
): Promise<TranscriptionResult> => {
  
  try {
    const parts = [];
    
    if (input.type === 'video') {
      parts.push({
        inlineData: {
          mimeType: input.mimeType || 'video/mp4',
          data: input.content
        }
      });
      parts.push({ text: "Transcribe this video and provide an Indonesian translation." });
    } else {
      parts.push({ text: `Process the following text (which may be a YouTube transcript or similar): \n\n${input.content}` });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");

    const parsed = JSON.parse(jsonText);

    return {
      original: parsed.originalContent || "",
      indonesian: parsed.indonesianTranslation || "",
      raw: JSON.stringify(parsed, null, 2)
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
