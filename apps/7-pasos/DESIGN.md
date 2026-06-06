---
name: 7 Pasos para Cambiar tu Vida
description: Direct-response brutalist editorial system for a 180-day transformation book and its companion app.
colors:
  bg: "#0a0a0a"
  bg-2: "#141414"
  bg-3: "#1c1c1c"
  ink: "#fafaf5"
  ink-2: "#d4d4cf"
  ink-3: "#8b8b85"
  accent: "#f97316"
  accent-light: "#fb923c"
  accent-glow: "rgba(249, 115, 22, 0.18)"
  line: "#262626"
  line-2: "#333333"
  step-1: "#fbbf24"
  step-2: "#60a5fa"
  step-3: "#a78bfa"
  step-4: "#fb923c"
  step-5: "#f87171"
  step-6: "#22d3ee"
  step-7: "#818cf8"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(38px, 7vw, 84px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(32px, 5vw, 56px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-large:
    fontFamily: "Manrope, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.15em"
rounded:
  none: "0"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "80px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "18px 36px"
  button-primary-hover:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  card-default:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px"
  card-recommended:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "36px 28px"
  chip-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    padding: "0"
---

# Design System: 7 Pasos para Cambiar tu Vida

## 1. Overview

**Creative North Star: "The Field Manual"**

This is the visual system of a craftsman who learned the work through repetition and writes it down so the next person can shorten the climb. Not a glossy self-help cover, not a wellness sanctuary, not a SaaS dashboard. A field manual: dark cover, type that earns its weight, calculations on every page, no chamuyo. Built for a 180-day commitment, not a weekend impulse.

The system reads dark by default because the brand's commercial moment (the sale page) is dark, and the post-purchase experience must feel continuous with it. The buyer who clicks through a brutalist editorial landing should not land in a soft cream wellness app. The whole arc, from landing to dashboard to tracker, lives in the same room.

The voice is rioplatense, anti-gurú, and evidence-driven. The numbers do the heavy lifting (1.440 minutos al día, 66 días para automatizar un hábito, 1,5 kg de azúcar por año si seguís con dos cafés azucarados). Decoration that doesn't earn its place gets cut.

**Key Characteristics:**

- Dark surface as the canonical canvas (`#0a0a0a` floor, two surface tiers above).
- Single accent (orange `#f97316`) used for primary actions, brand moments, and one decorative glow per major section.
- Three fonts maximum (Archivo Black display, Manrope body, JetBrains Mono labels). Cormorant Garamond was removed mid-cycle as an editorial-magazine reflex; do not re-introduce it.
- Square-ish corners (`6px`–`12px`) and 1px lines as the dominant separator. No glassmorphism, no large rounded card stacks, no gradient floods.
- Display type does the rhetorical work; body type is restrained Manrope at a comfortable measure.

## 2. Colors

A near-black canvas with two layered surfaces above it, a single orange accent for actions and brand moments, and a small set of step accents that map 1:1 to the book's seven chapters.

### Primary
- **Brand Orange** (#f97316): The single accent. Used for primary CTAs, the announcement bar, anchor underlines on headline emphasis, focus rings, success markers in the offer cards, decorative bar separators in eyebrows that remain (two on the whole site). Hover state shifts to a lighter orange (#fb923c). **The accent never carries more than ~10% of any screen.** It is rarity made visible.

### Neutral
- **Ground** (#0a0a0a): Body background. The floor of the whole system.
- **Surface 1** (#141414): One tier above ground; used for offer cards, problem cards, science panels, dashboard panels.
- **Surface 2** (#1c1c1c): Two tiers above ground; used for nested elements inside Surface 1 (e.g., the chart panel inside the science section).
- **Ink** (#fafaf5): Primary text. A very-slightly-warm off-white at chroma ~0.01; warmth comes from being deliberately not-pure-white.
- **Ink Soft** (#d4d4cf): Secondary text, decks, long body paragraphs that need to sit visually below the accent.
- **Ink Muted** (#8b8b85): Captions, mono labels, tertiary metadata. Tested at 5.82:1 contrast on Ground; passes WCAG AA for normal text.
- **Line** (#262626): Dominant 1px separator between sections and cards.
- **Line Bright** (#333): Stronger 1px line used inside denser zones (chart axes, table cells).

### Tertiary — Step Accents
The seven book chapters each carry their own hue. These are CONTENT colors, not brand colors: they identify the chapter, not the action. On dark surfaces use these specific tunings, calibrated for ≥4.5:1 contrast against `#0a0a0a` and `#141414`.

- **Paso 1 — Todo Cuenta** (#fbbf24, gold-amber).
- **Paso 2 — Objetivos** (#60a5fa, soft sky blue).
- **Paso 3 — Tu Entorno** (#a78bfa, light violet).
- **Paso 4 — Autopercepción** (#fb923c, warm orange; visually adjacent to the accent but used only on chapter contexts, never on actions).
- **Paso 5 — Disciplina** (#f87171, soft red).
- **Paso 6 — Tu Cuerpo** (#22d3ee, light cyan).
- **Paso 7 — Tu Relación con el Mundo** (#818cf8, light indigo).

### Named Rules
**The One Voice Rule.** The brand accent (orange `#f97316`) is used on ≤10% of any screen. If you look at a wireframe and the orange feels generous, it's already wrong.

**The Three Surface Rule.** The system uses exactly three background tiers (Ground / Surface 1 / Surface 2). No fourth. Stacking deeper invents hierarchy the eye can't read.

**The Chapter ≠ Action Rule.** Step accents (the seven chapter hues) identify which chapter the user is in. They never live on a button, a CTA, or an interactive control. Those belong to the brand accent.

## 3. Typography

**Display Font:** Archivo Black (with sans-serif fallback). One weight, one purpose: rhetorical headlines and section titles.
**Body Font:** Manrope (with sans-serif fallback). Five weights (400, 500, 600, 700, 800) carry every paragraph, label, button, and form field.
**Label/Mono Font:** JetBrains Mono (with monospace fallback). Two weights (500, 600). Reserved for tracked-uppercase labels (paso numbers, metadata, trust strip), no body copy.

**Character:** Archivo Black does the shouting; Manrope handles the conversation. The pair has high contrast (heavy display vs. moderate-weight humanist body) so hierarchy is unmistakable even at a glance. JetBrains Mono adds a third register for "system" voice (numbers, dates, technical labels) without competing.

### Hierarchy

- **Display** (Archivo Black, `clamp(38px, 7vw, 84px)`, line-height `0.95`, letter-spacing `-0.035em`): Hero h1 and final-CTA h1. One per page maximum, two when the page is dedicated to a single conversion moment.
- **Headline** (Archivo Black, `clamp(32px, 5vw, 56px)`, line-height `1`, letter-spacing `-0.03em`): Section h2s. Set with `text-wrap: balance`.
- **Title** (Archivo Black, `24px`, line-height `1.1`, letter-spacing `-0.02em`): h3s inside cards, offer card titles, step names.
- **Body** (Manrope, `16px`, line-height `1.6`): Default paragraph. Cap measure at 65–75ch.
- **Body Large** (Manrope, `clamp(16px, 2vw, 19px)`, line-height `1.55`): Section lead paragraphs (the `.section-lead` class on the landing). Cap measure at 60ch.
- **Label** (JetBrains Mono, `11px`, weight `600`, letter-spacing `0.15em`, uppercase): Paso numbers, metadata strips ("PAGO ÚNICO · ACCESO INMEDIATO"), trust pills.

### Named Rules

**The Italic-Sans Emphasis Rule.** When emphasis is needed inside a headline, use italic Manrope at weight 400 with `ink-soft` color. **Never** italic serif (Cormorant Garamond and similar editorial-italic patterns are forbidden; they were removed in this redesign and must not return).

**The Display Restriction Rule.** Archivo Black is used only for h1, h2, h3, and the offer card primary CTA copy. Buttons, labels, body, form fields, and UI chrome use Manrope. A display font in a button label is the strongest tell of an over-designed surface.

**The Mono Discipline Rule.** JetBrains Mono is allowed only for labels and metadata: paso numbers, tracked-uppercase strips, prices in monospace-flavored callouts. Mono in body copy reads as costume.

## 4. Elevation

This system is **layered, not lifted**. Depth comes from three stacked background tiers (Ground → Surface 1 → Surface 2) and 1px lines between them, not from shadows. The single exception is the offer card's "recommended" tier, which uses a neutral dark shadow plus a subtle accent ring to mark commercial primacy.

### Shadow Vocabulary

- **Recommended-card lift** (`box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(249, 115, 22, 0.18)`): The only persistent shadow in the system. Used exclusively on the "RECOMENDADO · AHORRÁS US$3" bundle card. Combines neutral dark falloff with a hairline accent ring; reads as "elevated, attention-worthy" without the AI-generated colored-glow trope.
- **Accent halo on hero** (`radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)`, ~800px diameter, centered behind the headline): Atmospheric background light, not a box-shadow. One per major commercial section (hero, offer). Never on cards.

### Named Rules

**The Flat-By-Default Rule.** Cards, panels, and surfaces are flat at rest. The only persistent box-shadow is the recommended offer card; the only persistent background glow is the hero's accent halo. If you reach for a shadow to differentiate a third card type, you already have a hierarchy problem.

**The No-Colored-Glow Rule.** Colored box-shadows (orange glow under cards, blue glow under buttons) are the saturated AI tell of 2026 dark-mode designs. They are forbidden. The recommended card combines a neutral dark falloff with a 1px accent ring; that's the only sanctioned exception.

## 5. Components

### Buttons

- **Shape:** Sharp-corner-leaning radius (`6px`). Square-ish. Never pill-shaped CTAs.
- **Primary** (`button-primary`): Background `#f97316`, text `#0a0a0a`, padding `18px 36px`, font Archivo Black uppercase `18px` letter-spacing `0.02em`. Border `2px solid #f97316`. The shape and weight read as a stamp, not a button.
- **Hover / Focus:** On hover, swap to background `#0a0a0a` with text `#f97316` (the orange becomes the border); the inline arrow `→` translates 4px right; subtle lift via `translateY(-2px)`. Shadow grows from `0 12px 30px -10px var(--accent-glow)` to `0 18px 40px -12px var(--accent-glow)`. **This is the only place an accent glow shadow is allowed; the hover is a commercial moment.**
- **Nav CTA (secondary):** Background `#f97316`, text `#0a0a0a`, mono label, `9px 18px` padding. Smaller, used in sticky nav.
- **Ghost (in offer card non-recommended):** Background transparent, text `ink`, border `2px solid #333` (Line Bright). Hover fills with accent.

### Cards

- **Corner Style:** `12px` for offer cards, `8px` for problem cards and forwhom cards.
- **Background:** `#141414` (Surface 1). Nested chart panel inside science: `#1c1c1c` (Surface 2).
- **Shadow Strategy:** Flat by default. See Elevation for the one exception.
- **Border:** `1px solid #262626` (Line). Hover on for-whom cards shifts border to `#f97316` and applies a 4px `translateY(-4px)` lift.
- **Internal Padding:** `28px` standard, `36px 28px` for primary offer card.

### Step List (Mechanism Section)

The seven pasos render as a vertical grid of three columns: paso number (Archivo Black 48px in `#f97316`, with a small mono "PASO" eyebrow above), step title + description (Archivo Black title + Manrope body), and a single emoji icon. Row separated by 1px Line. Hover the row, background lifts to Surface 1.

### Pricing Cards (Offer Section)

The offer is a 2-column grid of cards. The recommended card is identified by:
1. A `2px solid #f97316` border (vs. `1px solid #262626` on the standard card).
2. A `translateY(-8px)` lift (collapsed on mobile).
3. The "Recommended-card lift" shadow (see Elevation).
4. A floating badge centered above the top edge: "RECOMENDADO · AHORRÁS US$3" in mono uppercase on accent background.

The checked / unchecked bullet pattern is part of the card vocabulary. Included items get a filled orange circle with a checkmark; excluded items get a Line-Bright circle with an X. The same vocabulary is reusable in any feature-comparison surface.

### Navigation

Sticky top nav with `rgba(10, 10, 10, 0.85)` background and `backdrop-filter: blur(12px)`. Border-bottom `1px solid #262626`. Logo on left in Archivo Black 16px with the `·` separator in accent. CTA on right.

### FAQ Item

A `<details><summary>` pattern. Closed: summary in Archivo Black 18px. Open: the `+` rotates 45° into an `×`. Border-bottom `1px solid #262626` between items. No accordion gymnastics; the native HTML behavior is the design.

### Signature Component — Strike-Through Conclusion

A rhetorical device used once per section in the heaviest moments: a word or phrase struck through with an accent bar at -2deg rotation, immediately followed by the correction in accent color. Used in: "El problema nunca fue ~~la fuerza de voluntad~~. Es la falta de orden." This is voice-as-design, not decoration. Use sparingly; one per page maximum.

## 6. Do's and Don'ts

Carry the strategic line from PRODUCT.md through into visual decisions. Every anti-reference in PRODUCT.md appears below as a Don't.

### Do:

- **Do** use Archivo Black + Manrope + JetBrains Mono as the only three families on every surface.
- **Do** anchor every screen on `#0a0a0a` Ground. Surface 1 (`#141414`) for cards. Surface 2 (`#1c1c1c`) only when nested.
- **Do** reserve orange (`#f97316`) for primary actions, brand moments, and one decorative halo per major section. Aim for ≤10% of any screen.
- **Do** use mono labels (JetBrains Mono uppercase 11px, letter-spacing 0.15em) for paso numbers and metadata strips. Two eyebrows max on the entire landing.
- **Do** carry the seven step accent colors as chapter identifiers in the app interior (dashboard, tracker, paso pages), keeping the same hues calibrated for dark surface contrast.
- **Do** lead headlines with calculations: "1.440 minutos por día", "66 días para automatizar", "1,5 kg de azúcar/año". Numbers earn their headline slot.
- **Do** use `text-wrap: balance` on h1-h3 and `text-wrap: pretty` on long body prose.
- **Do** respect `prefers-reduced-motion: reduce` on every animation (the announcement bar pulse, the hero fade-up cascade, the offer card hover lift).

### Don't:

- **Don't** introduce Cormorant Garamond or any italic-serif display font. The editorial-magazine reflex was removed mid-cycle; reinstating it is regression. (PRODUCT.md anti-reference: *wellness/mindfulness con tipografías cursivas y pasteles*).
- **Don't** put colored box-shadow glows under cards or buttons (orange glow, blue glow, purple glow). This is the saturated AI dark-mode tell of 2026. The recommended-card shadow is the single sanctioned exception and combines neutral dark falloff with a hairline accent ring.
- **Don't** use tracked-uppercase eyebrow labels above every section. Exactly two eyebrows exist on the landing (Offer, FAQ); both anchor functional navigation. Adding more is AI scaffolding. (Absolute ban from PRODUCT.md design principles.)
- **Don't** use numbered section markers (01 / 02 / 03) as section labels unless they represent a real sequence. Paso 01-07 in the mechanism section is legitimate (the book's actual chapter order); PERFIL 01/02/03 on the for-whom cards was scaffolding and was removed.
- **Don't** use em dashes (— or `--`) in body copy. Replace with commas, colons, semicolons, periods, or parentheses. The detector ran clean after the redesign; keep it that way.
- **Don't** ship gradient text (`background-clip: text` with a gradient). The hero's accent emphasis uses a solid color with a -2% to +102% underline mark, not gradient text.
- **Don't** import emoji or icon decorations into copy. The seven step emojis (⚡ 🎯 👥 🪞 💪 🧬 🕊️) are book content (they identify chapters); other emojis don't earn a place. (PRODUCT.md anti-reference: *self-help motivacional con emojis y caps lock*.)
- **Don't** reach for serif italic in headlines for "elegance". Italic Manrope at weight 400 is the system's emphasis register.
- **Don't** stack more than three background tiers. If a card needs to feel "deeper" than Surface 2, the hierarchy is broken; refactor.
- **Don't** introduce SaaS-cliché surfaces (Stripe blue, Notion gradients, Linear purple). The brand is built in deliberate opposition to that lane. (PRODUCT.md anti-reference: *SaaS corporativo, azul Stripe + gradientes morados + ilustraciones planas*.)
