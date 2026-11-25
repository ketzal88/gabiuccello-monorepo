import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_BUSINESS_CHANNEL_ID;

// Acepta signups dentro de los últimos 5 min para evitar spoofing de eventos viejos.
const MAX_AGE_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (!SLACK_BOT_TOKEN) {
    return NextResponse.json({ ok: true, skipped: 'no slack token' });
  }

  // El uid sale del ID token, no del body: nadie puede disparar avisos por otro usuario.
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

  const user = await adminAuth.getUser(uid);
  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).getTime()
    : 0;
  if (Date.now() - createdAt > MAX_AGE_MS) {
    return NextResponse.json({ ok: true, skipped: 'user too old' });
  }

  // Un aviso por usuario aunque el cliente llame varias veces.
  try {
    await adminDb.doc(`signupNotifications/${uid}`).create({ notifiedAt: Timestamp.now() });
  } catch (err) {
    if ((err as { code?: number }).code === 6) {
      return NextResponse.json({ ok: true, skipped: 'already notified' });
    }
    throw err;
  }

  const provider = user.providerData[0]?.providerId ?? 'password';
  const providerLabel =
    provider === 'google.com' ? '🟦 Google' :
    provider === 'password' ? '✉️ Email' :
    provider;

  try {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: `🆕 *Nuevo usuario — 7 Pasos*\n👤 ${user.displayName || 'Sin nombre'} (${user.email ?? 'sin email'})\n${providerLabel}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (!data.ok) console.error('Slack signup notify error:', data.error);
  } catch (err) {
    console.error('Slack signup notify falló:', err);
  }

  return NextResponse.json({ ok: true });
}
