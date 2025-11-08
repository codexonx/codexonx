import { logger } from './logger';

type SlackMessage = {
  webhookUrl: string;
  text: string;
  blocks?: unknown[];
};

export const sendSlackNotification = async ({ webhookUrl, text, blocks }: SlackMessage) => {
  if (!webhookUrl) {
    logger.warn('Slack webhook URL eksik, bildirim gönderilmedi.');
    return;
  }

  try {
    const payload = {
      text,
      ...(blocks ? { blocks } : {}),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack webhook hatası: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    logger.error('Slack bildirimi gönderilemedi', error);
    throw error;
  }
};
