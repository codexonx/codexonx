import express, { json } from 'express';
import request from 'supertest';

import prisma from '../lib/prisma';
import { isCaptchaEnabled, verifyCaptchaToken } from '../utils/captcha';
import { sendEmail } from '../utils/email';
import { sendSlackNotification } from '../utils/slack';

import { createContactRequest } from './contact';

jest.mock('../utils/captcha', () => ({
  isCaptchaEnabled: jest.fn(),
  verifyCaptchaToken: jest.fn(),
}));

jest.mock('../utils/email', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('../utils/slack', () => ({
  sendSlackNotification: jest.fn(),
}));

describe('Contact Controller', () => {
  let app: express.Application;

  const mockedIsCaptchaEnabled = isCaptchaEnabled as jest.MockedFunction<typeof isCaptchaEnabled>;
  const mockedVerifyCaptchaToken = verifyCaptchaToken as jest.MockedFunction<
    typeof verifyCaptchaToken
  >;
  const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
  const mockedSendSlack = sendSlackNotification as jest.MockedFunction<typeof sendSlackNotification>;

  beforeAll(() => {
    app = express();
    app.use(json());
    app.post('/api/contact', createContactRequest);
    app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const statusCode = error?.statusCode ?? 500;
      res.status(statusCode).json({
        status: 'error',
        message: error?.message ?? 'Internal Server Error',
      });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsCaptchaEnabled.mockReturnValue(false);
    mockedVerifyCaptchaToken.mockResolvedValue({ success: true, provider: null });
    mockedSendEmail.mockResolvedValue();
    mockedSendSlack.mockResolvedValue();
    process.env.CONTACT_SLACK_WEBHOOK_URL = '';
  });

  const validPayload = {
    fullName: 'Test Kullanıcı',
    email: 'test@example.com',
    company: 'Test Şirketi',
    topic: 'demo',
    message: 'Bu bir test mesajıdır ve yirmi karakterden uzundur.',
    consent: true,
    referrer: 'https://example.com',
  };

  it('creates a contact request when captcha is disabled', async () => {
    const contactRecord = {
      id: 'contact-1',
      fullName: validPayload.fullName,
      email: validPayload.email,
      company: validPayload.company,
      topic: 'DEMO',
      message: validPayload.message,
      consent: true,
      status: 'OPEN',
      referrer: validPayload.referrer,
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      notifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.contactRequest.create as jest.Mock).mockResolvedValue(contactRecord);

    const response = await request(app).post('/api/contact').send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'success',
    });
    expect(prisma.contactRequest.create).toHaveBeenCalled();
    expect(mockedSendEmail).toHaveBeenCalled();
  });

  it('returns 400 when captcha verification fails', async () => {
    mockedIsCaptchaEnabled.mockReturnValue(true);
    mockedVerifyCaptchaToken.mockResolvedValue({
      success: false,
      provider: 'hcaptcha',
      errorCodes: ['invalid-input-response'],
    });

    const response = await request(app)
      .post('/api/contact')
      .send({ ...validPayload, captchaToken: 'invalid-token' });

    expect(response.status).toBe(400);
    expect(prisma.contactRequest.create).not.toHaveBeenCalled();
  });

  it('creates a contact request when captcha verification succeeds', async () => {
    mockedIsCaptchaEnabled.mockReturnValue(true);
    mockedVerifyCaptchaToken.mockResolvedValue({
      success: true,
      provider: 'turnstile',
    });

    const contactRecord = {
      id: 'contact-2',
      fullName: validPayload.fullName,
      email: validPayload.email,
      company: validPayload.company,
      topic: 'DEMO',
      message: validPayload.message,
      consent: true,
      status: 'OPEN',
      referrer: validPayload.referrer,
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      notifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.contactRequest.create as jest.Mock).mockResolvedValue(contactRecord);

    const response = await request(app)
      .post('/api/contact')
      .send({ ...validPayload, captchaToken: 'valid-token' });

    expect(response.status).toBe(201);
    expect(prisma.contactRequest.create).toHaveBeenCalled();
    expect(mockedVerifyCaptchaToken).toHaveBeenCalledWith('valid-token', expect.any(String));
  });

  it('sends Slack notification when webhook is configured', async () => {
    process.env.CONTACT_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/test';

    const contactRecord = {
      id: 'contact-3',
      fullName: validPayload.fullName,
      email: validPayload.email,
      company: validPayload.company,
      topic: 'DEMO',
      message: validPayload.message,
      consent: true,
      status: 'OPEN',
      referrer: validPayload.referrer,
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      notifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.contactRequest.create as jest.Mock).mockResolvedValue(contactRecord);
    (prisma.contactRequest.update as jest.Mock).mockResolvedValue({
      ...contactRecord,
      notifiedAt: new Date(),
    });

    const response = await request(app).post('/api/contact').send(validPayload);

    expect(response.status).toBe(201);
    expect(mockedSendSlack).toHaveBeenCalledWith(
      expect.objectContaining({
        webhookUrl: process.env.CONTACT_SLACK_WEBHOOK_URL,
        text: expect.stringContaining('Yeni iletişim talebi'),
      })
    );
    expect(prisma.contactRequest.update).toHaveBeenCalledWith({
      where: { id: contactRecord.id },
      data: { notifiedAt: expect.any(Date) },
    });
  });

  it('continues gracefully when Slack notification fails', async () => {
    process.env.CONTACT_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/test';
    mockedSendSlack.mockRejectedValueOnce(new Error('Slack failed'));

    const contactRecord = {
      id: 'contact-4',
      fullName: validPayload.fullName,
      email: validPayload.email,
      company: validPayload.company,
      topic: 'DEMO',
      message: validPayload.message,
      consent: true,
      status: 'OPEN',
      referrer: validPayload.referrer,
      ipAddress: '127.0.0.1',
      userAgent: 'jest-test',
      notifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.contactRequest.create as jest.Mock).mockResolvedValue(contactRecord);

    const response = await request(app).post('/api/contact').send(validPayload);

    expect(response.status).toBe(201);
    expect(mockedSendSlack).toHaveBeenCalled();
    expect(prisma.contactRequest.update).not.toHaveBeenCalled();
  });
});
