import { randomUUID } from 'node:crypto';

import { ContactRequestStatus, ContactTopic } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { isCaptchaEnabled, verifyCaptchaToken } from '../utils/captcha';
import { sendEmail } from '../utils/email';
import { logger } from '../utils/logger';
import { sendSlackNotification } from '../utils/slack';

const topicMapping: Record<string, ContactTopic> = {
  demo: ContactTopic.DEMO,
  sales: ContactTopic.SALES,
  support: ContactTopic.SUPPORT,
  partnership: ContactTopic.PARTNERSHIP,
  press: ContactTopic.PRESS,
  other: ContactTopic.OTHER,
};

const topicLabelMapping: Record<ContactTopic, string> = {
  [ContactTopic.DEMO]: 'Canlı Demo',
  [ContactTopic.SALES]: 'Satış',
  [ContactTopic.SUPPORT]: 'Teknik Destek',
  [ContactTopic.PARTNERSHIP]: 'İş Ortaklığı',
  [ContactTopic.PRESS]: 'Basın & Medya',
  [ContactTopic.OTHER]: 'Diğer',
};

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Adınız en az 2 karakter olmalıdır'),
  email: z.string().trim().email('Geçerli bir e-posta adresi girin'),
  company: z.string().trim().max(120).optional(),
  topic: z
    .string()
    .transform(value => value.toLowerCase())
    .refine(value => value in topicMapping, 'Geçerli bir konu seçin')
    .transform(value => topicMapping[value]),
  message: z.string().trim().min(20, 'Mesajınız en az 20 karakter olmalıdır'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'İletişim izni gereklidir' }),
  }),
  referrer: z.string().trim().optional(),
  captchaToken: z.string().trim().optional(),
});

export const createContactRequest = async (req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  logger.info('İletişim talebi alındı', { requestId });

  try {
    const parsed = contactSchema.parse(req.body);

    if (isCaptchaEnabled()) {
      const { success, errorCodes } = await verifyCaptchaToken(parsed.captchaToken, req.ip);
      if (!success) {
        logger.warn('Captcha doğrulaması başarısız', {
          requestId,
          errorCodes,
        });
        return next(new AppError('Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.', 400));
      }
    }

    const contactRecord = await prisma.contactRequest.create({
      data: {
        fullName: parsed.fullName,
        email: parsed.email,
        company: parsed.company,
        topic: parsed.topic,
        message: parsed.message,
        consent: parsed.consent,
        status: ContactRequestStatus.OPEN,
        referrer: parsed.referrer,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      },
    });

    const topicLabel = topicLabelMapping[parsed.topic];
    const mailSubject = `[Contact] ${topicLabel} – ${parsed.fullName}`;
    const mailBody = `Konu: ${topicLabel}
İsim: ${parsed.fullName}
E-posta: ${parsed.email}
Şirket: ${parsed.company ?? '-'}
Referans: ${parsed.referrer ?? '-'}
IP Adresi: ${contactRecord.ipAddress ?? '-'}
User Agent: ${contactRecord.userAgent ?? '-'}

Mesaj:
${parsed.message}`;

    await sendEmail({
      to: process.env.CONTACT_INBOX ?? 'support@codexonx.com',
      subject: mailSubject,
      text: mailBody,
      html: mailBody.replace(/\n/g, '<br />'),
    });

    logger.info('İletişim talebi kaydedildi ve e-posta gönderildi', { requestId });

    const slackWebhookUrl = process.env.CONTACT_SLACK_WEBHOOK_URL;
    if (slackWebhookUrl) {
      try {
        await sendSlackNotification({
          webhookUrl: slackWebhookUrl,
          text: `Yeni iletişim talebi: ${topicLabel} - ${parsed.fullName} (${parsed.email})`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Yeni iletişim talebi*
• *Konu:* ${topicLabel}
• *İsim:* ${parsed.fullName}
• *E-posta:* ${parsed.email}
• *Şirket:* ${parsed.company ?? '-'}
• *Referans:* ${parsed.referrer ?? '-'}
• *Mesaj:* ${parsed.message}`,
              },
            },
          ],
        });

        await prisma.contactRequest.update({
          where: { id: contactRecord.id },
          data: { notifiedAt: new Date() },
        });

        logger.info('Slack bildirimi gönderildi', { requestId });
      } catch (slackError) {
        logger.error('Slack bildirimi gönderilemedi', { requestId, slackError });
      }
    }

    return res.status(201).json({
      status: 'success',
      message: 'Talebiniz alındı. Ekibimiz kısa süre içinde dönüş yapacak.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message ?? 'Geçersiz istek', 400));
    }

    logger.error('İletişim talebi oluşturulurken hata oluştu', { requestId, error });
    return next(error);
  }
};
