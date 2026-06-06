# 7 Pasos para Cambiar tu Vida

Webapp companion del libro "7 Pasos para Cambiar tu Vida" — un programa de transformacion personal de 180 dias basado en micro-decisiones, oxitocina y disciplina progresiva.

---

## Que es

Una app que guia al usuario a traves de 3 etapas:

1. **Leer el libro** — Los 7 pasos se presentan como lectura inmersiva, secuencial, un paso a la vez
2. **Escribir 10 objetivos** — Al terminar la lectura (o durante el Paso 2), el usuario define sus metas para 180 dias
3. **Trackear victorias diarias** — Cada día el usuario registra micro-victorias relacionadas a sus objetivos

---

## Como funciona

### Fase 1: Lectura
- El usuario lee los 7 pasos en orden
- Cada paso tiene contenido completo del libro, ejercicios y citas
- Despues del Paso 2 se ofrece escribir objetivos (opcional)
- Al completar los 7, se activa la fase de objetivos

### Fase 2: Objetivos
- El usuario escribe 10 objetivos en presente ("Voy al gimnasio 3 veces por semana")
- 4 categorias: Personal, Profesional, Relaciones, Financiero
- Al tener 10 objetivos, puede activar el tracker

### Fase 3: Tracker (180 dias)
- Barra de progreso: "Dia X de 180"
- Sumar victorias diarias vinculadas a cada objetivo
- Reflexion/notas del día
- Calendario de 180 dias estilo heatmap
- Estadisticas: victorias totales, promedio por día

---

## Los 7 Pasos

1. **Todo Cuenta** — Cada micro-decision te acerca o te aleja de tus objetivos
2. **Objetivos** — 10 objetivos concretos, escritos en presente, para 180 dias
3. **Tu Entorno** — Tu entorno define tus resultados. Elegi a los que empujan
4. **Autopercepcion** — Como te hablas define lo que crees posible
5. **Disciplina** — El musculo que sostiene todo. Se entrena de a poco
6. **Tu Cuerpo** — Tu cuerpo es la suma de todas tus decisiones
7. **Tu Relacion con el Mundo** — Perdona, solta, se Suiza. Tu familia primero

---

## Filosofia de la app

- **Es un libro primero** — La lectura es la experiencia principal, no una feature mas
- **Oxitocina como motor** — Cada victoria genera una micro-dosis de recompensa que pide mas
- **Coach personal, no herramienta fria** — Tono cercano, feedback motivacional, celebraciones
- **Mobile-first** — Pensada para usar desde el celular todos los dias

---

## Tech Stack

- Next.js 14 + TypeScript
- Firebase (Auth + Firestore)
- Tailwind CSS
- Vercel (deploy)

Ver [TECHNICAL.md](TECHNICAL.md) para documentacion tecnica completa.

---

## Setup local

```bash
# Clonar
git clone <repo-url>
cd 7-pasos

# Instalar
npm install

# Configurar Firebase
cp .env.local.example .env.local
# Completar con las keys de tu proyecto Firebase

# Desarrollo
npm run dev
```

Abrir http://localhost:3000

---

## Estado actual: MVP

- Auth completo (email + Google)
- Lectura secuencial de 7 pasos con onboarding por fases
- Sistema de objetivos (10 max, 4 categorias)
- Tracker diario de victorias vinculadas a objetivos
- Calendario de progreso 180 dias (heatmap)
- Nav adaptiva por fase (items grises + candado hasta desbloquear)
- Responsive (mobile + desktop)

### Pendiente

- Pagos (Stripe) — libro $9 pago unico
- Notificaciones/reminders
- PWA (instalar como app)
- Integracion con GymCounter (cross-sell futuro)
