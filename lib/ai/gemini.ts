import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './portfolioContext';

// Client-side execution protection
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  throw new Error('This module can only be executed on the server.');
}

const apiKey = process.env.GEMINI_API_KEY || '';
export const isGeminiConfigured = !!(apiKey && apiKey !== 'your-gemini-api-key');

// Model selection is centralized in one configuration constant
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

// Initialize the new GoogleGenAI client if configured
const aiClient = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

// Rule-based fallback response engine for offline testing
// Removed any fictional claims
function getMockVrajResponse(_prompt: string): string {
  return "I'm sorry, but I can't access live Gemini models right now. You can explore Vraj's portfolio directly to view his projects, skills, and resume.";
}

// Helper to return a mock stream
// Removed any fictional claims
export function getMockVrajResponseStream(_prompt: string): ReadableStream<Uint8Array> {
  const fullText = "I'm sorry, but I can't access live Gemini models right now. You can explore Vraj's portfolio directly to view his projects, skills, and resume.";
  const encoder = new TextEncoder();
  const chunks = fullText.split(/(\s+)/);

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30));
      }
      controller.close();
    }
  });
}

export async function askVrajAI(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): Promise<string> {
  if (!isGeminiConfigured || !aiClient) {
    // Graceful fallback to simulated intelligence
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockVrajResponse(prompt));
      }, 800);
    });
  }

  try {
    // Standardize history format for @google/genai chats.create
    const formattedHistory = (history || []).slice(-10).map((h) => ({
      role: h.role,
      parts: h.parts.map((p) => ({ text: p.text })),
    }));

    const chat = aiClient.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({
      message: prompt,
    });

    return result.text || "I couldn't process that query. Please check back later.";
  } catch (error) {
    console.error('Gemini API call failed, falling back to mock response:', error);
    return getMockVrajResponse(prompt);
  }
}

// Main streaming API caller using the new @google/genai SDK
export async function askVrajAIStream(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
  if (!isGeminiConfigured || !aiClient) {
    return getMockVrajResponseStream(prompt);
  }

  try {
    // Standardize history format for @google/genai chats.create
    const formattedHistory = (history || []).slice(-10).map((h) => ({
      role: h.role,
      parts: h.parts.map((p) => ({ text: p.text })),
    }));

    const chat = aiClient.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      },
      history: formattedHistory,
    });

    const resultStream = await chat.sendMessageStream({
      message: prompt,
    });

    return resultStream;
  } catch (error) {
    console.error('Gemini Stream initiation failed, falling back to mock stream:', error);
    return getMockVrajResponseStream(prompt);
  }
}
