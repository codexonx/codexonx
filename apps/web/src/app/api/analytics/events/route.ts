import { NextResponse } from 'next/server';
import { z } from 'zod';

// Aktivite tipi enum
enum ActivityType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  API_CALL = 'api_call',
  ERROR = 'error',
  AUTH = 'auth',
  FEATURE_USAGE = 'feature_usage',
  SEARCH = 'search',
  PURCHASE = 'purchase',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end'
}

// Aktivite log şeması
const ActivityLogSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  timestamp: z.number(),
  type: z.nativeEnum(ActivityType),
  path: z.string().optional(),
  target: z.string().optional(),
  data: z.record(z.any()).optional(),
  duration: z.number().optional(),
  success: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

// Kullanıcı özellikleri şeması
const UserPropertiesSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  userAgent: z.string().optional(),
  platform: z.string().optional(),
  browser: z.string().optional(),
  deviceType: z.string().optional(),
  screenSize: z.string().optional(),
  referrer: z.string().optional(),
  firstSeen: z.number().optional(),
});

// İstek şeması
const RequestSchema = z.object({
  userProperties: UserPropertiesSchema,
  events: z.array(ActivityLogSchema)
});

export async function POST(req: Request) {
  try {
    // İsteği doğrula
    const body = await req.json();
    const validationResult = RequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Geçersiz analitik verileri:', validationResult.error);
      return NextResponse.json({ error: 'Geçersiz analitik verileri' }, { status: 400 });
    }

    const { userProperties, events } = validationResult.data;
    
    // Analitik verilerini veritabanına kaydet (şu anda loglama yapıyoruz)
    // NOT: Gerçek uygulamada, bu verileri bir analitik veritabanına veya üçüncü parti hizmetlere kaydedin
    console.log('Kullanıcı özellikleri:', JSON.stringify(userProperties));
    console.log('Etkinlikler:', JSON.stringify(events));
    
    // Veritabanına kaydetme işlemi burada yapılacak
    // await db.analytics.createMany({
    //   data: events.map(event => ({
    //     ...event,
    //     userPropertiesId: userProperties.sessionId
    //   }))
    // });
    
    // await db.userProperties.upsert({
    //   where: { sessionId: userProperties.sessionId },
    //   update: userProperties,
    //   create: userProperties
    // });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analitik işleme hatası:', error);
    return NextResponse.json({ error: 'İşlem hatası' }, { status: 500 });
  }
}

// Son 30 gündeki etkinliklerin sayısını almak için GET uç noktası
export async function GET(req: Request) {
  try {
    // URL parametrelerini ayıklama
    const url = new URL(req.url);
    const days = Number(url.searchParams.get('days') || 30);
    const type = url.searchParams.get('type');
    const userId = url.searchParams.get('userId');
    
    // Kullanıcı yetkisini doğrula (normalde bir auth middleware kullanın)
    
    // Şu anda simüle edilmiş veriler döndürüyoruz
    // Gerçek uygulamada veritabanından sorgulama yapılacak
    const simulatedData = simulateAnalyticsData(days, type, userId);
    
    return NextResponse.json(simulatedData);
  } catch (error) {
    console.error('Analitik sorgulama hatası:', error);
    return NextResponse.json({ error: 'İşlem hatası' }, { status: 500 });
  }
}

// Test için simüle edilmiş veriler
function simulateAnalyticsData(days: number, type?: string | null, userId?: string | null) {
  // Bugünden başlayarak geriye doğru günler için veri oluştur
  const today = new Date();
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      pageViews: Math.floor(Math.random() * 500) + 200,
      uniqueUsers: Math.floor(Math.random() * 200) + 100,
      clicks: Math.floor(Math.random() * 800) + 300,
      apiCalls: Math.floor(Math.random() * 1000) + 500,
      errors: Math.floor(Math.random() * 20),
    });
  }
  
  // Veriler en yeniden en eskiye sıralanmalı
  return data.reverse();
}
