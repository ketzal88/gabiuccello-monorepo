import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { uid } = await params;
  const { status } = await req.json().catch(() => ({})) as { status?: string };

  if (!status || !['active', 'suspended', 'gifted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    await adminDb.doc(`users/${uid}`).update({ 'subscription.status': status });
  } catch (err) {
    // 5 = NOT_FOUND: el doc del usuario no existe.
    if ((err as { code?: number }).code === 5) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    throw err;
  }
  return NextResponse.json({ ok: true });
}
