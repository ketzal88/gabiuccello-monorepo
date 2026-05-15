import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Variables requeridas en Vercel (Settings → Environment Variables):
//   STRIPE_WEBHOOK_SECRET       →  whsec_xxx  (Stripe Dashboard → Webhooks)
//   META_PIXEL_ID               →  ID numérico del Pixel
//   META_CAPI_ACCESS_TOKEN      →  token System User Meta Business Manager
//   RESEND_API_KEY              →  re_xxx  (resend.com → API Keys)
//   RESEND_FROM_EMAIL           →  dominio verificado en Resend
//   FIREBASE_ADMIN_CLIENT_EMAIL →  service account client_email
//   FIREBASE_ADMIN_PRIVATE_KEY  →  service account private_key (con \n literales)

const PIXEL_ID = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? 'hola@gabiuccello.com';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_ERROR_CHANNEL_ID;
const CAPI_URL = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;
const SOURCE_URL = 'https://libro.gabiuccello.com/venta';
const APP_URL = 'https://libro.gabiuccello.com';
const PDF_URL = 'https://libro.gabiuccello.com/libro/7-pasos-para-cambiar-tu-vida.pdf';
const EPUB_URL = 'https://libro.gabiuccello.com/libro/7-pasos-para-cambiar-tu-vida.epub';

function verifyStripeSignature(rawBody: string, sigHeader: string, secret: string): boolean {
  const parts: Record<string, string> = {};
  sigHeader.split(',').forEach((part) => {
    const [k, v] = part.split('=');
    parts[k] = v;
  });
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${t}.${rawBody}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function sha256hex(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET || !PIXEL_ID || !CAPI_TOKEN) {
    console.error('Faltan variables de entorno: STRIPE_WEBHOOK_SECRET, META_PIXEL_ID, META_CAPI_ACCESS_TOKEN');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get('stripe-signature') ?? '';

  if (!verifyStripeSignature(rawBody, sigHeader, WEBHOOK_SECRET)) {
    console.warn('Stripe webhook: firma inválida');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let stripeEvent: { type: string; data: { object: Record<string, unknown> } };
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = stripeEvent.data.object as Record<string, unknown>;
  const customerDetails = session.customer_details as Record<string, string> | null;
  const email = customerDetails?.email ?? '';
  const name = customerDetails?.name ?? '';
  const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : 2900;
  const currency = typeof session.currency === 'string' ? session.currency.toUpperCase() : 'USD';
  const sessionId = typeof session.id === 'string' ? session.id : '';
  const clientRef = typeof session.client_reference_id === 'string' ? session.client_reference_id : '';

  const [fbp, fbc] = clientRef.split('||');
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const userAgent = req.headers.get('user-agent') ?? '';

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  // ── 1. Meta CAPI ─────────────────────────────────────────────────────────
  const userData: Record<string, unknown> = {
    client_ip_address: ipAddress,
    client_user_agent: userAgent,
  };
  if (email) {
    userData.em = [sha256hex(email)];
    userData.external_id = [sha256hex(email)];
  }
  if (firstName) userData.fn = [sha256hex(firstName.toLowerCase())];
  if (lastName) userData.ln = [sha256hex(lastName.toLowerCase())];
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  try {
    const capiRes = await fetch(CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: `purchase_${sessionId}`,
          action_source: 'website',
          event_source_url: SOURCE_URL,
          user_data: userData,
          custom_data: {
            value: amountTotal / 100,
            currency,
            content_ids: ['7pasos-acceso-total'],
            content_type: 'product',
            num_items: 1,
            order_id: sessionId,
          },
        }],
        access_token: CAPI_TOKEN,
      }),
    });
    if (!capiRes.ok) {
      console.error(`Meta CAPI error (${capiRes.status}):`, await capiRes.text());
    } else {
      const result = await capiRes.json() as { events_received?: number };
      console.log(`Meta CAPI Purchase enviado. Eventos recibidos: ${result.events_received}`);
    }
  } catch (err) {
    console.error('Meta CAPI fetch falló:', err);
  }

  // ── 2. Firebase: crear cuenta + perfil ────────────────────────────────────
  let loginLink = APP_URL;
  if (email) {
    try {
      let uid: string;
      try {
        const newUser = await adminAuth.createUser({
          email,
          displayName: name || undefined,
          emailVerified: true,
        });
        uid = newUser.uid;

        // Crear perfil en Firestore (misma estructura que createUserProfile en el cliente)
        await adminDb.doc(`users/${uid}`).set({
          displayName: name || '',
          email,
          createdAt: Timestamp.now(),
          startDate: Timestamp.now(),
          stepsRead: [],
          onboardingPhase: 'reading',
          subscription: { status: 'active', grantedBy: 'purchase', stripeSessionId: sessionId },
        });
        console.log(`Firebase: usuario creado ${uid}`);
      } catch (err: unknown) {
        // Si ya existe, obtenemos su uid igual para el reset link
        if ((err as { code?: string }).code === 'auth/email-already-exists') {
          const existing = await adminAuth.getUserByEmail(email);
          uid = existing.uid;
          console.log(`Firebase: usuario ya existía ${uid}`);
        } else {
          throw err;
        }
      }

      // Magic link: abre Firebase "crear contraseña" y redirige a la app
      loginLink = await adminAuth.generatePasswordResetLink(email, {
        url: `${APP_URL}/login`,
      });
    } catch (err) {
      console.error('Firebase Admin error:', err);
    }
  }

  // ── 3. Email de bienvenida con Resend ─────────────────────────────────────
  await Promise.all([
    email && RESEND_API_KEY ? sendPurchaseEmail(email, name, loginLink) : Promise.resolve(),
    SLACK_BOT_TOKEN && SLACK_CHANNEL ? notifySlack({ name, email, amount: amountTotal, currency, sessionId }) : Promise.resolve(),
  ]);

  return NextResponse.json({ received: true });
}

async function notifySlack({ name, email, amount, currency, sessionId }: {
  name: string; email: string; amount: number; currency: string; sessionId: string;
}): Promise<void> {
  const value = (amount / 100).toFixed(2);
  try {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: `💰 *Nueva venta — 7 Pasos*\n*$${value} ${currency}*\n👤 ${name || 'Sin nombre'} (${email})\n🔑 \`${sessionId}\``,
      }),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (!data.ok) console.error('Slack error:', data.error);
  } catch (err) {
    console.error('Slack notify falló:', err);
  }
}

async function sendPurchaseEmail(to: string, name: string, loginLink: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'ahí';
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 24px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:24px;">
          <span style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#f97316;text-transform:uppercase;">✓ COMPRA CONFIRMADA</span>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <h1 style="margin:0;font-size:36px;font-weight:900;color:#fafaf5;line-height:1.1;letter-spacing:-0.02em;">Bienvenido al sistema, ${firstName}.</h1>
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0;font-size:17px;color:#d4d4cf;line-height:1.6;font-style:italic;">Los 180 días empiezan hoy. No el lunes.</p>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <p style="margin:0;font-size:15px;color:#8b8b85;line-height:1.6;">Creamos tu cuenta. Hacé click abajo para crear tu contraseña y entrar directo a la app con todo el acceso activado.</p>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <a href="${loginLink}" style="display:inline-block;background:#f97316;color:#0a0a0a;padding:16px 32px;border-radius:6px;font-size:14px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.04em;">Crear contraseña y entrar →</a>
        </td></tr>
        <tr><td style="padding-top:24px;padding-bottom:48px;border-top:1px solid #1f1f1f;">
          <p style="margin:0 0 8px;font-size:13px;color:#525252;">¿Preferís leer offline?</p>
          <a href="${PDF_URL}" style="font-size:14px;color:#f97316;text-decoration:none;display:block;margin-bottom:6px;">Descargar PDF ↓</a>
          <a href="${EPUB_URL}" style="font-size:14px;color:#f97316;text-decoration:none;">Descargar EPUB (Kindle / Apple Books) ↓</a>
        </td></tr>
        <tr><td>
          <p style="margin:0;font-size:12px;color:#525252;line-height:1.6;">Gabi Uccello · libro.gabiuccello.com<br>Respondé este mail si tenés alguna duda.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [to],
        subject: 'Tu acceso a 7 Pasos está listo',
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend error (${res.status}):`, await res.text());
    } else {
      console.log(`Email de bienvenida enviado a ${to}`);
    }
  } catch (err) {
    console.error('Resend fetch falló:', err);
  }
}
