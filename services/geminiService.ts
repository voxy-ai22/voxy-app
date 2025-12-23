import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

export interface VoxyApiError {
  status: number | null;
  message: string;
  reason: string;
  isQuotaError: boolean;
  isAuthError: boolean;
  timestamp: number;
}

const MASTER_PROMPT = `You are Voxy Ai, a world-class Senior Software Architect and Security Expert developed by Gobel Developer.

Your core capabilities:
1. ADVANCED CODING: Provide extremely accurate, clean, and secure code. Use best practices and design patterns.
2. SMART SEARCH: Use Google Search to find real-time data.
3. LOGICAL EXPLANATION: Break down complex problems.
4. SECURITY AUDIT: Every piece of code must be secure.
5. MULTIMODAL VISION: You can see images and read document contents provided in the message parts. Analyze screenshots for vulnerabilities or explain complex diagrams.

Tone: Professional, helpful, concise, and intelligent.
Identity: Always refer to yourself as Voxy Ai.
Creator: Gobel Developer.
Language: Indonesian for interaction, English for technical terms.`;

const CORE_MODEL = 'gemini-3-flash-preview';

const handleNeuralError = (error: any): never => {
  const statusStr = error.message?.match(/(\d{3})/)?.[1];
  const status = error.status || (statusStr ? parseInt(statusStr) : null);
  const rawMessage = error.message || "Unknown neural link failure.";
  
  let reason = "Kesalahan transmisi data pada lapisan neural.";
  let isQuotaError = false;
  let isAuthError = false;

  if (status === 429 || 
      rawMessage.toLowerCase().includes('quota') || 
      rawMessage.toLowerCase().includes('exhausted') || 
      rawMessage.toLowerCase().includes('rate limit')) {
    reason = "Batas Quota Gemini API Habis. Silakan tunggu sebentar.";
    isQuotaError = true;
  } else if (status === 403 || status === 401 || 
             rawMessage.toLowerCase().includes('key') || 
             rawMessage.toLowerCase().includes('permission')) {
    reason = "API Key tidak valid atau tidak memiliki izin akses.";
    isAuthError = true;
  }

  throw { status, message: rawMessage, reason, isQuotaError, isAuthError, timestamp: Date.now() } as VoxyApiError;
};

const getAIInstance = () => {
  const key = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey: key });
};

export const chatWithVoxyStream = async (message: string, history: ChatMessage[], attachments: {data: string, mimeType: string}[]) => {
  try {
    const ai = getAIInstance();
    const contents: any[] = history.slice(-10).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const userParts: any[] = [{ text: message }];
    
    // Tambahkan semua lampiran (gambar/file) ke parts
    attachments.forEach(att => {
      userParts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data.split(',')[1] || att.data
        }
      });
    });

    contents.push({ role: 'user', parts: userParts });

    return await ai.models.generateContentStream({
      model: CORE_MODEL,
      contents: contents,
      config: { 
        systemInstruction: MASTER_PROMPT,
        temperature: 0.2,
        tools: [{ googleSearch: {} }]
      }
    });
  } catch (error: any) {
    return handleNeuralError(error);
  }
};

export const auditDependencies = async (packageData: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: CORE_MODEL,
      contents: `Perform a security audit on these dependencies and look for known CVEs:\n\n${packageData}`,
      config: {
        systemInstruction: MASTER_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  library: { type: Type.STRING },
                  version: { type: Type.STRING },
                  risk: { type: Type.STRING },
                  description: { type: Type.STRING },
                  fix: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    return handleNeuralError(error);
  }
};

export const codeTranspiler = async (code: string, targetLanguage: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: CORE_MODEL,
      contents: `Transpile to ${targetLanguage}:\n\n${code}`,
      config: { systemInstruction: MASTER_PROMPT }
    });
    return response.text;
  } catch (error: any) {
    return handleNeuralError(error);
  }
};

export const analyzeAndFixCode = async (code: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: CORE_MODEL,
      contents: `Audit and optimize: \n\n${code}`,
      config: {
        systemInstruction: MASTER_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING },
            summary: { type: Type.STRING },
            findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["severity", "summary", "findings", "recommendations"]
        }
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    return handleNeuralError(error);
  }
};

export const generateScript = async (prompt: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: CORE_MODEL,
      contents: `Generate script for: ${prompt}`,
      config: { systemInstruction: MASTER_PROMPT },
    });
    return response.text;
  } catch (error: any) {
    return handleNeuralError(error);
  }
};

export const executeIntelligenceModule = async (moduleId: string, input: string) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: CORE_MODEL,
      contents: `Module: ${moduleId}\nInput: ${input}`,
      config: { systemInstruction: MASTER_PROMPT }
    });
    return response.text;
  } catch (error: any) {
    return handleNeuralError(error);
  }
}