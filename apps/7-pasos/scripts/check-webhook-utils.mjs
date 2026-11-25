// Self-check de la lógica pura del webhook de Stripe.
// Run: node --experimental-strip-types scripts/check-webhook-utils.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyStripeSignature, parseClientRef, escapeHtml, EMAIL_RE } from '../src/lib/webhook-utils.ts';

const secret = 'whsec_test';
const body = '{"id":"evt_1"}';
const now = 1_800_000_000;
const sign = (t) => `t=${t},v1=${crypto.createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')}`;

assert.equal(verifyStripeSignature(body, sign(now), secret, now), true);
assert.equal(verifyStripeSignature(body, sign(now - 299), secret, now), true);
assert.equal(verifyStripeSignature(body, sign(now - 301), secret, now), false, 'replay viejo');
assert.equal(verifyStripeSignature(body, sign(now), 'otro', now), false, 'secret incorrecto');
assert.equal(verifyStripeSignature(body + ' ', sign(now), secret, now), false, 'body alterado');
assert.equal(verifyStripeSignature(body, `t=abc,v1=00`, secret, now), false, 't no numérico');
assert.equal(verifyStripeSignature(body, '', secret, now), false);

assert.deepEqual(parseClientRef('uid:U1||fbp1||fbc1||ga:G1'), { uid: 'U1', fbp: 'fbp1', fbc: 'fbc1', gaClientId: 'G1' });
// Sin _fbp: la posición vacía se respeta y fbc no se corre a fbp.
assert.deepEqual(parseClientRef('uid:U1||||fbc1'), { uid: 'U1', fbp: undefined, fbc: 'fbc1', gaClientId: undefined });
assert.deepEqual(parseClientRef('fbp1||'), { uid: undefined, fbp: 'fbp1', fbc: undefined, gaClientId: undefined });
assert.deepEqual(parseClientRef(''), {});

assert.equal(escapeHtml(`<a href="x">Tom's & co</a>`), '&lt;a href=&quot;x&quot;&gt;Tom&#39;s &amp; co&lt;/a&gt;');

assert.equal(EMAIL_RE.test('ana@example.com'), true);
assert.equal(EMAIL_RE.test('ana@example'), false);
assert.equal(EMAIL_RE.test('<b>@x.com'), false);

console.log('check-webhook-utils: ok');
