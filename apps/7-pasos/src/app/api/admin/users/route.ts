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

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const snap = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
  const users = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      displayName: data.displayName ?? '',
      email: data.email ?? '',
      onboardingPhase: data.onboardingPhase ?? 'reading',
      stepsRead: data.stepsRead ?? [],
      subscription: data.subscription ?? { status: 'active' },
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      startDate: data.startDate?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ users });
}
