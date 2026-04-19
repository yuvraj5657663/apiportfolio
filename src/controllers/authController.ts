import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const admin: any = await Admin.findOne({ email });

      if (admin && (await admin.matchPassword(password))) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', {
          expiresIn: '30d',
        });

        sendSuccess(res, 'Login successful', {
          _id: admin._id,
          email: admin.email,
          token,
        });
      } else {
        if (process.env.NODE_ENV === 'development') {
           console.log(`[AUTH] Login failed for: ${email}`);
           if (!admin) console.log('[AUTH] Reason: User not found');
           else console.log('[AUTH] Reason: Password incorrect');
        }
        sendError(res, 'Invalid email or password', 401);
      }
    } catch (error) {
      sendError(res, 'Login failed', 500, error);
    }
  }
};
