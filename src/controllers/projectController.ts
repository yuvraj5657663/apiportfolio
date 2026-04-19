import { Request, Response } from 'express';
import { Project } from '../models/Projects.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const projectController = {
  getProjects: async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
      sendSuccess(res, 'Projects fetched successfully', projects);
    } catch (error) {
      sendError(res, 'Failed to fetch projects', 500, error);
    }
  },

  getAllProjects: async (req: Request, res: Response) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      sendSuccess(res, 'All projects fetched successfully', projects);
    } catch (error) {
      sendError(res, 'Failed to fetch all projects', 500, error);
    }
  },

  addProject: async (req: Request, res: Response) => {
    try {
      const project = await Project.create(req.body);
      sendSuccess(res, 'Project added successfully', project, 201);
    } catch (error) {
      sendError(res, 'Failed to add project', 500, error);
    }
  },

  updateProject: async (req: Request, res: Response) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!project) return sendError(res, 'Project not found', 404);
      sendSuccess(res, 'Project updated successfully', project);
    } catch (error) {
      sendError(res, 'Failed to update project', 500, error);
    }
  },

  deleteProject: async (req: Request, res: Response) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) return sendError(res, 'Project not found', 404);
      sendSuccess(res, 'Project deleted successfully');
    } catch (error) {
      sendError(res, 'Failed to delete project', 500, error);
    }
  }
};
