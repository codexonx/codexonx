// Jest test setup file
import { Request, Response, NextFunction } from 'express';

// Mock modules
jest.mock('../lib/prisma', () => {
  return {
    __esModule: true,
    default: {
      project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      subscription: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      plan: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    },
  };
});

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';

// Mock middleware for authentication
jest.mock('../middlewares/auth', () => {
  return {
    protect: jest.fn((req: Request, res: Response, next: NextFunction) => {
      req.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
        workspaces: [],
      };
      next();
    }),
    restrictTo: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
      next();
    }),
  };
});
