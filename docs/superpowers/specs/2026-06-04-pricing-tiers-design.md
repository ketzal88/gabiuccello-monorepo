# Pricing Tiers Design — Libro / Bundle / Upgrade

**Date:** 2026-06-04
**Author:** Gabi (brainstormed con Claude)
**Status:** Approved — implementing

## Context

Hoy hay un único Payment Link de Stripe a USD $29 que da acceso a libro + app + lifetime. Queremos descomponer en 3 productos para abrir el funnel:

- **Libro solo** — entry-level. Lee el libro en la app, sin tracking.
- **Bundle libro + app** — opción recomendada. Todo incluido.
- **Upgrade app** — para quien compró libro solo y quiere desbloquear tracking después.

## Productos Stripe

| Producto | Stripe Product ID | USD | ARS (Stripe conv.) | Payment Link |
|---|---|---|---|---|
| Libro solo | `prod_UPH7uh1pVsjGBm` | $12.99 | $18.666,63 | EXISTENTE (`buy.stripe.com/aFa4gyajf0Og5Bk7rq7IY00`) — repurpose del $29 al nuevo precio |
| Bundle | `prod_Ue5zE76x9M1GE1` | $19.99 | $28.725,63 | **A crear** |
| Upgrade app | `prod_Ue60nMFZPJrlQy` | $10.00 | ~$14.366 | **A crear** |

**Estrategia ARS:** mostramos precio real de Stripe en el landing (no inventamos ARS). Disclaimer: "tu banco puede sumar impuestos PAIS/ganancias".

**Anchor pricing:** badge "Ahorrás $3 USD si lo agarrás todo junto" en el bundle ($12.99 + $10 = $22.99 separado vs $19.99 bundle).

## Schema change

Agregar `tier` a `UserProfile.subscription` (en `src/lib/firestore.ts`):

```ts
subscription?: {
  status: "active" | "suspended" | "gifted";
  tier: "book" | "full";                          // NUEVO
  grantedBy?: "purchase" | "admin" | "upgrade";   // agregar "upgrade"
  stripeSessionId?: string;
  upgradedAt?: Timestamp;                         // NUEVO
  purchasedAt?: Timestamp;
  expiresAt?: Timestamp;
}
```

Helper nuevo: `isFullTier(profile): boolean`.

## Webhook (`src/app/api/stripe-webhook/route.ts`)

Cambios:

1. **Mapa de productos** hardcodeado:
   ```ts
   const PRODUCT_BOOK = 'prod_UPH7uh1pVsjGBm';
   const PRODUCT_BUNDLE = 'prod_Ue5zE76x9M1GE1';
   const PRODUCT_UPGRADE = 'prod_Ue60nMFZPJrlQy';
   ```

2. **Detectar producto:** llamar `stripe.checkout.sessions.listLineItems(sessionId, { limit: 1, expand: ['data.price.product'] })`. Webhook tiene que importar `stripe` package por primera vez (hoy hace verificación manual de signature).
   - Alternativa más liviana: pasar `metadata.product_type` en el Payment Link al crearlo, evita llamada extra a Stripe API.

3. **Parser nuevo de `client_reference_id`:**
   - Compra inicial (libro/bundle): `fbp||fbc` (igual que hoy)
   - Upgrade: `uid:UID||fbp||fbc` — detectar prefijo `uid:`

4. **Tres flujos:**
   - `PRODUCT_BOOK` → crear usuario, `tier: "book"`
   - `PRODUCT_BUNDLE` → crear usuario, `tier: "full"`
   - `PRODUCT_UPGRADE` → buscar user por UID, set `tier: "full"`, `grantedBy: "upgrade"`, `upgradedAt: now`

5. **Emails:** template separado para libro-solo (incluye CTA "probá la app sin tracking" + invita a upgrade) vs bundle (todo activado).

## App gating (`src/app/(app)/layout.tsx`)

Lógica nueva en `useNavItems()`:

```ts
const tier = profile?.subscription?.tier ?? "full"; // default full para usuarios viejos
const isBookOnly = tier === "book";

// Si es book-only, estas siempre disabled sin importar onboardingPhase
disabled: isBookOnly ? true : !isTracking
```

Componente nuevo `<UpgradeBanner />` que se renderiza arriba del `<main>` cuando `tier === "book"`. Naranja, persistente, link a `/upgrade`.

## Página `/upgrade` (nueva)

`src/app/(app)/upgrade/page.tsx`:
- Preview visual de Tracker/Objetivos/Progreso
- Bullet list de qué incluye
- Botón Stripe con `?client_reference_id=uid:${user.uid}||${fbp}||${fbc}`

## Landing (`public/venta.html`)

Reemplazar la card única "Acceso Total $29" por dos cards lado a lado:

```
┌─────────────────────┐  ┌─────────────────────┐
│   LIBRO             │  │   LIBRO + APP       │
│   $12.99 USD        │  │   $19.99 USD        │
│   $18.666 ARS       │  │   $28.725 ARS       │
│                     │  │                     │
│   ✓ PDF + ePub      │  │   ✓ Todo del libro  │
│   ✓ Lectura en app  │  │   ✓ Tracker         │
│                     │  │   ✓ Objetivos       │
│                     │  │   ✓ Progreso        │
│                     │  │   ✓ Lifetime        │
│                     │  │                     │
│   [Empezar →]       │  │   [Acceso Total →]  │
└─────────────────────┘  └─────────────────────┘
                          ↑ Badge: "Ahorrás $3"
```

JS: extender `patchStripeLinks()` para que cada link reciba su `client_reference_id` independientemente (mismo formato `fbp||fbc` para ambos initial purchases).

## Garantía (cambio de copy)

Era "sin formularios". Pasa a **condicional con prueba**:

- **Sección guarantee:** "Si en 180 días aplicaste el sistema y no funcionó, escribime con tu progreso (qué pasos completaste, qué intentaste) y devuelvo todo."
- **FAQ:** explicar que requerimos ver uso (steps marcados, evidencia escrita) para procesar refund. Defensible legalmente: tenemos `stepsRead[]` en Firestore.
- Aplica a ambos tiers + upgrade.

## Página `/gracias`

Mensaje según tier (detectar por session_id → fetch Stripe → product):
- `tier: book` → "Tu libro está listo. ¿Querés también el sistema de tracking?"
- `tier: full` → "Acceso total activado, empezá ahora."

## Backfill

Script one-off (`scripts/backfill-tier.ts` o admin endpoint protegido):
- For each user con `subscription.status: "active"` y sin `subscription.tier`
- Set `subscription.tier: "full"` (todos los actuales pagaron el bundle viejo)

Idempotente, se puede correr en producción una vez.

## Archivos tocados

```
public/venta.html                              [edit]
src/lib/firestore.ts                           [edit — type + helper]
src/app/api/stripe-webhook/route.ts            [edit — 3-product flow]
src/app/(app)/layout.tsx                       [edit — gating + banner]
src/app/(app)/upgrade/page.tsx                 [NEW]
src/components/upgrade-banner.tsx              [NEW]
src/app/gracias/page.tsx                       [edit — tier-aware]
scripts/backfill-tier.ts                       [NEW]
```

## Dependencias humanas

Antes de probar end-to-end, Gabi tiene que:
1. **Editar el Payment Link existente** para que cobre $12.99 (no $29) y apunte a `prod_UPH7uh1pVsjGBm`
2. **Crear 2 Payment Links nuevos** en Stripe Dashboard:
   - Bundle ($19.99) → success URL `https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}`
   - Upgrade ($10) → success URL `https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}&type=upgrade`
3. Anotar las URLs y pasarlas — las vamos a hardcodear (o env vars `STRIPE_LINK_BUNDLE`, `STRIPE_LINK_UPGRADE`).

## Out of scope (no en esta iter)

- MercadoPago integración (solo USD por ahora)
- Bumps / order bumps post-checkout
- Trial / subscription model
- Refund automation desde admin panel
