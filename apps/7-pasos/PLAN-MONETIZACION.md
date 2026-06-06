# Plan de Monetizacion: 7 Pasos para Cambiar tu Vida

## Modelo Actual (v1)

Un solo producto, un solo precio. Simple.

### Pricing

| Producto | Tipo | Precio |
|----------|------|--------|
| 7 Pasos — Libro completo | Pago unico | $9 USD |

### Que incluye el pago de $9

```
Gratis (sin pago, sin cuenta):
├── Landing page
├── Tracker basico (sin guardar progreso)
└── Preview de los 7 pasos (titulo + resumen)

Libro completo ($9 unico, acceso de por vida):
├── Los 7 pasos completos
├── Framework de micro-decisiones y oxitocina
├── Defini tus 10 objetivos (4 categorias)
├── Tracker diario con cuenta (180 dias)
├── Lectura matutina de tus objetivos
└── Progreso guardado y visualizacion de racha
```

---

## Implementacion Tecnica (Stripe)

**Archivos a crear/modificar:**
- `src/lib/stripe.ts` — Config de Stripe (client + server)
- `src/app/api/stripe/checkout/route.ts` — API route para crear sesion de checkout
- `src/app/api/stripe/webhook/route.ts` — Webhook para confirmar pagos
- `src/lib/firestore.ts` — Actualizar `UserProfile.subscription`

**Producto en Stripe:**
```
prod_libro → price_libro ($9, one_time)
```

**Flujo de pago:**
```
Usuario visita landing → ve preview de pasos (gratis)
  → Quiere leer → checkout $9 (libro)
  → Pago exitoso → acceso completo (lectura + objetivos + tracker)
```

**Campos en Firestore:**
```
onboardingPhase: "preview" | "reading" | "objectives" | "tracking"
subscription: {
  plan: "free" | "libro"
  status: "active" | "none"
  stripeCustomerId: string
}
```

- `preview`: puede ver titulos y resumenes de cada paso, pero no el contenido completo
- `reading`/`objectives`/`tracking`: compro el libro, acceso completo

**Copy del boton:** "Empezar por $9 →"

**Copy de la card:**
- Tag: "LIBRO COMPLETO"
- Precio: $9
- Subtitulo: "USD · Acceso de por vida"

---

## Fase Futura: Cross-sell con GymCounter

Cuando GymCounter este listo, se agrega un tier de suscripcion bundle.
Hasta entonces, el modelo es simple: $9 y listo.

### Momento clave de cross-sell: Paso 6 ("Tu Cuerpo")
- Al terminar el Paso 6, banner sugiriendo GymCounter
- En el tracker, si el usuario suma una victoria fisica → sugerir GymCounter

---

## Metricas a Trackear

- Conversion landing → registro (gratis)
- Conversion registro → compra libro ($9)
- Dias promedio de retencion (de 180)
- Victorias promedio por día por usuario activo
