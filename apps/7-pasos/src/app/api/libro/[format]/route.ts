import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Descarga del libro solo para usuarios con acceso (antes estaba en public/).
// Los archivos viven en private/libro y entran al bundle por
// outputFileTracingIncludes en next.config.mjs.
const FILES: Record<string, { name: string; type: string }> = {
  pdf: { name: '7-pasos-para-cambiar-tu-vida.pdf', type: 'application/pdf' },
  epub: { name: '7-pasos-para-cambiar-tu-vida.epub', type: 'application/epub+zip' },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  const { format } = await params;
  const file = FILES[format];
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(auth.slice(7))).uid;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const snap = await adminDb.doc(`users/${uid}`).get();
  const status = (snap.data()?.subscription as { status?: string } | undefined)?.status;
  if (status !== 'active' && status !== 'gifted') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await readFile(path.join(process.cwd(), 'private/libro', file.name));
  return new NextResponse(data, {
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
