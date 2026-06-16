import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION } from './portfolioContext';

const apiKey = process.env.GEMINI_API_KEY || '';
export const isGeminiConfigured = !!(apiKey && apiKey !== 'your-gemini-api-key');

// Initialize Gemini SDK if configured
const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey) : null;

// Rule-based fallback response engine for offline testing
function getMockVrajResponse(prompt: string): string {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('project') || normalized.includes('work') || normalized.includes('build')) {
    return `Vraj has built 10 major systems across ERPs, E-commerce, AI automation, and Quant Finance. Key highlights include:
- **Enermass Solar Calculator & ERP**: Features 99.4% solar forecast accuracy and offloads calculations to GPU WebGL shaders.
- **ConstructionOS**: A Go/Next.js ERP that utilizes offline-first synced CRDTs for field engineers.
- **NF-LRD Platform**: A Nifty 50 market regime discovery model built using Hidden Markov Models.
Visit the '/projects' tab for the full list of case studies.`;
  }

  if (normalized.includes('resume') || normalized.includes('cv') || normalized.includes('education') || normalized.includes('university') || normalized.includes('nirma')) {
    return `Vraj is a 4th-year B.Tech CSE student at Nirma University (graduating in 2026). He has a CGPA of 7.98, has maintained strong academic records, and possesses deep full-stack architecture skills. You can view, interact with, and print Vraj's full A4 resume on the '/resume' page.`;
  }

  if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('hire') || normalized.includes('message') || normalized.includes('phone') || normalized.includes('mail')) {
    return `You can contact Vraj directly by sending a message on the '/contact' page, emailing him at patelvrajpatel30@gmail.com, or calling him at +91 79902 51191. He is currently looking for Full-Stack Developer and Quant Research roles.`;
  }

  if (normalized.includes('skill') || normalized.includes('tech') || normalized.includes('stack') || normalized.includes('languages')) {
    return `Vraj's technology stack spans:
- **Languages**: TypeScript, JavaScript, Go (Golang), Python, C++, SQL.
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Three.js, Recharts, Redux Toolkit.
- **Backend & APIs**: Node.js, Express, Go microservices, FastAPI, gRPC, REST.
- **Databases**: PostgreSQL, Redis, Supabase, MongoDB.
- **AI/Quant**: Gemini API, LangChain, Black-Scholes WASM modeling, and Python Pandas/Scikit-learn.`;
  }

  if (normalized.includes('quant') || normalized.includes('finance') || normalized.includes('bitcoin') || normalized.includes('volatility') || normalized.includes('regime')) {
    return `Vraj is heavily interested in Quant Research. He has built:
1. **NF-LRD**: A NIFTY 50 Regime Discovery platform using Python, Scikit-learn, and FastAPI.
2. **MSPE**: A WebAssembly (C++) option Greeks calculator & 3D implied volatility surface visualizer.
3. **BTC-ALGO**: A WebSocket Bitcoin trading dashboard with risk-management checks.
Check these out in the '/lab' page for live calculations!`;
  }

  if (normalized.includes('ai') || normalized.includes('automation') || normalized.includes('email') || normalized.includes('agent')) {
    return `Vraj builds autonomous AI solutions. One of his key projects is the **AI Cold Email Automation System** which uses the Gemini API with structured JSON outputs (via Zod) to crawl leads, personalize outbound emails, and sequence messages while dodging spam filters.`;
  }

  return `Vraj's AI Agent here! I can tell you about Vraj's experiences building enterprise ERP systems, AI integrations, quant tools, and e-commerce architectures. Ask me about his projects, skills, university background, or visit the '/resume' page to see his experience.`;
}

// Helper to return a mock stream
export function getMockVrajResponseStream(prompt: string): ReadableStream<Uint8Array> {
  const fullText = getMockVrajResponse(prompt);
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
    console.error('Gemini API call failed:', error);
    return `[Gemini Error]: ${error instanceof Error ? error.message : 'Unknown error'}. Fallback info: Vraj Patel is a CSE student at Nirma University specialized in Next.js, Go, and Quant models.`;
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
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history.slice(-10),
    });

    const result = await chat.sendMessageStream(prompt);
    return result;
  } catch (error) {
    console.error('Gemini Stream initiation failed:', error);
    throw error;
  }
}

