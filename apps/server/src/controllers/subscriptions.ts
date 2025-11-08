import { Prisma, SubStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';

import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

const statusSchema = z
  .string()
  .transform(value => value.toUpperCase())
  .pipe(z.nativeEnum(SubStatus));

// Abonelik oluşturma şeması
const createSubscriptionSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string(),
  status: statusSchema.default(SubStatus.ACTIVE),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Abonelik güncelleme şeması
const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  status: statusSchema.optional(),
  endDate: z.coerce.date().nullable().optional(),
});

/**
 * Kullanıcıya ait tüm abonelikleri getir
 */
export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    // req.user, auth middleware'den gelen kullanıcı bilgisi
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Oturum geçersiz' });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    logger.error('Abonelikleri getirme hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Belirli bir aboneliği getir
 */
export const getSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Oturum geçersiz' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        id,
        userId, // Sadece kullanıcıya ait abonelikleri görüntüleyebilir
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Abonelik bulunamadı' });
    }

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    logger.error('Abonelik getirme hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Yeni abonelik oluştur
 */
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const validationResult = createSubscriptionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { userId, planId, status, startDate, endDate } = validationResult.data;

    // Kullanıcının mevcut aktif aboneliğini kontrol et
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Kullanıcının zaten aktif bir aboneliği var' });
    }

    // Plan bilgilerini kontrol et
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan bulunamadı' });
    }

    // Yeni abonelik oluştur
    const newSubscription = await prisma.subscription.create({
      data: {
        user: {
          connect: { id: userId },
        },
        plan: {
          connect: { id: planId },
        },
        status,
        startDate: startDate || new Date(),
        endDate,
      },
      include: {
        plan: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: newSubscription,
    });
  } catch (error: any) {
    logger.error('Abonelik oluşturma hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Abonelik güncelle
 */
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Oturum geçersiz' });
    }

    const validationResult = updateSubscriptionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    // Güncellenecek aboneliği kontrol et
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
        userId, // Sadece kullanıcıya ait abonelikleri güncelleyebilir
      },
    });

    if (!existingSubscription) {
      return res.status(404).json({ error: 'Abonelik bulunamadı' });
    }

    const { planId, status, endDate } = validationResult.data;

    const updateData: Prisma.SubscriptionUpdateInput = {};

    if (planId) {
      updateData.plan = {
        connect: { id: planId },
      };
    }

    if (status) {
      updateData.status = status;
    }

    if (endDate !== undefined) {
      updateData.endDate = endDate;
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        plan: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedSubscription,
    });
  } catch (error: any) {
    logger.error('Abonelik güncelleme hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Abonelik iptal et
 */
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Oturum geçersiz' });
    }

    // İptal edilecek aboneliği kontrol et
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id,
        userId, // Sadece kullanıcıya ait abonelikleri iptal edebilir
      },
    });

    if (!existingSubscription) {
      return res.status(404).json({ error: 'Abonelik bulunamadı' });
    }

    // Aboneliği iptal et (durumunu güncelle)
    const canceledSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: SubStatus.CANCELED,
        endDate: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: canceledSubscription,
    });
  } catch (error: any) {
    logger.error('Abonelik iptal hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Kullanıcının aktif aboneliğini kontrol et
 */
export const checkActiveSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Oturum geçersiz' });
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubStatus.ACTIVE,
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
      },
      include: {
        plan: true,
      },
    });

    return res.status(200).json({
      success: true,
      hasActiveSubscription: !!activeSubscription,
      data: activeSubscription,
    });
  } catch (error: any) {
    logger.error('Abonelik kontrolü hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};
