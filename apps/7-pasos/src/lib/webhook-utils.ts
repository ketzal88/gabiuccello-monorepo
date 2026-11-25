// Funciones puras del webhook de Stripe y los mails. Viven fuera de route.ts
// porque Next no permite exports extra en un route handler, y así se pueden
// chequear con scripts/check-webhook-utils.mjs.
import crypto from 'crypto';

// Stripe recomienda rechazar firmas con más de 5 minutos (anti-replay).
export const SIGNATURE_TOLERANCE_S = 300;

export function verifyStripeSignature(
  rawBody: string,
  sigHeader: string,
  secret: string,
  nowS: number = Math.floor(Date.now() / 1000),
): boolean {
  const parts: Record<string, string> = {};
  sigHeader.split(',').forEach((part) => {
    const [k, v] = part.split('=');
    parts[k] = v;
  });
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) return false;
  // `!(x <= tol)` también rechaza t no numérico (NaN).
  if (!(Math.abs(nowS - Number(t)) <= SIGNATURE_TOLERANCE_S)) return false;
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

// Parsea client_reference_id.
// Formatos soportados (los tokens prefijados pueden aparecer en cualquier orden):
//   "fbp||fbc"                          (compra inicial)
//   "fbp||fbc||ga:CLIENT_ID"            (con GA4 client_id)
//   "uid:UID||fbp||fbc||ga:CLIENT_ID"   (upgrade con GA4)
// fbp y fbc son posicionales (los unicos sin prefijo): el cliente manda "" en
// la posición que falta, nunca la omite.
export function parseClientRef(ref: string): { uid?: string; fbp?: string; fbc?: string; gaClientId?: string } {
  if (!ref) return {};
  const parts = ref.split('||');
  let uid: string | undefined;
  let gaClientId: string | undefined;
  const rest: string[] = [];
  for (const p of parts) {
    if (p.startsWith('uid:')) uid = p.slice(4);
    else if (p.startsWith('ga:')) gaClientId = p.slice(3);
    else rest.push(p);
  }
  return { uid, fbp: rest[0] || undefined, fbc: rest[1] || undefined, gaClientId };
}

// Para interpolar datos del comprador (nombre, mail) en el HTML de los mails.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;
