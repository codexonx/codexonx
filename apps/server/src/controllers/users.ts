import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır').optional(),
});

// Get current user
export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

// Update current user
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { name } = updateUserSchema.parse(req.body);

    // Don't allow password updates through this route
    if (req.body.password) {
      return next(
        new AppError(
          'Bu route şifre güncellemek için kullanılamaz. Lütfen /update-password kullanın.',
          400
        )
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name,
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN ONLY ROUTES

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: true,
      },
    });

    if (!user) {
      return next(new AppError('Bu ID ile kullanıcı bulunamadı', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, role, emailVerified } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      return next(new AppError('Bu ID ile kullanıcı bulunamadı', 404));
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        role,
        emailVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      return next(new AppError('Bu ID ile kullanıcı bulunamadı', 404));
    }

    // Delete user (Prisma cascade will handle related records)
    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
