/**
 * AI Kod Kontrolcüsü
 * Yapay zeka kod yazma API endpoint'leri
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import axios from 'axios';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

// AI isteği için validasyon şeması
const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt boş olamaz'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  files: z
    .array(
      z.object({
        name: z.string(),
        content: z.string(),
        language: z.string().optional(),
      })
    )
    .optional(),
  context: z.any().optional(),
});

// Chat isteği için validasyon şeması
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ),
  options: z
    .object({
      temperature: z.number().min(0).max(2).optional(),
      model: z.string().optional(),
      context: z.any().optional(),
    })
    .optional(),
});

// Kod tamamlama isteği için validasyon şeması
const codeCompletionSchema = z.object({
  code: z.string(),
  language: z.string(),
  options: z
    .object({
      temperature: z.number().min(0).max(2).optional(),
      model: z.string().optional(),
    })
    .optional(),
});

/**
 * AI modeline doğrudan sorgu
 */
export const queryAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      prompt,
      model = 'gpt-4o',
      temperature = 0.7,
      maxTokens = 2048,
      files,
      context,
    } = aiRequestSchema.parse(req.body);

    // Gerçek API'ye istek göndermek yerine simüle edilmiş yanıt
    // Gerçek uygulamada OpenAI API'sine istek gönderin
    const simulatedResponse = simulateAIResponse(prompt, files);

    // Kullanım istatistiği ve log
    if (req.user) {
      await prisma.aiRequestLog.create({
        data: {
          userId: req.user.id,
          prompt,
          model,
          tokensUsed: simulatedResponse.length / 4, // Yaklaşık token sayısı
          responseLength: simulatedResponse.length,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        text: simulatedResponse,
        usage: {
          promptTokens: prompt.length / 4,
          completionTokens: simulatedResponse.length / 4,
          totalTokens: (prompt.length + simulatedResponse.length) / 4,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Chat API endpoint'i
 */
export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, options } = chatRequestSchema.parse(req.body);
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    // Gerçek API'ye istek göndermek yerine simüle edilmiş yanıt
    const simulatedResponse = simulateAIResponse(lastUserMessage);

    // Kullanım istatistiği ve log
    if (req.user) {
      await prisma.aiRequestLog.create({
        data: {
          userId: req.user.id,
          prompt: lastUserMessage,
          model: options?.model || 'gpt-4o',
          tokensUsed: simulatedResponse.length / 4,
          responseLength: simulatedResponse.length,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        message: simulatedResponse,
        usage: {
          totalTokens: (lastUserMessage.length + simulatedResponse.length) / 4,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Kod tamamlama endpoint'i
 */
export const completeCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, language, options } = codeCompletionSchema.parse(req.body);
    const prompt = `Aşağıdaki ${language} kodunu tamamla:\n\n${code}`;

    // Gerçek API'ye istek göndermek yerine simüle edilmiş yanıt
    const simulatedResponse = simulateAIResponse(prompt);
    const completedCode = extractCode(simulatedResponse, language);

    // Kullanım istatistiği ve log
    if (req.user) {
      await prisma.aiRequestLog.create({
        data: {
          userId: req.user.id,
          prompt: `Code completion: ${language}`,
          model: options?.model || 'gpt-4o',
          tokensUsed: prompt.length / 4,
          responseLength: completedCode.length,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        code: completedCode,
        usage: {
          totalTokens: (prompt.length + simulatedResponse.length) / 4,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Kod iyileştirme ve optimizasyon endpoint'i
 */
export const improveCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, language, options } = codeCompletionSchema.parse(req.body);
    const prompt = `Aşağıdaki ${language} kodunu analiz et, hataları düzelt ve optimize et. Değişiklikleri açıkla:\n\n${code}`;

    // Gerçek API'ye istek göndermek yerine simüle edilmiş yanıt
    const simulatedResponse = simulateAIResponse(prompt);
    const improvedCode = extractCode(simulatedResponse, language);
    const explanation = extractExplanation(simulatedResponse);

    // Kullanım istatistiği ve log
    if (req.user) {
      await prisma.aiRequestLog.create({
        data: {
          userId: req.user.id,
          prompt: `Code improvement: ${language}`,
          model: options?.model || 'gpt-4o',
          tokensUsed: prompt.length / 4,
          responseLength: improvedCode.length + explanation.length,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        code: improvedCode,
        explanation,
        usage: {
          totalTokens: (prompt.length + simulatedResponse.length) / 4,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * AI kullanım istatistikleri
 * Yönetici veya kendi istatistiklerini görüntüleme
 */
export const getUsageStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    // Yalnızca yöneticiler başkalarının istatistiklerini görüntüleyebilir
    if (userId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('Bu istatistiklere erişim yetkiniz yok', 403));
    }

    // Son 30 günlük istatistikler
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await prisma.$transaction([
      // Toplam token kullanımı
      prisma.aiRequestLog.aggregate({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: {
          tokensUsed: true,
        },
      }),

      // Günlük kullanım
      prisma.aiRequestLog.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: {
          tokensUsed: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      // Model kullanımı
      prisma.aiRequestLog.groupBy({
        by: ['model'],
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: {
          tokensUsed: true,
        },
        _count: {
          model: true,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalTokensUsed: stats[0]._sum.tokensUsed || 0,
        dailyUsage: stats[1],
        modelUsage: stats[2],
      },
    });
  } catch (err) {
    next(err);
  }
};

// Yardımcı fonksiyonlar

/**
 * Simüle edilmiş AI yanıtı
 */
function simulateAIResponse(prompt: string, files?: any[]): string {
  const inputLower = prompt.toLowerCase();

  if (inputLower.includes('merhaba') || inputLower.includes('selam')) {
    return 'Merhaba! Size nasıl yardımcı olabilirim? Kod yazma, hata ayıklama veya geliştirme konularında yardım edebilirim.';
  }

  if (inputLower.includes('javascript') || inputLower.includes('js')) {
    return "```javascript\n// JavaScript ile istediğiniz işlevi yapan bir örnek:\nfunction processData(data) {\n  return data\n    .filter(item => item.value > 10)\n    .map(item => ({\n      ...item,\n      processed: true,\n      timestamp: new Date().toISOString()\n    }));\n}\n```\n\nBu fonksiyon, bir veri dizisini filtreleyip işler. 10'dan büyük değere sahip öğeleri filtreler ve her birine işlendiğini belirten bir bayrak ile zaman damgası ekler.";
  }

  if (inputLower.includes('react')) {
    return "```jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction DataFetcher({ url, renderItem }) {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    async function fetchData() {\n      try {\n        setLoading(true);\n        const response = await fetch(url);\n        const result = await response.json();\n        setData(result);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    }\n\n    fetchData();\n  }, [url]);\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n\n  return (\n    <div className=\"data-container\">\n      {data.map((item, index) => renderItem(item, index))}\n    </div>\n  );\n}\n```\n\nBu React bileşeni, verilen URL'den veri çeker ve renderItem prop'unu kullanarak her öğeyi işler. Loading ve error durumlarını da yönetir.";
  }

  if (files && files.length > 0) {
    return `\`${files[0].name}\` dosyanız için öneriler:\n\n1. **Kod Kalitesi**: Kodunuzdaki tekrar eden kısımları fonksiyonlara çıkarabilirsiniz.\n2. **Performans**: Büyük veri yapıları için memoization kullanmayı düşünün.\n3. **Okunabilirlik**: Değişken isimleriniz anlamlı, ancak bazı fonksiyonlar için daha açıklayıcı isimler kullanabilirsiniz.\n\nDaha detaylı inceleme için lütfen bana kodun hangi bölümüyle ilgilendiğinizi söyleyin.`;
  }

  return 'Sorunuzu aldım. Size daha iyi yardımcı olabilmem için ne tür bir kod veya programlama dili ile çalıştığınızı belirtebilir misiniz?';
}

/**
 * Yanıt metninden kod bloğunu çıkarır
 */
function extractCode(text: string, language: string): string {
  const codeBlockRegex = new RegExp(`\`\`\`(?:${language}|\\w*)[\\s\\S]*?([\\s\\S]*?)\`\`\``, 'gm');
  const match = codeBlockRegex.exec(text);
  return match ? match[1].trim() : text;
}

/**
 * Yanıt metninden açıklama bölümünü çıkarır
 */
function extractExplanation(text: string): string {
  const parts = text.split(/```[\s\S]*?```/);
  return parts.join('\n').trim();
}
