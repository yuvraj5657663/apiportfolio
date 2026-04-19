import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';
import path from 'path';

export const portfolioController = {
  getResume: (req: Request, res: Response) => {
    // Assuming resume is stored in public/resume.pdf or similar
    // For now, we can redirect or send a static file
    const resumePath = path.join(process.cwd(), 'public', 'resume.pdf');
    res.download(resumePath, 'Yuvraj_Kumar_Resume.pdf', (err) => {
      if (err) {
        // Fallback if file doesn't exist
        sendSuccess(res, 'Resume URL fetched', { url: '/resume.pdf' });
      }
    });
  },

  getSkills: (req: Request, res: Response) => {
    const skills = [
      { category: 'Languages', items: ['JavaScript', 'TypeScript', 'SQL'] },
      { category: 'Frontend', items: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Zustand', 'TanStack Query'] },
      { category: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs'] },
      { category: 'Databases', items: ['MongoDB', 'MySQL'] },
      { category: 'Tools', items: ['Git', 'GitHub', 'Postman', 'Figma', 'Vercel'] },
    ];
    sendSuccess(res, 'Skills fetched successfully', skills);
  },

  getExperience: (req: Request, res: Response) => {
    const experience = [
      {
        company: 'Wayspire',
        role: 'Full Stack Developer Intern',
        location: 'Remote',
        date: 'June 2024 – Aug 2024',
        achievements: [
          'Built full-stack applications using React.js and Node.js.',
          'Improved overall system performance by 20%.',
          'Reduced page load time by 30% through optimized rendering.',
          'Developed and integrated scalable REST APIs.',
          'Collaborated effectively in an agile team environment.',
        ],
      }
    ];
    sendSuccess(res, 'Experience fetched successfully', experience);
  }
};
