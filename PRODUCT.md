# Product

## Register

brand

## Users

El que necesita el método del libro. No alguien "cansado de habit trackers" ni "buscando productividad". Alguien cuya vida está en el mismo lugar hace 5 años y empieza a sospechar que sus micro-decisiones diarias le están dando exactamente esos resultados.

Tres perfiles concretos, los mismos que aparecen en la página de venta:

- **El Profesional Estancado.** Tiene un trabajo que funciona pero lo aburre. Siente que está desperdiciando potencial. Sabe que podría más, pero no tiene mapa para arrancar.
- **La Persona Saturada.** Leyó Hábitos Atómicos, Padre Rico, El Poder del Ahora. Tiene el conocimiento, le falta la ejecución. Necesita un sistema cerrado que le diga qué hacer hoy, sin tener que pensar.
- **El Que Quiere el Control.** Está cansado de culpar al país, al trabajo, a la familia. Quiere tomar las riendas, pero necesita arquitectura para hacerlo. No motivación, andamiaje.

Rasgos transversales:

- Vive en las micro-decisiones que el libro nombra: el café con azúcar, la gaseosa del mediodía, el scroll antes de dormir, los 20 minutos de caminata que no hace. La granularidad del libro le aterriza porque es su día real.
- Ya intentó cambiar varias veces y bounceó. Empezó dieta + gym + sin alcohol un lunes y se quemó el jueves. Lo que le faltó no fue voluntad, fue método.
- Respeta evidencia traducida a su cocina, no en abstracto. Le importa que Walker explica el sueño, que Duckworth muestra que el grit le gana al IQ, que Lally (UCL) probó que los hábitos tardan 66 días, no 21.
- Latino, principalmente rioplatense (Argentina/Uruguay como núcleo). La familia ocupa el centro, no es individualista anglo. "Tu familia primero, siempre" del Paso 7 le aterriza fuerte.

Contexto de uso: mobile-first. Sesiones cortas y repetidas (lectura matutina antes del celular, registro nocturno antes de dormir). La app vive en el bolsillo, pero la app es un extra del libro, no al revés: el libro se lee solo y funciona solo; la app no tiene sentido sin el libro.

## Product Purpose

El producto es el libro **"7 Pasos para Cambiar tu Vida"**, 35 minutos de lectura. El sistema completo de transformación de 180 días vive en sus 7 capítulos: Todo Cuenta → Objetivos → Entorno → Autopercepción → Disciplina → Cuerpo → Relaciones.

Monetización en 3 niveles (compra única en todos los casos, sin suscripción):

| Tier | Qué incluye | Precio |
|---|---|---|
| **Libro solo** | PDF + ePub + lectura desde la webapp | **US$12,99** |
| **Bundle (recomendado)** | Libro + app de tracking de 180 días + 10 objetivos guiados + calendario de progreso | **US$19,99** |
| **Upgrade desde dentro** | Quien compró el libro suma la app después | **+US$10** |

El bundle ahorra US$3 vs comprar libro + upgrade por separado. La oferta principal de la página de venta es el bundle; el libro solo existe como opción de entrada de bajo riesgo. Garantía 180 días: si aplicaste el sistema y no funcionó, devolución completa.

La webapp tiene dos roles, en este orden:

1. **Vender el libro/bundle** desde la landing (`public/venta.html`). El visitante entiende: esto es un método con respaldo (Lally, Walker, Duckworth, Locke & Latham), no motivación vacía. Sin jerga mística, sin promesas gringas.
2. **Sostener los 180 días** una vez comprado (`src/app/(app)/*`): lectura secuencial de los 7 pasos, escritura de los 10 objetivos (Paso 2), tracker diario de micro-victorias (Paso 5), calendario de progreso.

Éxito = (a) conversión en la landing con bundle como pick mayoritario, (b) retención real durante 180 días en la app, no abandono a la semana 2 como con los otros productos que probaron.

## Brand Personality

Tres palabras: **directo, anti-gurú, rioplatense**.

Voz: rioplatense neutra (vos, escribí, leé, trackeá), tono de alguien que aprendió esto a los golpes y lo cuenta sin chamuyo. Cita estudios cuando hace falta (Walker sobre sueño, Duckworth sobre grit, Matthews 42%, Lally 66 días, Locke & Latham), siempre traducidos a la cocina del lector: "2 cucharaditas de azúcar por café × 2 cafés/día × 180 días = 1,5 kg de grasa".

Tono emocional: cálido pero firme. "Tu cuerpo no es un obstáculo, es tu socio" no es sermón. "Es más fácil cambiar de entorno que tener disciplina de acero" es honestidad, no consigna. La voz elige mostrar el cálculo en vez de dar la lección.

Cadencias recurrentes ya establecidas en venta.html y que se mantienen como firma:

- **El antes/después tachado**: "El problema nunca fue ~~la fuerza de voluntad~~. Es la falta de orden."
- **El soñar/construir**: "Dejá de soñar tu vida. Empezá a construirla."
- **La verdad incómoda**: "Empezamos por la verdad incómoda."
- **La incomodidad asumida**: "Acá hay trabajo. Hay disciplina. Hay 180 días de incomodidad creativa."

Lo que la voz NO hace nunca: emojis decorativos en copy de marketing (los íconos de los 7 pasos son referencias, no decoración), exclamaciones múltiples, caps lock en titulares de cuerpo, frases sueltas tipo Instagram coach, "transformá tu vida" gritado en vacío. La transformación se calcula con días y micro-decisiones, no se promete.

## Anti-references

- **Libros de autoayuda gringos y gurús de Instagram.** Tony Robbins, Mel Robbins, Mark Manson en su versión más amplificada, frases sueltas con fondo de atardecer. La marca se construye en oposición directa a esto, no como variación.
- **Wellness/mindfulness con tipografías cursivas y pasteles** (Calm, Headspace en su peor versión). Esto no es yoga corporate. Es disciplina sostenida.
- **Self-help motivacional con emojis y caps lock** (MotivaApp, frases de Instagram coach). Lo opuesto a "sin chamuyo".
- **Apps de hábitos gamificadas extremas** (Habitica, Streaks en su forma más infantil). Rachas con explosiones, badges, niveles. Señalar progreso sí; dopamina barata no.
- **SaaS corporativo** (azul Stripe + gradientes morados + ilustraciones planas). Esto no es una herramienta de productividad, es un acompañante diario de 180 días.

## Design Principles

1. **El libro es el producto, no la app.** Cada decisión de UI se pregunta "¿esto refuerza el libro o lo opaca?". La app es la herramienta de aplicación, no la atracción. Por eso el tier "libro solo" existe sin app: el libro tiene que poder pararse solo.
2. **El sistema, no la motivación.** Headlines, copy y UI comunican sistema concreto (10 objetivos, 180 días, 66 días para automatizar, 1.440 minutos por día, US$3 de ahorro en el bundle). "Transformá tu vida" se gana con números, no se grita.
3. **Una sola batalla a la vez.** El Paso 5 es explícito: querer cambiar todo el lunes te quema el jueves. La UI tiene que respetar este principio, no apurar al usuario a "completarlo todo". Un paso por sesión, una victoria por momento, un objetivo a la vez si hace falta.
4. **Tibieza con bordes filosos.** La calidez vive en el rioplatense y en el cuidado del libro; los bordes filosos viven en la tipografía precisa, la matemática explícita y el copy directo. Cualquier deriva hacia wellness blando o motivational chillón se corrige hacia el centro.
5. **Mobile-primero, sin disculparse.** El usuario abre la app parado en el subte, antes de dormir, en pausa del trabajo. Sin densidad innecesaria, sin tooltips en hover, sin patrones que asumen mouse. Densidad pensada para pulgar.

## Accessibility & Inclusion

- **WCAG 2.1 AA mínimo.** El cuerpo del libro tiene que ser ≥4.5:1 sobre el fondo. Auditar específicamente `stone-500` sobre cream, y `--ink-3` (#8b8b85) sobre `--bg` (#0a0a0a) en venta.html: el segundo está bien, el primero está al borde.
- **Tipografía del libro generosa.** ≥18px en mobile para `prose-step p`. La lectura es la experiencia principal del producto; texto chico es regresión directa de valor.
- **`prefers-reduced-motion` respetado.** El repo ya tiene animaciones (`bounce-in`, `fillProgress`, `confetti-fall`, `fadeUp` en venta.html). Cada una necesita fallback. El venta.html ya lo aplica con un `@media (prefers-reduced-motion: no-preference)` wrapping. El resto del código aún no.
- **Sin dependencia exclusiva en color.** Los estados "leído / siguiente / bloqueado" usan icono + ring, no solo color. Mantener este patrón.
- **Lectura por TTS** (futuro, no MVP). Pensar en español rioplatense neutro para voces sintéticas. No prioritario hasta validar demanda.
