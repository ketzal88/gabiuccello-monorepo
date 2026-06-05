import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Variables requeridas en Vercel (Settings → Environment Variables):
//   STRIPE_WEBHOOK_SECRET       →  whsec_xxx  (Stripe Dashboard → Webhooks)
//   STRIPE_SECRET_KEY           →  sk_live_xxx (para fetch de line_items)
//   META_PIXEL_ID               →  ID numérico del Pixel
//   META_CAPI_ACCESS_TOKEN      →  token System User Meta Business Manager
//   RESEND_API_KEY              →  re_xxx  (resend.com → API Keys)
//   RESEND_FROM_EMAIL           →  dominio verificado en Resend
//   ADMIN_NOTIFY_EMAIL          →  email del admin (default: gabriel@worker.ar)
//   SLACK_BOT_TOKEN             →  xoxb-xxx (bot con scope chat:write)
//   SLACK_BUSINESS_CHANNEL_ID   →  C0AK7HANGQY (#7-pasos)
//   FIREBASE_ADMIN_CLIENT_EMAIL →  service account client_email
//   FIREBASE_ADMIN_PRIVATE_KEY  →  service account private_key (con \n literales)

const PIXEL_ID = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? 'hola@gabiuccello.com';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? 'gabriel@worker.ar';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_BUSINESS_CHANNEL_ID;
const CAPI_URL = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;
const SOURCE_URL = 'https://libro.gabiuccello.com/venta';
const APP_URL = 'https://libro.gabiuccello.com';
const PDF_URL = 'https://libro.gabiuccello.com/libro/7-pasos-para-cambiar-tu-vida.pdf';
const EPUB_URL = 'https://libro.gabiuccello.com/libro/7-pasos-para-cambiar-tu-vida.epub';

// Mapa de productos Stripe → tier
const PRODUCT_BOOK = 'prod_UPH7uh1pVsjGBm';
const PRODUCT_BUNDLE = 'prod_Ue5zE76x9M1GE1';
const PRODUCT_UPGRADE = 'prod_Ue60nMFZPJrlQy';

type PurchaseType = 'book' | 'bundle' | 'upgrade' | 'unknown';

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

// Fetch line_items para detectar qué producto se compró.
// Stripe REST API directa (sin SDK).
async function detectPurchaseType(sessionId: string): Promise<PurchaseType> {
  if (!STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY no seteada — no puedo detectar producto');
    return 'unknown';
  }
  try {
    const url = `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?limit=1&expand[]=data.price.product`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
    });
    if (!res.ok) {
      console.error(`Stripe line_items error (${res.status}):`, await res.text());
      return 'unknown';
    }
    const data = await res.json() as {
      data?: Array<{ price?: { product?: string | { id?: string } } }>;
    };
    const price = data.data?.[0]?.price;
    const product = typeof price?.product === 'string'
      ? price.product
      : price?.product?.id ?? '';

    if (product === PRODUCT_BOOK) return 'book';
    if (product === PRODUCT_BUNDLE) return 'bundle';
    if (product === PRODUCT_UPGRADE) return 'upgrade';
    console.warn(`Producto Stripe desconocido: ${product}`);
    return 'unknown';
  } catch (err) {
    console.error('detectPurchaseType falló:', err);
    return 'unknown';
  }
}

// Parsea client_reference_id.
// Formatos soportados:
//   "fbp||fbc"               (compra inicial)
//   "uid:UID||fbp||fbc"      (upgrade — UID del Firebase user)
function parseClientRef(ref: string): { uid?: string; fbp?: string; fbc?: string } {
  if (!ref) return {};
  const parts = ref.split('||');
  let uid: string | undefined;
  const rest: string[] = [];
  for (const p of parts) {
    if (p.startsWith('uid:')) uid = p.slice(4);
    else rest.push(p);
  }
  return { uid, fbp: rest[0], fbc: rest[1] };
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
  const customerDetails = session.customer_details as Record<string, unknown> | null;
  const email = (customerDetails?.email as string) ?? '';
  const name = (customerDetails?.name as string) ?? '';
  const address = (customerDetails?.address as Record<string, string> | null) ?? null;
  const city = address?.city ?? '';
  const stateRegion = address?.state ?? '';
  const postalCode = address?.postal_code ?? '';
  const country = address?.country ?? ''; // ISO 3166-1 alpha-2
  const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : 0;
  const currency = typeof session.currency === 'string' ? session.currency.toUpperCase() : 'USD';
  const sessionId = typeof session.id === 'string' ? session.id : '';
  const clientRef = typeof session.client_reference_id === 'string' ? session.client_reference_id : '';

  const { uid: upgradeUid, fbp, fbc } = parseClientRef(clientRef);
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const userAgent = req.headers.get('user-agent') ?? '';

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  // Detectar producto comprado
  const purchaseType = await detectPurchaseType(sessionId);
  console.log(`Webhook: purchaseType=${purchaseType}, sessionId=${sessionId}, uid=${upgradeUid ?? 'n/a'}`);

  // ── 1. Firebase: resolver UID ANTES del CAPI (para usarlo como external_id) ─
  let loginLink = APP_URL;
  let isUpgrade = false;
  let firebaseUid: string | undefined;

  if (purchaseType === 'upgrade' && upgradeUid) {
    isUpgrade = true;
    firebaseUid = upgradeUid;
    try {
      await adminDb.doc(`users/${upgradeUid}`).set({
        subscription: {
          status: 'active',
          tier: 'full',
          grantedBy: 'upgrade',
          upgradeSessionId: sessionId,
          upgradedAt: Timestamp.now(),
        },
      }, { merge: true });
      console.log(`Firebase: upgrade aplicado a UID ${upgradeUid}`);
    } catch (err) {
      console.error('Firebase upgrade error:', err);
    }
  } else if (email) {
    const tier = purchaseType === 'book' ? 'book' : 'full';
    try {
      try {
        const newUser = await adminAuth.createUser({
          email,
          displayName: name || undefined,
          emailVerified: true,
        });
        firebaseUid = newUser.uid;

        await adminDb.doc(`users/${firebaseUid}`).set({
          displayName: name || '',
          email,
          createdAt: Timestamp.now(),
          startDate: Timestamp.now(),
          stepsRead: [],
          onboardingPhase: 'reading',
          subscription: {
            status: 'active',
            tier,
            grantedBy: 'purchase',
            stripeSessionId: sessionId,
            purchasedAt: Timestamp.now(),
          },
        });
        console.log(`Firebase: usuario creado ${firebaseUid} (tier: ${tier})`);
      } catch (err: unknown) {
        if ((err as { code?: string }).code === 'auth/email-already-exists') {
          const existing = await adminAuth.getUserByEmail(email);
          firebaseUid = existing.uid;
          if (tier === 'full') {
            await adminDb.doc(`users/${firebaseUid}`).set({
              subscription: {
                status: 'active',
                tier: 'full',
                stripeSessionId: sessionId,
              },
            }, { merge: true });
          }
          console.log(`Firebase: usuario ya existía ${firebaseUid} (tier comprado: ${tier})`);
        } else {
          throw err;
        }
      }

      loginLink = await adminAuth.generatePasswordResetLink(email, {
        url: `${APP_URL}/login`,
      });
    } catch (err) {
      console.error('Firebase Admin error:', err);
    }
  }

  // ── 2. Meta CAPI ─────────────────────────────────────────────────────────
  // Match quality params: cuanto más mandamos, mejor matchea Meta el evento
  // con el usuario que vio el ad. Todo lo PII va SHA-256 (trim + lowercase).
  const userData: Record<string, unknown> = {
    client_ip_address: ipAddress,
    client_user_agent: userAgent,
  };
  if (email) userData.em = [sha256hex(email)];
  if (firstName) userData.fn = [sha256hex(firstName)];
  if (lastName) userData.ln = [sha256hex(lastName)];
  if (city) userData.ct = [sha256hex(city)];
  if (stateRegion) userData.st = [sha256hex(stateRegion)];
  if (postalCode) userData.zp = [sha256hex(postalCode)];
  if (country) userData.country = [sha256hex(country)]; // ISO-2: "AR" → sha256("ar")
  if (firebaseUid) userData.external_id = [sha256hex(firebaseUid)];
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const contentId =
    purchaseType === 'book' ? '7pasos-libro' :
    purchaseType === 'bundle' ? '7pasos-bundle' :
    purchaseType === 'upgrade' ? '7pasos-upgrade-app' :
    '7pasos-acceso-total';

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
            content_ids: [contentId],
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
      console.log(`Meta CAPI Purchase enviado. Eventos recibidos: ${result.events_received}, params: ${Object.keys(userData).join(',')}`);
    }
  } catch (err) {
    console.error('Meta CAPI fetch falló:', err);
  }

  // ── 3. Email + Slack ──────────────────────────────────────────────────────
  await Promise.all([
    email && RESEND_API_KEY
      ? sendPurchaseEmail(email, name, loginLink, purchaseType, isUpgrade)
      : Promise.resolve(),
    RESEND_API_KEY
      ? sendAdminSaleEmail({ name, email, amount: amountTotal, currency, sessionId, purchaseType })
      : Promise.resolve(),
    SLACK_BOT_TOKEN && SLACK_CHANNEL
      ? notifySlack({ name, email, amount: amountTotal, currency, sessionId, purchaseType })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ received: true });
}

async function notifySlack({ name, email, amount, currency, sessionId, purchaseType }: {
  name: string; email: string; amount: number; currency: string; sessionId: string; purchaseType: PurchaseType;
}): Promise<void> {
  const value = (amount / 100).toFixed(2);
  const label =
    purchaseType === 'book' ? '📖 Libro solo' :
    purchaseType === 'bundle' ? '🎯 Bundle libro + app' :
    purchaseType === 'upgrade' ? '⬆️ Upgrade app de por vida' :
    '❓ Compra (producto desconocido)';
  try {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: `💰 *Nueva venta — 7 Pasos*\n${label} — *$${value} ${currency}*\n👤 ${name || 'Sin nombre'} (${email})\n🔑 \`${sessionId}\``,
      }),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (!data.ok) console.error('Slack error:', data.error);
  } catch (err) {
    console.error('Slack notify falló:', err);
  }
}

async function sendAdminSaleEmail({ name, email, amount, currency, sessionId, purchaseType }: {
  name: string; email: string; amount: number; currency: string; sessionId: string; purchaseType: PurchaseType;
}): Promise<void> {
  const value = (amount / 100).toFixed(2);
  const label =
    purchaseType === 'book' ? 'Libro solo' :
    purchaseType === 'bundle' ? 'Bundle libro + app' :
    purchaseType === 'upgrade' ? 'Upgrade app de por vida' :
    'Compra (producto desconocido)';

  const subject = `💰 Venta 7 Pasos — $${value} ${currency} (${label})`;
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#fafaf5;margin:0;padding:32px;">
    <h2 style="margin:0 0 16px;color:#f97316;">Nueva venta — 7 Pasos</h2>
    <p style="margin:0 0 8px;font-size:18px;"><strong>${label}</strong> — $${value} ${currency}</p>
    <p style="margin:0 0 4px;">👤 ${name || 'Sin nombre'}</p>
    <p style="margin:0 0 4px;">✉️ ${email || 'Sin email'}</p>
    <p style="margin:16px 0 0;font-family:monospace;font-size:12px;color:#8b8b85;">Session: ${sessionId}</p>
  </body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend admin notify error (${res.status}):`, await res.text());
    } else {
      console.log(`Admin notify enviado a ${ADMIN_EMAIL} (venta: ${purchaseType})`);
    }
  } catch (err) {
    console.error('Resend admin notify falló:', err);
  }
}

async function sendPurchaseEmail(
  to: string,
  name: string,
  loginLink: string,
  purchaseType: PurchaseType,
  isUpgrade: boolean
): Promise<void> {
  const firstName = name.split(' ')[0] || 'ahí';

  // Subject + body según tipo de compra
  let subject = 'Tu acceso a 7 Pasos está listo';
  let eyebrow = '✓ COMPRA CONFIRMADA';
  let headline = `Bienvenido al sistema, ${firstName}.`;
  let lead = 'Los 180 días empiezan hoy. No el lunes.';
  let body = 'Creamos tu cuenta. Hacé click abajo para crear tu contraseña y entrar directo a la app con todo el acceso activado.';
  let ctaText = 'Crear contraseña y entrar →';

  if (purchaseType === 'book') {
    subject = 'Tu libro está listo — 7 Pasos';
    headline = `Acá tenés tu libro, ${firstName}.`;
    lead = 'El sistema entero, en 35 minutos de lectura.';
    body = 'Creamos tu cuenta para que puedas leer en la webapp además del PDF/EPUB. Cuando estés listo, podés sumar la app de tracking por solo $10 más.';
    ctaText = 'Entrar a la webapp →';
  } else if (isUpgrade) {
    subject = '🎯 App de tracking activada — 7 Pasos';
    eyebrow = '✓ UPGRADE APLICADO';
    headline = `Listo ${firstName}, tracking desbloqueado.`;
    lead = 'Tu app de tracking de hábitos quedó activada de por vida.';
    body = 'Ya podés entrar a la webapp y vas a ver Tracker, Objetivos y Progreso disponibles. No tenés que hacer nada más.';
    ctaText = 'Entrar a la app →';
  }

  // Sección de downloads solo si es compra (no upgrade)
  const downloadsBlock = isUpgrade ? '' : `
        <tr><td style="padding-top:24px;padding-bottom:48px;border-top:1px solid #1f1f1f;">
          <p style="margin:0 0 8px;font-size:13px;color:#525252;">¿Preferís leer offline?</p>
          <a href="${PDF_URL}" style="font-size:14px;color:#f97316;text-decoration:none;display:block;margin-bottom:6px;">Descargar PDF ↓</a>
          <a href="${EPUB_URL}" style="font-size:14px;color:#f97316;text-decoration:none;">Descargar EPUB (Kindle / Apple Books) ↓</a>
        </td></tr>`;

  // Para libro-solo, agregamos un sutil upsell
  const upsellBlock = purchaseType === 'book' ? `
        <tr><td style="padding-top:24px;padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0" style="background:#1c1c1c;border-radius:8px;padding:20px;width:100%;">
            <tr><td>
              <p style="margin:0 0 8px;font-family:monospace;font-size:11px;color:#f97316;letter-spacing:0.15em;text-transform:uppercase;">¿Querés también la app?</p>
              <p style="margin:0 0 4px;font-size:15px;color:#fafaf5;line-height:1.5;">Sumá tracking de hábitos, objetivos y streak de por vida por solo <strong style="color:#f97316;">$10 USD más</strong>.</p>
              <p style="margin:8px 0 0;font-size:13px;color:#8b8b85;">Lo activás desde dentro de la app cuando quieras.</p>
            </td></tr>
          </table>
        </td></tr>` : '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 24px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:24px;">
          <span style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#f97316;text-transform:uppercase;">${eyebrow}</span>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <h1 style="margin:0;font-size:36px;font-weight:900;color:#fafaf5;line-height:1.1;letter-spacing:-0.02em;">${headline}</h1>
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0;font-size:17px;color:#d4d4cf;line-height:1.6;font-style:italic;">${lead}</p>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <p style="margin:0;font-size:15px;color:#8b8b85;line-height:1.6;">${body}</p>
        </td></tr>
        <tr><td style="padding-bottom:40px;">
          <a href="${loginLink}" style="display:inline-block;background:#f97316;color:#0a0a0a;padding:16px 32px;border-radius:6px;font-size:14px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.04em;">${ctaText}</a>
        </td></tr>
        ${downloadsBlock}
        ${upsellBlock}
        <tr><td style="padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#525252;line-height:1.6;">Gabi Uccello · libro.gabiuccello.com<br>Respondé este mail si tenés alguna duda — si en 180 días aplicaste el sistema y no funcionó, contame qué intentaste y devuelvo todo.</p>
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
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend error (${res.status}):`, await res.text());
    } else {
      console.log(`Email enviado a ${to} (tipo: ${purchaseType}, upgrade: ${isUpgrade})`);
    }
  } catch (err) {
    console.error('Resend fetch falló:', err);
  }
}
