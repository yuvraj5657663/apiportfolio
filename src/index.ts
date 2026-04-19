import app from './app.js';
import { connectDB } from './config/db.js';

// Vercel serverless entry point
export default async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
