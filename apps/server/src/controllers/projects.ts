import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

// Validation schemas
const projectSchema = z.object({
  name: z.string().min(2, 'Proje adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'INTERNAL', 'PUBLIC']).optional(),
});

const ensureAuthenticatedUser = (req: Request, next: NextFunction) => {
  if (!req.user) {
    next(new AppError('Kullanıcı bilgisi bulunamadı', 401));
    return null;
  }
  return req.user;
};

const ensureActiveWorkspace = (req: Request, next: NextFunction) => {
  const user = ensureAuthenticatedUser(req, next);
  if (!user) {
    return null;
  }

  if (!user.activeWorkspace) {
    next(new AppError('İşlem yapabilmek için bir çalışma alanı seçmelisiniz.', 400));
    return null;
  }

  return user.activeWorkspace;
};

// Get all projects for current user
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;

    const projects = await prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get single project
export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            description: true,
          },
        },
      },
    });

    if (!project || project.workspaceId !== workspace.id) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    const { workspace: workspaceDetails, ...projectData } = project;

    res.status(200).json({
      status: 'success',
      data: {
        project: {
          ...projectData,
          workspace: workspaceDetails,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create new project
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;

    const parsedBody = projectSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const errors = parsedBody.error.issues.map(issue => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));

      return res.status(400).json({
        status: 'fail',
        errors,
      });
    }

    const { name, description, visibility } = parsedBody.data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        visibility: visibility ?? 'PRIVATE',
        workspaceId: workspace.id,
        createdById: req.user?.id,
        apiKey: uuidv4(),
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update project
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;
    const { id } = req.params;
    const parsedBody = projectSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const errors = parsedBody.error.issues.map(issue => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));

      return res.status(400).json({
        status: 'fail',
        errors,
      });
    }

    const { name, description, visibility } = parsedBody.data;

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        workspaceId: workspace.id,
      },
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Update project
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        visibility: visibility ?? existingProject.visibility,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;
    const { id } = req.params;

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        workspaceId: workspace.id,
      },
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Delete project
    await prisma.project.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Regenerate API key
export const regenerateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = ensureActiveWorkspace(req, next);
    if (!workspace) return;
    const { id } = req.params;

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        workspaceId: workspace.id,
      },
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Update project with new API key
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        apiKey: uuidv4(),
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (err) {
    next(err);
  }
};
