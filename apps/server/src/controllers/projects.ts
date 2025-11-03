import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

// Validation schemas
const projectSchema = z.object({
  name: z.string().min(2, 'Proje adı en az 2 karakter olmalıdır'),
  description: z.string().optional()
});

// Get all projects for current user
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id
      }
    });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get single project
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!project) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Check if user owns the project
    if (project.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Bu projeye erişim yetkiniz yok', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create new project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = projectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: req.user.id,
        apiKey: uuidv4()
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update project
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = projectSchema.parse(req.body);

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Check if user owns the project
    if (existingProject.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Bu projeyi düzenleme yetkiniz yok', 403));
    }

    // Update project
    const project = await prisma.project.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Check if user owns the project
    if (existingProject.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Bu projeyi silme yetkiniz yok', 403));
    }

    // Delete project
    await prisma.project.delete({
      where: {
        id
      }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// Regenerate API key
export const regenerateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Find project first to check ownership
    const existingProject = await prisma.project.findUnique({
      where: {
        id
      }
    });

    if (!existingProject) {
      return next(new AppError('Proje bulunamadı', 404));
    }

    // Check if user owns the project
    if (existingProject.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Bu projenin API anahtarını yenileme yetkiniz yok', 403));
    }

    // Update project with new API key
    const project = await prisma.project.update({
      where: {
        id
      },
      data: {
        apiKey: uuidv4()
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};
