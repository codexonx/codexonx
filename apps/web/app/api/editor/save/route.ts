import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const response = {
      status: 'ok',
      received: {
        fileId: payload?.fileId ?? 'unknown-file',
        projectId: payload?.projectId ?? 'unknown-project',
        path: payload?.path ?? 'unknown-path',
      },
      savedAt: new Date().toISOString(),
    } as const;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[POST /api/editor/save] Failed to process request', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Mock save isteğinde hata oluştu.',
      },
      { status: 500 }
    );
  }
}
