import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const executedAt = new Date().toISOString();
    const response = {
      status: 'ok',
      message: `Mock run tamamlandı: ${payload?.path ?? 'bilinmeyen dosya'}`,
      executedAt,
      level: 'info' as const,
      logId: `mock-run-${Date.now()}`,
      meta: {
        durationMs: 620,
        tokenUsage: 128,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[POST /api/editor/run] Failed to process request', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Mock run isteğinde hata oluştu.',
      },
      { status: 500 }
    );
  }
}
