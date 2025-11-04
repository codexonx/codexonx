import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err } as any;
  error.message = err.message;

  // Log error
  console.error('ERROR 💥', err);

  // Specific error handling
  if (err.name === 'ValidationError') {
    error = new AppError('Invalid input data', 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  // Prisma errors
  if ((err as any).code === 'P2002') {
    error = new AppError('A record with this field already exists', 409);
  }

  if ((err as any).code === 'P2025') {
    error = new AppError('Record not found', 404);
  }

  // Send error response
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // For unknown errors
  console.error('Unknown error:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
