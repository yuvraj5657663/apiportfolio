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

const SYSTEM_INSTRUCTION = "You are a helpful AI assistant for Yuvraj Kumar's portfolio admin panel. You help the admin manage their portfolio, write project descriptions, or answer general questions. Keep responses concise, professional, and helpful. Yuvraj is a full-stack developer.";

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
