import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

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
      // Sin suscripción = sin acceso (antes se mostraba como activo).
      subscription: data.subscription ?? { status: 'none' },
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      startDate: data.startDate?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ users });
}
