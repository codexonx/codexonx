import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

const waitlistSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  teamSize: z.string().min(1, 'Ekip büyüklüğü alanı zorunludur'),
});

export const createWaitlistEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = waitlistSchema.parse(req.body);

    const existing = await prisma.waitlistEntry.findUnique({
      where: { email: payload.email },
    });

    if (existing) {
      return res.status(200).json({
        status: 'success',
        message: 'Bu e-posta zaten bekleme listesinde',
      });
    }

    await prisma.waitlistEntry.create({
      data: payload,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Bekleme listesine başarıyla eklendi',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message ?? 'Geçersiz istek', 400));
    }

    return next(error);
  }
};
