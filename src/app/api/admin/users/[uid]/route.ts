import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const ADMIN_EMAIL = 'gabriel@worker.ar';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  try {
    const decoded = await adminAuth.verifyIdToken(auth.slice(7));
    return decoded.email === ADMIN_EMAIL;
  } catch { return false; }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { uid } = await params;
  const { status } = await req.json() as { status: string };

  if (!['active', 'suspended', 'gifted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await adminDb.doc(`users/${uid}`).update({ 'subscription.status': status });
  return NextResponse.json({ ok: true });
}
