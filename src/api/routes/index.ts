import { Router, Request, Response } from 'express';
import { contactController } from '../../controllers/contactController.js';
import { projectController } from '../../controllers/projectController.js';
import { authController } from '../../controllers/authController.js';
import { analyticsController } from '../../controllers/analyticsController.js';
import { portfolioController } from '../../controllers/portfolioController.js';
import { aiController } from '../../controllers/aiController.js';
import { protect } from '../../middleware/auth.js';
import { contactLimiter, apiLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Public Routes
router.post('/contact', contactLimiter, contactController.submitContact);
router.get('/resume', apiLimiter, portfolioController.getResume);
router.get('/projects', apiLimiter, projectController.getProjects);
router.get('/skills', apiLimiter, portfolioController.getSkills);
router.get('/experience', apiLimiter, portfolioController.getExperience);
router.post('/visit', apiLimiter, analyticsController.recordVisit);

// AI Route (Skeleton)
router.post('/chat', apiLimiter, aiController.chat);

// Admin Auth
router.post('/auth/login', authController.login);

// Protected Admin Routes
router.get('/admin/contacts', contactController.getContacts);
router.delete('/admin/contacts/:id', contactController.deleteContact);
router.patch('/admin/contacts/:id', contactController.updateContactStatus);
router.get('/admin/projects', projectController.getAllProjects);
router.post('/admin/projects', projectController.addProject);
router.put('/admin/projects/:id', projectController.updateProject);
router.delete('/admin/projects/:id', projectController.deleteProject);
router.get('/admin/visits', analyticsController.getVisits);

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

export default router;
