import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION } from './portfolioContext';

const apiKey = process.env.GEMINI_API_KEY || '';
export const isGeminiConfigured = !!(apiKey && apiKey !== 'your-gemini-api-key');

// Initialize Gemini SDK if configured
const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey) : null;

// Rule-based fallback response engine for offline testing
function getMockVrajResponse(_prompt: string): string {
  return "AI assistant is temporarily unavailable. You can still view Vraj’s projects, skills, and resume on the portfolio.";
}

// Helper to return a mock stream
export function getMockVrajResponseStream(_prompt: string): ReadableStream<Uint8Array> {
  const fullText = "AI assistant is temporarily unavailable. You can still view Vraj’s projects, skills, and resume on the portfolio.";
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
  if (!isGeminiConfigured || !genAI) {
    // Graceful fallback to simulated intelligence
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockVrajResponse(prompt));
      }, 800);
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history.slice(-10), // Limit history to last 10 messages to save context/token limits
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    return text || "I couldn't process that query. Please check back later.";
  } catch (error) {
    console.error('Gemini API call failed, falling back to mock response:', error);
    return getMockVrajResponse(prompt);
  }
}

// Main streaming API caller
export async function askVrajAIStream(
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
  if (!isGeminiConfigured || !genAI) {
    return getMockVrajResponseStream(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history.slice(-10),
    });

    const result = await chat.sendMessageStream(prompt);
    return result;
  } catch (error) {
    console.error('Gemini Stream initiation failed, falling back to mock stream:', error);
    return getMockVrajResponseStream(prompt);
  }
}

