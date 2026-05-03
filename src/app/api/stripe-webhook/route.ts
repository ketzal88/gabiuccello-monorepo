import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Variables requeridas en Vercel (Settings → Environment Variables):
//   STRIPE_WEBHOOK_SECRET  →  whsec_xxx  (de Stripe Dashboard → Webhooks)
//   META_PIXEL_ID          →  tu Pixel ID numérico
//   META_CAPI_ACCESS_TOKEN →  token del System User en Meta Business Manager

const PIXEL_ID = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const CAPI_URL = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;
const SOURCE_URL = 'https://libro.gabiuccello.com/venta';

// Verifica la firma de Stripe sin el SDK (equivalente al SDK interno)
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

// Stripe envía el body como raw bytes — necesitamos leerlo así para la firma
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

  // Solo procesamos compras completadas
  if (stripeEvent.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = stripeEvent.data.object as Record<string, unknown>;
  const customerDetails = session.customer_details as Record<string, string> | null;
  const email = customerDetails?.email ?? '';
  const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : 2900;
  const currency = typeof session.currency === 'string' ? session.currency.toUpperCase() : 'USD';
  const sessionId = typeof session.id === 'string' ? session.id : '';
  const clientRef = typeof session.client_reference_id === 'string' ? session.client_reference_id : '';

  // Parsea fbp y fbc del client_reference_id (formato: "fbp||fbc")
  // fbp = Meta browser ID (_fbp cookie), fbc = click ID (_fbc cookie)
  const [fbp, fbc] = clientRef.split('||');

  // IP real del cliente (Vercel pone la IP en x-forwarded-for)
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  const userAgent = req.headers.get('user-agent') ?? '';

  // user_data: todos los campos que Meta usa para hacer match con perfiles
  const userData: Record<string, unknown> = {
    client_ip_address: ipAddress,
    client_user_agent: userAgent,
  };
  // Los PII siempre van hasheados en SHA-256, lowercase, sin espacios
  if (email) userData.em = [sha256hex(email)];
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const capiPayload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        // El event_id debe coincidir con el que dispara el Pixel en /gracias
        // para que Meta los deduplique y no cuente la misma venta dos veces
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
      },
    ],
    access_token: CAPI_TOKEN,
  };

  try {
    const capiRes = await fetch(CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capiPayload),
    });

    if (!capiRes.ok) {
      const errText = await capiRes.text();
      console.error(`Meta CAPI error (${capiRes.status}):`, errText);
    } else {
      const result = await capiRes.json() as { events_received?: number };
      console.log(`Meta CAPI Purchase enviado. Eventos recibidos: ${result.events_received}`);
    }
  } catch (err) {
    console.error('Meta CAPI fetch falló:', err);
  }

  return NextResponse.json({ received: true });
}
