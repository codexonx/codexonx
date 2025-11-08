import { Request, Response } from 'express';
// Stripe entegrasyonu için
import Stripe from 'stripe';
import { z } from 'zod';

import { logger } from '../utils/logger';

// Stripe yapılandırması
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Ödeme doğrulama şeması
const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['usd', 'eur', 'try']),
  description: z.string().optional(),
  paymentMethod: z.string(),
  customerId: z.string().optional(),
});

// Abonelik şeması
const subscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
});

/**
 * Stripe müşterisi oluştur
 */
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email ve isim gereklidir' });
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: req.user?.id || '',
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error: any) {
    logger.error('Müşteri oluşturma hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Payment Intent oluştur
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const validationResult = paymentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { amount, currency, description, paymentMethod, customerId } = validationResult.data;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe kuruş bazında çalışır
      currency,
      description,
      payment_method: paymentMethod,
      customer: customerId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always',
      },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    logger.error('Ödeme oluşturma hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Abonelik oluştur
 */
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const validationResult = subscriptionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { customerId, priceId } = validationResult.data;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // @ts-ignore - Tip hatası olarak görünüyor, ancak Stripe API bu şekilde döndürüyor
    const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

    return res.status(201).json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status,
    });
  } catch (error: any) {
    logger.error('Abonelik oluşturma hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Abonelik iptal et
 */
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Abonelik ID gereklidir' });
    }

    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    return res.status(200).json({
      success: true,
      status: canceledSubscription.status,
      canceledAt: canceledSubscription.canceled_at,
    });
  } catch (error: any) {
    logger.error('Abonelik iptal hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};

/**
 * Webhook işleyicisi
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: 'Webhook imzası veya secret eksik' });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);

    const eventObject = event.data.object;

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = eventObject as Stripe.PaymentIntent;
        logger.info('Başarılı ödeme işlendi', { paymentIntentId: paymentIntent.id });
        // TODO: Veritabanına başarılı ödeme bilgisini kaydet
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = eventObject as Stripe.Invoice;
        logger.info('Fatura ödemesi işlendi', { invoiceId: invoice.id });
        // TODO: Abonelik durumunu güncelle
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = eventObject as Stripe.Subscription;
        logger.info('Abonelik iptal edildi', { subscriptionId: subscription.id });
        // TODO: Kullanıcı abonelik durumunu güncelle
        break;
      }
      default: {
        logger.debug('İşlenmeyen Stripe olayı alındı', { type: event.type });
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Webhook işleme hatası:', error);
    return res.status(400).json({ error: `Webhook hatası: ${error.message}` });
  }
};

/**
 * Fiyat listesi getir
 */
export const getPrices = async (req: Request, res: Response) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    return res.status(200).json({
      success: true,
      data: prices.data,
    });
  } catch (error: any) {
    logger.error('Fiyat listesi hatası:', error);
    return res.status(500).json({ error: error.message || 'Sunucu hatası' });
  }
};
