import { Request, Response } from 'express';
import { Contact } from '../models/Contact.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendEmail } from '../utils/email.js';

export const contactController = {
  submitContact: async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return sendError(res, 'Name, email, and message are required', 400);
      }

      const contact = await Contact.create({ name, email, subject, message });

      // Send notification to admin
      const adminEmail = await sendEmail({
        to: process.env.ADMIN_EMAIL || 'yuvrajkumar4588@gmail.com',
        subject: `New Contact: ${subject || 'Portfolio Message'}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
      });
      if (adminEmail && !adminEmail.sent) {
        console.warn(`[Contact] Admin notification not sent: ${adminEmail.reason}`);
      }

      // Auto-reply to user
      const userEmail = await sendEmail({
        to: email,
        subject: 'Thank you for reaching out!',
        text: `Hi ${name},\n\nI have received your message and will get back to you shortly.\n\nBest regards,\nYuvraj Kumar`,
      });
      if (userEmail && !userEmail.sent) {
        console.warn(`[Contact] Auto-reply not sent to ${email}: ${userEmail.reason}`);
      }

      sendSuccess(res, 'Message sent successfully', contact, 201);
    } catch (error) {
      sendError(res, 'Failed to send message', 500, error);
    }
  },

  getContacts: async (req: Request, res: Response) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      sendSuccess(res, 'Contacts fetched successfully', contacts);
    } catch (error) {
      sendError(res, 'Failed to fetch contacts', 500, error);
    }
  },

  deleteContact: async (req: Request, res: Response) => {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      sendSuccess(res, 'Contact deleted successfully');
    } catch (error) {
      sendError(res, 'Failed to delete contact', 500, error);
    }
  },

  updateContactStatus: async (req: Request, res: Response) => {
    try {
      const { isRead } = req.body;
      const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
      if (!contact) return sendError(res, 'Contact not found', 404);
      sendSuccess(res, 'Contact status updated successfully', contact);
    } catch (error) {
      sendError(res, 'Failed to update contact status', 500, error);
    }
  }
};
