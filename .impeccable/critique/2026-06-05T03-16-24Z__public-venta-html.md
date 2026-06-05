---
timestamp: 2026-06-05T03-16-24Z
slug: public-venta-html
---
# Critique: `public/venta.html`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | n/a |
| 2 | Match System / Real World | 4 | "180 días", "35 minutos", USD + ARS. Lenguaje del lector |
| 3 | User Control and Freedom | 3 | Sin back-to-top, sin skip-link |
| 4 | Consistency and Standards | 1 | Final CTA "$29", bundle URL placeholder, pixel value hardcoded 29.00 |
| 5 | Error Prevention | 2 | Placeholder URL en producción |
| 6 | Recognition Rather Than Recall | 4 | Pricing comparado visualmente |
| 7 | Flexibility and Efficiency | 2 | Sin keyboard nav |
| 8 | Aesthetic and Minimalist Design | 3 | 4 fonts, 6 eyebrows, 6 italic-serif moments |
| 9 | Error Recovery | 3 | n/a en landing |
| 10 | Help and Documentation | 4 | 8 FAQs específicas |
| **Total** | | **30/40** | **Good** |

## Anti-Patterns Verdict

**LLM**: editorial-typographic + brutalist-utility lane saturado. Identity-preservation se respeta. Tics dentro del lane: 6 eyebrows tracked uppercase, 6 momentos italic-serif Cormorant, stack de 4 fonts.

**Detector**:
1. em-dash-overuse (warning): 7 em-dashes en body.
2. numbered-section-markers (advisory): 01-06. Aceptado en Pasos (secuencia real), no aceptado en Perfiles (paralelos).
3. dark-glow (warning): box-shadow naranja en card recomendada.

## Priority Issues

### [P0] CTA final dice "$29" — precio fantasma
Línea 1587. Reemplazar por "Elegí tu tier ↓".

### [P0] Bundle CTA va a REEMPLAZAR_CON_LINK_BUNDLE
Línea 1460. Crear Stripe Payment Link para prod_Ue5zE76x9M1GE1.

### [P0] Pixel events mandan value: 29.00 hardcoded
Líneas 1683 y 1700. Tomar value del data-value del botón clickeado.

### [P1] Chart 21→66→90→180 conflate concepts
Sacar 90 y 180. Quedar con 21 (mito) vs 66 (Lally).

### [P1] Em-dash overuse
7 em-dashes en body. Reemplazar con comas, dos puntos, puntos.

### [P1] PERFIL 01/02/03 numerados sin ser secuencia
Líneas 1317-1327. Sacar numeración.

## Persona Red Flags

**Jordan**: confundido por $29 vs $12,99/$19,99 en oferta. Bundle CTA muerto = abandono.
**Riley**: detecta placeholder URL y pixel value bug en network tab.
**Casey**: en mobile el libro solo aparece antes que el bundle (recomendado pierde jerarquía).
**Saturada**: name-drop Hábitos Atómicos es oro; chart inflado y 6 italic-serif son alertas.

## Minor Observations

- `.pulse` del announcement no respeta prefers-reduced-motion.
- Stack 4 fonts (Archivo Black + Cormorant + JetBrains Mono + Manrope), cap es 3.
- 6 section-eyebrows: reducir a 1-2.
- Mobile order de offer cards: bundle primero.

## Questions to Consider

- Chart como una sola cifra ("66 días según UCL") sin barras.
- CTA final como acción ("Quiero los 7 pasos →"), no precio.
- Una sola sección italic-serif, no 6.
- Perfiles con retrato chico en vez de PERFIL 01/02/03.
