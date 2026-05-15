import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const ADMIN_EMAIL = 'gabriel@worker.ar';
const APP_URL = 'https://libro.gabiuccello.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? 'hola@gabiuccello.com';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  try {
    const decoded = await adminAuth.verifyIdToken(auth.slice(7));
    return decoded.email === ADMIN_EMAIL;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email, name } = await req.json() as { email: string; name?: string };
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  let uid: string;
  try {
    const newUser = await adminAuth.createUser({
      email,
      displayName: name || undefined,
      emailVerified: true,
    });
    uid = newUser.uid;
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'auth/email-already-exists') {
      const existing = await adminAuth.getUserByEmail(email);
      uid = existing.uid;
    } else throw err;
  }

  await adminDb.doc(`users/${uid}`).set({
    displayName: name || '',
    email,
    createdAt: Timestamp.now(),
    startDate: Timestamp.now(),
    stepsRead: [],
    onboardingPhase: 'reading',
    subscription: { status: 'gifted', grantedBy: 'admin' },
  }, { merge: true });

  const loginLink = await adminAuth.generatePasswordResetLink(email, { url: `${APP_URL}/login` });

  if (RESEND_API_KEY) {
    const firstName = name?.split(' ')[0] || 'ahí';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [email],
        subject: 'Tu acceso a 7 Pasos está listo',
        html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 24px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:24px;">
          <span style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#f97316;text-transform:uppercase;">✓ ACCESO ACTIVADO</span>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <h1 style="margin:0;font-size:32px;font-weight:900;color:#fafaf5;line-height:1.1;">Hola, ${firstName}. Tu acceso a 7 Pasos está listo.</h1>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <p style="margin:0;font-size:15px;color:#8b8b85;line-height:1.6;">Hacé click abajo para crear tu contraseña y acceder al sistema.</p>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <a href="${loginLink}" style="display:inline-block;background:#f97316;color:#0a0a0a;padding:16px 32px;border-radius:6px;font-size:14px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.04em;">Crear contraseña y entrar →</a>
        </td></tr>
        <tr><td>
          <p style="margin:0;font-size:12px;color:#525252;line-height:1.6;">Gabi Uccello · libro.gabiuccello.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }),
    });
  }

  return NextResponse.json({ ok: true, uid });
}
