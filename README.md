# gabiuccello-monorepo

Monorepo del ecosistema **gabiuccello.com** — el sitio principal y todas las apps satélite alrededor de la marca personal.

## Estructura

```
.
├── apps/
│   ├── 7-pasos/         Next.js 14 + Firebase + Stripe — webapp del libro
│   │                    Dominio: libro.gabiuccello.com
│   │
│   └── gabiuccello/     HTML/CSS estático — sitio principal de marca
│                        Dominio: gabiuccello.com
│
├── package.json         npm workspaces (root)
└── README.md            este archivo
```

## Apps

### `apps/7-pasos`
Webapp companion del libro **7 Pasos para Cambiar tu Vida**. Programa de 180 días, onboarding en 3 fases, tracking de hábitos, integración con Stripe y notificaciones a Slack.
- Stack: Next.js 14 (App Router), Firebase Auth + Firestore, Tailwind, Vercel
- Dominio prod: `libro.gabiuccello.com`
- Docs específicas: `apps/7-pasos/README.md`, `apps/7-pasos/TECHNICAL.md`, `apps/7-pasos/PRODUCT.md`

### `apps/gabiuccello`
Sitio principal de gabiuccello.com — landing, libro, consultoría, curso.
- Stack: HTML/CSS estático (sin build)
- Dominio prod: `gabiuccello.com`
- Importado vía `git subtree` desde `github.com/ketzal88/web-gabi-uccello`

## Scripts (root)

```bash
npm install                      # instala deps de todos los workspaces

npm run dev:7-pasos              # next dev en apps/7-pasos
npm run build:7-pasos            # next build en apps/7-pasos
npm run dev:gabiuccello          # serve estático en localhost:5500

npm run deploy:7-pasos           # vercel preview del libro
npm run deploy:7-pasos:prod      # vercel prod del libro
npm run deploy:gabiuccello       # vercel preview del sitio principal
npm run deploy:gabiuccello:prod  # vercel prod del sitio principal
```

## Vercel

Cada app tiene su propio proyecto Vercel con `Root Directory` distinto:
- Proyecto **7-pasos**: Root Directory = `apps/7-pasos`, framework = Next.js
- Proyecto **gabiuccello**: Root Directory = `apps/gabiuccello`, framework = Other (static)

Esto permite deploys independientes — tocar el libro no rebuildea el sitio principal y viceversa.

## Cómo sumar una nueva app al "mundo gabiuccello"

1. Crear `apps/<nombre>/` con su propio `package.json` (si tiene build) o solo archivos estáticos
2. Si tiene `package.json`: agregar la ruta a `workspaces` en el root
3. Crear proyecto Vercel apuntando a `apps/<nombre>` como Root Directory
4. Conectar dominio o subdominio

Cuando haya ≥2 apps Next.js que compartan código (UI, design system, analytics), migrar a **Turborepo** para cache de builds y filtrado por workspace.
