import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Abonelik oluşturma şeması
const createSubscriptionSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string(),
  status: z.enum(['active', 'canceled', 'expired', 'trial']).default('active'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethodId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
});

// Abonelik güncelleme şeması
const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  status: z.enum(['active', 'canceled', 'expired', 'trial']).optional(),
  endDate: z.date().optional(),
  paymentMethodId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
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
    console.error('Abonelikleri getirme hatası:', error);
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
    console.error('Abonelik getirme hatası:', error);
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

    const { userId, planId, status, startDate, endDate, paymentMethodId, stripeSubscriptionId } =
      validationResult.data;

    // Kullanıcının mevcut aktif aboneliğini kontrol et
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
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
        userId,
        planId,
        status,
        startDate: startDate || new Date(),
        endDate,
        paymentMethodId,
        stripeSubscriptionId,
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
    console.error('Abonelik oluşturma hatası:', error);
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

    // Aboneliği güncelle
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: validationResult.data,
      include: {
        plan: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedSubscription,
    });
  } catch (error: any) {
    console.error('Abonelik güncelleme hatası:', error);
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
        status: 'canceled',
        endDate: new Date(),
      },
    });

    // Stripe aboneliği varsa, orada da iptal et
    if (existingSubscription.stripeSubscriptionId) {
      // Stripe iptal işlemi burada yapılacak
      // Bu kısım payments controller'ındaki cancelSubscription fonksiyonu ile yapılabilir
    }

    return res.status(200).json({
      success: true,
      data: canceledSubscription,
    });
  } catch (error: any) {
    console.error('Abonelik iptal hatası:', error);
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
        status: 'active',
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
    console.error('Abonelik kontrolü hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};
