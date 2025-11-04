/**
 * AI Kod Yazma Platformu için servis
 * Bu sınıf, yapay zeka API'leri ile entegrasyonu yönetir
 */

// API isteği ayarları için arayüz
export interface AIRequestOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  context?: any;
  files?: Array<{
    name: string;
    content: string;
    language?: string;
  }>;
}

// API yanıtı için arayüz
export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  code?: string;
  language?: string;
  suggestions?: Array<{
    type: 'code' | 'text' | 'command';
    content: string;
  }>;
}

// API istek hatası için arayüz
export interface AIError {
  message: string;
  code: string;
  status?: number;
}

// Mesaj arayüzü
export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

/**
 * AI Servis Sınıfı
 */
export class AIService {
  private apiUrl: string;
  private apiKey: string | null;
  private defaultModel: string;

  constructor(
    apiUrl: string = '/api/ai',
    apiKey: string | null = null,
    defaultModel: string = 'gpt-4o'
  ) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  /**
   * AI API'sine istek gönderir
   * @param options İstek seçenekleri
   * @returns AI yanıtı
   */
  async sendRequest(options: AIRequestOptions): Promise<AIResponse> {
    const {
      prompt,
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 2048,
      context,
      files,
    } = options;

    console.log(`AI isteği gönderiliyor: ${prompt.substring(0, 50)}...`);

    // Gerçek bir API çağrısı yapılana kadar simülasyon
    return new Promise(resolve => {
      setTimeout(() => {
        const responseText = this.simulateResponse(prompt, files?.[0]);

        resolve({
          text: responseText,
          usage: {
            promptTokens: prompt.length / 4,
            completionTokens: responseText.length / 4,
            totalTokens: (prompt.length + responseText.length) / 4,
          },
        });
      }, 1000);
    });
  }

  /**
   * Sohbet API'sine mesaj gönderir
   * @param messages Mesaj geçmişi
   * @param options İstek seçenekleri
   * @returns AI yanıtı
   */
  async sendChatMessage(
    messages: Array<Message>,
    options?: { temperature?: number; model?: string; context?: any }
  ): Promise<AIResponse> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    const response = await this.sendRequest({
      prompt: lastUserMessage,
      temperature: options?.temperature,
      model: options?.model,
      context: options?.context,
    });

    return response;
  }

  /**
   * Kod tamamlama API'sine istek gönderir
   * @param code Tamamlanacak kod
   * @param language Programlama dili
   * @param options İstek seçenekleri
   * @returns Tamamlanmış kod
   */
  async completeCode(
    code: string,
    language: string = 'javascript',
    options?: { temperature?: number; model?: string }
  ): Promise<string> {
    const prompt = `Aşağıdaki ${language} kodunu tamamla:\n\n${code}`;

    const response = await this.sendRequest({
      prompt,
      temperature: options?.temperature || 0.3,
      model: options?.model,
      context: { language },
    });

    return this.extractCode(response.text, language);
  }

  /**
   * Kod düzeltme ve iyileştirme için API'ye istek gönderir
   * @param code Düzeltilecek kod
   * @param language Programlama dili
   * @param options İstek seçenekleri
   * @returns Düzeltilmiş kod ve açıklama
   */
  async improveCode(
    code: string,
    language: string = 'javascript',
    options?: { temperature?: number; model?: string }
  ): Promise<{ code: string; explanation: string }> {
    const prompt = `Aşağıdaki ${language} kodunu analiz et, hataları düzelt ve optimize et. Değişiklikleri açıkla:\n\n${code}`;

    const response = await this.sendRequest({
      prompt,
      temperature: options?.temperature || 0.3,
      model: options?.model,
      context: { language },
    });

    const improvedCode = this.extractCode(response.text, language);
    const explanation = this.extractExplanation(response.text);

    return { code: improvedCode, explanation };
  }

  /**
   * Yanıt metninden kod bloğunu çıkarır
   * @param text Yanıt metni
   * @param language Programlama dili
   * @returns Kod bloğu
   */
  private extractCode(text: string, language: string): string {
    const codeBlockRegex = new RegExp(
      `\`\`\`(?:${language}|\\w*)[\\s\\S]*?([\\s\\S]*?)\`\`\``,
      'gm'
    );
    const match = codeBlockRegex.exec(text);
    return match ? match[1].trim() : text;
  }

  /**
   * Yanıt metninden açıklama bölümünü çıkarır
   * @param text Yanıt metni
   * @returns Açıklama metni
   */
  private extractExplanation(text: string): string {
    const parts = text.split(/```[\s\S]*?```/);
    return parts.join('\n').trim();
  }

  /**
   * Farklı sorgu türleri için simüle edilmiş yanıtlar
   * @param prompt Kullanıcı sorusu
   * @param file Aktif dosya bilgisi
   * @returns Simüle edilmiş yanıt
   */
  private simulateResponse(prompt: string, file?: any): string {
    const inputLower = prompt.toLowerCase();

    if (inputLower.includes('merhaba') || inputLower.includes('selam')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim? Kod yazma, hata ayıklama veya geliştirme konularında yardım edebilirim.';
    }

    if (inputLower.includes('javascript') || inputLower.includes('js')) {
      return `\`\`\`javascript
// JavaScript ile istediğiniz işlevi yapan bir örnek:
function processData(data) {
  return data
    .filter(item => item.value > 10)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }));
}
\`\`\`

Bu fonksiyon, bir veri dizisini filtreleyip işler. 10'dan büyük değere sahip öğeleri filtreler ve her birine işlendiğini belirten bir bayrak ile zaman damgası ekler.`;
    }

    if (inputLower.includes('react')) {
      return `\`\`\`jsx
import React, { useState, useEffect } from 'react';

function DataFetcher({ url, renderItem }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="data-container">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}
\`\`\`

Bu React bileşeni, verilen URL'den veri çeker ve renderItem prop'unu kullanarak her öğeyi işler. Loading ve error durumlarını da yönetir.`;
    }

    if (file?.name) {
      return `\`${file.name}\` dosyanız için öneriler:

1. **Kod Kalitesi**: Kodunuzdaki tekrar eden kısımları fonksiyonlara çıkarabilirsiniz.
2. **Performans**: Büyük veri yapıları için memoization kullanmayı düşünün.
3. **Okunabilirlik**: Değişken isimleriniz anlamlı, ancak bazı fonksiyonlar için daha açıklayıcı isimler kullanabilirsiniz.

Daha detaylı inceleme için lütfen bana kodun hangi bölümüyle ilgilendiğinizi söyleyin.`;
    }

    return 'Sorunuzu aldım. Size daha iyi yardımcı olabilmem için ne tür bir kod veya programlama dili ile çalıştığınızı belirtebilir misiniz?';
  }
}
