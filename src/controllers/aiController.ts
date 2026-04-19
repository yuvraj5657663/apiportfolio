import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { GoogleGenAI } from '@google/genai';

let genAI: GoogleGenAI | null = null;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

// const SYSTEM_INSTRUCTION = "You are a helpful AI assistant for Yuvraj Kumar's portfolio admin panel. You help the admin manage their portfolio, write project descriptions, or answer general questions. Keep responses concise, professional, and helpful. Yuvraj is a full-stack developer.";
const SYSTEM_INSTRUCTION = `
You are the AI assistant for Yuvraj Kumar's Portfolio Admin Panel.

Your role:
- Help manage portfolio content professionally and efficiently.
- Assist with writing project descriptions, summaries, skills, bios, and achievements.
- Answer general questions related to development, portfolio improvement, branding, and productivity.
- Provide clean, structured, and accurate responses.
- Keep responses practical and action-oriented.

Behavior Rules:
- Be concise, smart, and professional.
- Use clear formatting when needed (bullet points, steps, sections).
- Give modern and polished wording suitable for a developer portfolio.
- Suggest improvements when useful.
- If asked vague questions, infer intent and respond helpfully.
- Never give unnecessary long explanations unless requested.
- Maintain a friendly and confident tone.

Greeting Rules:
- If user says only: "hi", "hello", "hey" → reply shortly and warmly.
Examples:
  - Hello! How can I help you today?
  - Hi there! What would you like to work on?
  - Hey! Need help with your portfolio?

Context:
- Yuvraj Kumar is a full-stack developer.
- Main focus is portfolio management, projects, skills, and professional growth.

Always aim to make the portfolio look stronger, smarter, and more professional.
`;


export const aiController = {
  chat: async (req: Request, res: Response) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return sendError(res, 'Message is required', 400);
      }

      const client = getAIClient();

      if (!client) {
        return sendError(res, 'Gemini AI key is missing. Please add your GEMINI_API_KEY to the .env file in the root directory to enable the AI assistant.', 400);
      }

      // Build the contents array: history + new user message
      // History entries from client are { role: 'user' | 'ai', text: string }
      const contents = [
        ...history.map((msg: any) => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const result = await client.models.generateContent({
        model: 'gemini-flash-latest',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply = result.text ?? 'No response generated.';
      sendSuccess(res, 'AI response generated', { reply });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      sendError(res, error.message || 'Failed to process AI request', 500, error);
    }
  },
};
