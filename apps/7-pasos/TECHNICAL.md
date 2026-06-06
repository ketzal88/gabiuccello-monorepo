# 7 Pasos para Cambiar tu Vida — Documentacion Tecnica

## Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3.4 + tema custom |
| Auth | Firebase Auth (Email + Google OAuth) |
| Database | Cloud Firestore |
| Iconos | Lucide React |
| Animaciones | Framer Motion |
| Fechas | date-fns |
| Deploy | Vercel |

---

## Estructura de Archivos

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (AuthProvider, fonts, metadata)
│   ├── page.tsx                      # Landing publica
│   ├── globals.css                   # Tailwind + estilos custom
│   ├── login/page.tsx                # Login/Registro
│   └── (app)/                        # Rutas protegidas (AuthGuard)
│       ├── layout.tsx                # Sidebar + nav adaptiva por fase
│       ├── dashboard/page.tsx        # Hub principal (3 fases)
│       ├── paso/[number]/page.tsx    # Lector de pasos (1-7)
│       ├── objetivos/page.tsx        # CRUD de 10 objetivos
│       ├── tracker/page.tsx          # Tracker de victorias diarias
│       └── progreso/page.tsx         # Calendario 180 dias
├── components/
│   ├── ui/                           # Button, Card, Input, Modal, ProgressBar
│   └── auth/                         # LoginForm, AuthGuard
├── context/
│   └── auth-context.tsx              # AuthProvider (user + profile + refreshProfile)
├── hooks/
│   ├── use-daily-log.ts              # Victorias del día + logs recientes
│   └── use-objectives.ts             # CRUD de objetivos
├── lib/
│   ├── firebase.ts                   # Init condicional (null-safe para build)
│   ├── auth.ts                       # signIn/signUp/signOut helpers
│   ├── firestore.ts                  # Todas las queries a Firestore
│   └── utils.ts                      # cn(), calculateDayNumber, formatDateES, etc.
└── data/
    └── steps-content.ts              # Contenido de los 7 pasos (703 lineas)
```

---

## Modelo de Datos (Firestore)

```
users/{userId}
├── displayName: string
├── email: string
├── createdAt: Timestamp
├── startDate: Timestamp              # Dia 1 de sus 180 dias
├── stepsRead: number[]               # [1, 2, 3] = leyo pasos 1, 2 y 3
├── onboardingPhase: "reading" | "objectives" | "tracking"
│
├── dailyLogs/{YYYY-MM-DD}
│   ├── date: string
│   ├── dayNumber: number             # 1-180
│   ├── victories: Victory[]
│   │   ├── id: string
│   │   ├── description: string
│   │   ├── category: string          # ID del objetivo relacionado
│   │   └── completedAt: Timestamp
│   ├── totalVictories: number
│   └── notes?: string
│
└── objectives/{objectiveId}
    ├── text: string                  # "Voy al gimnasio 3 veces por semana"
    ├── category: "personal" | "profesional" | "relaciones" | "financiero"
    ├── createdAt: Timestamp
    ├── order: number
    └── status: "active" | "completed"
```

---

## Flujo de Onboarding (3 fases)

```
Usuario nuevo → onboardingPhase: "reading"
│
├── Lee los 7 pasos secuencialmente
│   ├── Paso 2: prompt para escribir objetivos (opcional)
│   └── Paso 7: marca todos como leidos → fase cambia a "objectives"
│
├── onboardingPhase: "objectives"
│   ├── Escribe 10 objetivos
│   └── CTA "Activar tracker" → fase cambia a "tracking"
│
└── onboardingPhase: "tracking"
    ├── Dashboard con barra 180 dias
    ├── Tracker de victorias (dropdown = objetivos del usuario)
    ├── Progreso (calendario heatmap)
    └── Nav completa habilitada
```

---

## Navegacion por Fase

| Fase | El Libro/Dashboard | Tracker | Objetivos | Progreso |
|------|-------------------|---------|-----------|----------|
| reading | Activo (BookOpen) | Gris + candado | Gris hasta paso 2 | Gris + candado |
| objectives | Activo (BookOpen) | Gris + candado | Activo | Gris + candado |
| tracking | Activo (LayoutDashboard) | Activo | Activo | Activo |

---

## Rutas

| Ruta | Acceso | Descripcion |
|------|--------|-------------|
| `/` | Publica | Landing page |
| `/login` | Publica | Login/Registro |
| `/dashboard` | Auth | Hub principal (cambia por fase) |
| `/paso/[1-7]` | Auth | Contenido del paso |
| `/objetivos` | Auth | Gestion de objetivos |
| `/tracker` | Auth (tracking) | Tracker diario |
| `/progreso` | Auth (tracking) | Calendario 180 dias |

---

## Componentes UI

| Componente | Props clave |
|-----------|-------------|
| `Button` | variant (primary/secondary/ghost/danger), size (sm/md/lg) |
| `Card` | hover (efecto sombra), CardHeader, CardContent |
| `Input` | label, error; incluye TextArea |
| `Modal` | isOpen, onClose, title; cierra con Esc y backdrop |
| `ProgressBar` | value, max, size (sm/md/lg), showLabel |

---

## Variables de Entorno

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firebase se inicializa condicionalmente — si no hay `apiKey`, `auth` y `db` son `null` y la app buildea sin error.

---

## Tema Tailwind

- **Fondo:** cream-50 (#FAFAF8)
- **Acento:** victoria (emerald green palette, 50-700)
- **Texto:** stone-900 (#1C1917) / stone-500 (#78716C)
- **Fuente body:** Inter (Google Fonts)
- **Fuente display:** Georgia serif
- **Animaciones:** fade-in, slide-up, bounce-in, scale-in, fill-progress, pulse-slow

---

## Scripts

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

---

## Seguridad Firestore (Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Cada usuario solo puede leer/escribir sus propios documentos.
