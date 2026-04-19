import { Request, Response } from 'express';
import { Visit } from '../models/Visits.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const analyticsController = {
  recordVisit: async (req: Request, res: Response) => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      // In a real app, you might use an IP geolocation service here
      const visit = await Visit.create({
        ip: typeof ip === 'string' ? ip : 'unknown',
        userAgent,
        country: 'Unknown', // Placeholder for geolocation
        device: userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop'
      });

      sendSuccess(res, 'Visit recorded', visit, 201);
    } catch (error) {
      sendError(res, 'Failed to record visit', 500, error);
    }
  },

  getVisits: async (req: Request, res: Response) => {
    try {
      const count = await Visit.countDocuments();
      const recentVisits = await Visit.find().sort({ createdAt: -1 }).limit(50);
      sendSuccess(res, 'Visits fetched successfully', { count, recentVisits });
    } catch (error) {
      sendError(res, 'Failed to fetch visits', 500, error);
    }
  }
};
