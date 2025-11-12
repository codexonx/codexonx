import { NextResponse } from 'next/server';

import type { WorkspaceSummary } from '@/types/workspace';
import { DEFAULT_WORKSPACES } from '@/data/workspaces';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      '[GET /api/workspaces] Supabase env eksik, varsayılan mock verileri döndürülüyor.'
    );
    return NextResponse.json(DEFAULT_WORKSPACES, { status: 200 });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/workspaces?select=id,slug,name,plan`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Supabase response not ok: ${response.status}`);
    }

    const data = (await response.json()) as WorkspaceSummary[] | undefined;

    if (!data || data.length === 0) {
      console.warn('[GET /api/workspaces] Supabase boş sonuç döndürdü, mock veriler kullanılacak.');
      return NextResponse.json(DEFAULT_WORKSPACES, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/workspaces] Supabase isteği başarısız oldu', error);
    return NextResponse.json(DEFAULT_WORKSPACES, { status: 200 });
  }
}
