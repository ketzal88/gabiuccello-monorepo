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

// Asigna tier="full" a todos los usuarios existentes con suscripción activa
// que todavía no tienen el campo `tier`. Idempotente — se puede correr varias veces.
//
// Razón: antes de partir el producto en libro/bundle/upgrade, todos los pagos
// daban acceso completo (el bundle viejo de $29). No querés bajarle el tier a
// nadie que ya pagó.
//
// Uso (desde el admin panel, o via curl con el ID token de Gabi):
//   POST /api/admin/backfill-tier
//   { "dryRun": true }   → solo cuenta cuántos se afectarían
//   { "dryRun": false }  → ejecuta el cambio
export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { dryRun = true } = await req.json().catch(() => ({})) as { dryRun?: boolean };

  const snapshot = await adminDb.collection('users').get();

  let candidates = 0;
  let updated = 0;
  const sample: Array<{ uid: string; email: string; reason: string }> = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const sub = data.subscription as { status?: string; tier?: string } | undefined;

    // Saltear si no tiene suscripción o no está activa/gifted
    if (!sub || (sub.status !== 'active' && sub.status !== 'gifted')) continue;

    // Saltear si ya tiene tier seteado (idempotencia)
    if (sub.tier) continue;

    candidates++;
    if (sample.length < 5) {
      sample.push({
        uid: doc.id,
        email: (data.email as string) ?? '',
        reason: `status=${sub.status}, no tier`,
      });
    }

    if (!dryRun) {
      await doc.ref.set({
        subscription: { tier: 'full' },
      }, { merge: true });
      updated++;
    }
  }

  return NextResponse.json({
    dryRun,
    totalUsers: snapshot.size,
    candidates,
    updated,
    sample,
  });
}
