import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

// Define a User type for better typing
type User = {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
};

// Extended Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Giriş yapmadınız. Lütfen giriş yapın.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as any;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AppError("Bu token'a sahip kullanıcı artık mevcut değil.", 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Geçersiz token. Lütfen tekrar giriş yapın.', 401));
  }
};

// Middleware to restrict access to admin only
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Giriş yapmadınız. Lütfen giriş yapın.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Bu işlemi gerçekleştirmek için yetkiniz yok.', 403));
    }

    next();
  };
};
