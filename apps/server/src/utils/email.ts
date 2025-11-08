import { createTransport } from 'nodemailer';

import { AppError } from '../middlewares/errorHandler';

import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      logger.warn('SMTP yapılandırması eksik, e-posta gönderme atlandı.');
      logger.debug('Gönderilmesi istenen e-posta:', options);
      return;
    }

    // Create transporter
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@codexonx.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('E-posta gönderilirken hata oluştu:', error);
    throw new AppError('E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.', 500);
  }
};
