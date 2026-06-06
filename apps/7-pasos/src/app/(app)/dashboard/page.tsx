"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useDailyLog } from "@/hooks/use-daily-log";
import { useObjectives } from "@/hooks/use-objectives";
import { updateOnboardingPhase, type Objective } from "@/lib/firestore";
import {
  calculateProgress,
  formatDateES,
  getEndDate,
  getObjectiveLabel,
  cn,
} from "@/lib/utils";
import {
  Zap,
  Target,
  Users,
  Eye,
  Dumbbell,
  HeartPulse,
  Feather,
  Plus,
  Trophy,
  Flame,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Lock,
  ArrowRight,
  Download,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Step configuration ────────────────────────────────────────────────

interface StepStyle {
  icon: LucideIcon;
  text: string;
  bg: string;
}

const stepStyles: StepStyle[] = [
  { icon: Zap, text: "text-paso-1", bg: "bg-paso-1/10" },
  { icon: Target, text: "text-paso-2", bg: "bg-paso-2/10" },
  { icon: Users, text: "text-paso-3", bg: "bg-paso-3/10" },
  { icon: Eye, text: "text-paso-4", bg: "bg-paso-4/10" },
  { icon: Dumbbell, text: "text-paso-5", bg: "bg-paso-5/10" },
  { icon: HeartPulse, text: "text-paso-6", bg: "bg-paso-6/10" },
  { icon: Feather, text: "text-paso-7", bg: "bg-paso-7/10" },
];

const stepNames = [
  "Todo Cuenta",
  "Objetivos",
  "Tu Entorno",
  "Autopercepción",
  "Disciplina",
  "Tu Cuerpo",
  "Tu Relación con el Mundo",
];

const stepSummaries = [
  "Cada micro-decisión te acerca o te aleja de tus objetivos",
  "10 objetivos concretos, escritos en presente, para 180 días",
  "Tu entorno define tus resultados. Elegí a los que empujan",
  "Cómo te hablás define lo que creés posible",
  "El músculo que sostiene todo. Se entrena de a poco",
  "Tu cuerpo es la suma de todas tus decisiones",
  "Perdoná, soltá, sé Suiza. Tu familia primero",
];

// ─── Brand UI primitives ───────────────────────────────────────────────

function PasoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-brand-mono text-[10px] uppercase tracking-[0.18em] text-brand-ink-3",
        className,
      )}
    >
      {children}
    </span>
  );
}

function AccentLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-brand-mono text-[10px] uppercase tracking-[0.18em] text-brand-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

function ProgressTrack({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-brand-line"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-brand-accent transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-md border-2 border-brand-accent bg-brand-accent px-6 py-3.5",
        "font-brand-display text-sm uppercase tracking-wide text-brand-bg",
        "transition-colors duration-200 motion-reduce:transition-none",
        "hover:bg-brand-bg hover:text-brand-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-accent disabled:hover:text-brand-bg",
        className,
      )}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  type = "button",
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border-2 border-brand-line-2 bg-transparent px-6 py-3.5",
        "font-brand-body text-sm font-semibold text-brand-ink",
        "transition-colors duration-200 motion-reduce:transition-none",
        "hover:border-brand-ink-3 hover:bg-brand-bg-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink-3",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Panel({
  children,
  className,
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-brand-bg-2 p-6",
        accent ? "border-brand-accent/50" : "border-brand-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DownloadsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <a
        href="/libro/7-pasos-para-cambiar-tu-vida.pdf"
        download
        className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-bg-2 p-3 no-underline transition-colors hover:border-brand-line-2"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-brand-line">
          <Download size={15} className="text-brand-ink-2" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-brand-ink leading-tight">Descargar PDF</p>
          <p className="text-xs text-brand-ink-3">Para leer offline</p>
        </div>
      </a>
      <a
        href="/libro/7-pasos-para-cambiar-tu-vida.epub"
        download
        className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-bg-2 p-3 no-underline transition-colors hover:border-brand-line-2"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-brand-line">
          <Download size={15} className="text-brand-ink-2" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-brand-ink leading-tight">Descargar EPUB</p>
          <p className="text-xs text-brand-ink-3">Para Kindle, Apple Books, Kobo</p>
        </div>
      </a>
    </div>
  );
}

function StepRow({
  stepNum,
  isRead,
  isNext,
  isLocked,
}: {
  stepNum: number;
  isRead: boolean;
  isNext: boolean;
  isLocked: boolean;
}) {
  const { icon: Icon, text, bg } = stepStyles[stepNum - 1];
  const name = stepNames[stepNum - 1];
  const summary = stepSummaries[stepNum - 1];
  const padded = stepNum.toString().padStart(2, "0");

  return (
    <Link
      href={isLocked ? "#" : `/paso/${stepNum}`}
      onClick={(e) => isLocked && e.preventDefault()}
      className={cn(
        "group flex items-center gap-4 rounded-lg border bg-brand-bg-2 p-4 no-underline transition-all duration-200 motion-reduce:transition-none",
        isLocked
          ? "cursor-default border-brand-line opacity-40"
          : isNext
          ? "border-brand-accent/60 hover:border-brand-accent"
          : "border-brand-line hover:border-brand-line-2 hover:translate-x-1",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md",
          isLocked ? "bg-brand-line" : bg,
        )}
      >
        {isLocked ? (
          <Lock size={18} className="text-brand-ink-3" />
        ) : (
          <Icon size={20} className={text} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <PasoLabel>Paso {padded}</PasoLabel>
          {isRead && <CheckCircle2 size={13} className="text-brand-accent" />}
          {isNext && (
            <span className="rounded bg-brand-accent px-1.5 py-0.5 font-brand-mono text-[9px] uppercase tracking-wider text-brand-bg">
              Siguiente
            </span>
          )}
        </div>
        <h3 className="mt-1 font-brand-display text-base leading-tight text-brand-ink">
          {name}
        </h3>
        <p className="mt-1 font-brand-body text-sm leading-snug text-brand-ink-3 line-clamp-1">
          {summary}
        </p>
      </div>
      {!isLocked && (
        <ChevronRight
          size={16}
          className="flex-shrink-0 text-brand-ink-3 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </Link>
  );
}

// ─── Reading phase ─────────────────────────────────────────────────────

function ReadingDashboard({ stepsRead }: { stepsRead: number[] }) {
  const readCount = stepsRead.length;
  const nextStep = getNextUnreadStep(stepsRead);
  const pct = Math.round((readCount / 7) * 100);

  return (
    <div className="space-y-8">
      <header>
        <AccentLabel>Tu camino</AccentLabel>
        <h1 className="mt-3 font-brand-display text-3xl leading-[0.95] text-brand-ink md:text-4xl">
          7 pasos. 180 días.
        </h1>
        <p className="mt-3 max-w-prose font-brand-body leading-relaxed text-brand-ink-2">
          Una batalla a la vez. Leé un paso, automatizalo, pasá al siguiente.
        </p>
      </header>

      <Panel>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <PasoLabel>Progreso de lectura</PasoLabel>
            <p className="mt-2 font-brand-body text-brand-ink">
              {readCount} de 7 pasos leídos
            </p>
          </div>
          <span className="font-brand-display text-4xl leading-none text-brand-accent md:text-5xl">
            {pct}
            <span className="text-2xl text-brand-ink-3">%</span>
          </span>
        </div>
        <ProgressTrack pct={pct} />
      </Panel>

      {stepsRead.includes(2) && !stepsRead.includes(7) && (
        <Link
          href="/objetivos"
          className="block rounded-lg border border-brand-accent/30 bg-brand-bg-2 p-4 no-underline transition-colors hover:border-brand-accent/60"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-brand-accent/15">
              <Target size={18} className="text-brand-accent" />
            </div>
            <div className="flex-1">
              <p className="font-brand-body text-sm font-semibold text-brand-ink">
                Ya leíste el Paso 2 sobre objetivos.
              </p>
              <p className="mt-0.5 text-xs text-brand-ink-3">
                Podés escribir los tuyos ahora o después de terminar la lectura.
              </p>
            </div>
            <ArrowRight size={16} className="flex-shrink-0 text-brand-accent" />
          </div>
        </Link>
      )}

      {readCount === 7 && (
        <Panel accent className="text-center">
          <AccentLabel>Lectura completa</AccentLabel>
          <h2 className="mt-3 font-brand-display text-2xl leading-tight text-brand-ink md:text-3xl">
            Terminaste los 7 pasos.
          </h2>
          <p className="mx-auto mt-3 max-w-md font-brand-body leading-relaxed text-brand-ink-2">
            Ahora escribí tus 10 objetivos para los próximos 180 días.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/objetivos" className="no-underline">
              <PrimaryButton>
                <Target size={16} />
                Escribir mis objetivos
                <ArrowRight size={14} />
              </PrimaryButton>
            </Link>
          </div>
        </Panel>
      )}

      <DownloadsRow />

      <Link
        href="/intro"
        className="block rounded-lg border border-brand-line bg-brand-bg-2 p-4 no-underline transition-all duration-200 hover:translate-x-1 hover:border-brand-line-2 motion-reduce:hover:translate-x-0"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-paso-1/10 text-2xl">
            🔥
          </div>
          <div className="min-w-0 flex-1">
            <PasoLabel className="text-paso-1">Introducción</PasoLabel>
            <h3 className="mt-1 font-brand-display text-base text-brand-ink">
              Antes de empezar
            </h3>
            <p className="mt-1 font-brand-body text-sm leading-snug text-brand-ink-3">
              Por qué este es un libro de matemática, no de autoayuda
            </p>
          </div>
          <ChevronRight size={16} className="flex-shrink-0 text-brand-ink-3" />
        </div>
      </Link>

      <section>
        <PasoLabel>Los 7 pasos</PasoLabel>
        <div className="mt-4 space-y-2">
          {Array.from({ length: 7 }, (_, i) => {
            const stepNum = i + 1;
            const isRead = stepsRead.includes(stepNum);
            const isNext = stepNum === nextStep;
            const isLocked = !isRead && !isNext;
            return (
              <StepRow
                key={stepNum}
                stepNum={stepNum}
                isRead={isRead}
                isNext={isNext}
                isLocked={isLocked}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Objectives phase ──────────────────────────────────────────────────

function ObjectivesDashboard({
  user,
  objectiveCount,
  refreshProfile,
}: {
  user: { uid: string };
  objectiveCount: number;
  refreshProfile: () => Promise<void>;
}) {
  const router = useRouter();
  const pct = Math.round((objectiveCount / 10) * 100);

  const handleActivateTracker = async () => {
    await updateOnboardingPhase(user.uid, "tracking");
    await refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <header>
        <AccentLabel>Paso 2 · Ejercicio</AccentLabel>
        <h1 className="mt-3 font-brand-display text-3xl leading-[0.95] text-brand-ink md:text-4xl">
          10 objetivos. 180 días.
        </h1>
        <p className="mt-3 max-w-prose font-brand-body leading-relaxed text-brand-ink-2">
          Escritos en presente, específicos y medibles. Sin esto, el método no arranca.
        </p>
      </header>

      <Panel>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <PasoLabel>Tus objetivos</PasoLabel>
            <p className="mt-2 font-brand-body text-brand-ink">{objectiveCount} de 10</p>
          </div>
          <span className="font-brand-display text-4xl leading-none text-brand-accent md:text-5xl">
            {objectiveCount}
            <span className="text-2xl text-brand-ink-3">/10</span>
          </span>
        </div>
        <ProgressTrack pct={pct} />
      </Panel>

      {objectiveCount >= 10 ? (
        <Panel accent className="text-center">
          <AccentLabel>Objetivos listos</AccentLabel>
          <h2 className="mt-3 font-brand-display text-2xl leading-tight text-brand-ink md:text-3xl">
            Activá el tracker de 180 días.
          </h2>
          <p className="mx-auto mt-3 max-w-md font-brand-body leading-relaxed text-brand-ink-2">
            A partir de hoy, cada victoria diaria suma. El cerebro construye el circuito.
          </p>
          <div className="mt-6 flex justify-center">
            <PrimaryButton onClick={handleActivateTracker}>
              <Flame size={16} />
              Activar tracker
              <ArrowRight size={14} />
            </PrimaryButton>
          </div>
        </Panel>
      ) : (
        <Link
          href="/objetivos"
          className="block rounded-lg border border-brand-accent/40 bg-brand-bg-2 p-5 no-underline transition-colors hover:border-brand-accent/70"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-brand-accent/15">
              <Plus size={20} className="text-brand-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-brand-display text-base text-brand-ink">
                {objectiveCount === 0
                  ? "Escribir tu primer objetivo"
                  : `${10 - objectiveCount} objetivos restantes`}
              </h3>
              <p className="mt-1 font-brand-body text-sm leading-snug text-brand-ink-3">
                En presente, específicos, medibles.
              </p>
            </div>
            <ArrowRight size={18} className="flex-shrink-0 text-brand-accent" />
          </div>
        </Link>
      )}

      <div className="flex items-start gap-3 rounded-lg border border-brand-line bg-brand-bg-2 p-4">
        <BookOpen size={18} className="mt-0.5 flex-shrink-0 text-brand-accent" />
        <p className="font-brand-body text-sm leading-relaxed text-brand-ink-2">
          Si necesitás repasar, podés volver a leer cualquier paso desde &ldquo;Los 7 pasos&rdquo; más abajo.
        </p>
      </div>

      <section>
        <PasoLabel>Repasar los 7 pasos</PasoLabel>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: 7 }, (_, i) => {
            const stepNum = i + 1;
            const { icon: Icon, text, bg } = stepStyles[i];
            return (
              <Link
                key={stepNum}
                href={`/paso/${stepNum}`}
                className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-bg-2 p-3.5 no-underline transition-all duration-200 hover:translate-x-1 hover:border-brand-line-2 motion-reduce:hover:translate-x-0"
              >
                <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md", bg)}>
                  <Icon size={17} className={text} />
                </div>
                <div className="min-w-0 flex-1">
                  <PasoLabel>Paso {stepNum.toString().padStart(2, "0")}</PasoLabel>
                  <h4 className="mt-0.5 truncate font-brand-display text-sm text-brand-ink">
                    {stepNames[i]}
                  </h4>
                </div>
                <ChevronRight size={14} className="flex-shrink-0 text-brand-ink-3" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Tracking phase ────────────────────────────────────────────────────

function TrackingDashboard({ activeObjectives }: { activeObjectives: Objective[] }) {
  const { profile } = useAuth();
  const { todayLog, dayNumber, addVictory } = useDailyLog();
  const [showAddVictory, setShowAddVictory] = useState(false);
  const [victoryDesc, setVictoryDesc] = useState("");
  const [victoryCategory, setVictoryCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const startDate = profile?.startDate?.toDate() || new Date();
  const progress = calculateProgress(dayNumber);
  const endDate = getEndDate(startDate);
  const todayVictories = todayLog?.totalVictories || 0;
  const stepsRead = profile?.stepsRead || [];
  const firstName = profile?.displayName?.split(" ")[0];

  useEffect(() => {
    if (!showAddVictory) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAddVictory]);

  const handleAddVictory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!victoryDesc.trim() || !victoryCategory) return;
    setSubmitting(true);
    await addVictory(victoryDesc.trim(), victoryCategory);
    setVictoryDesc("");
    setVictoryCategory("");
    setShowAddVictory(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <header>
        <AccentLabel>{formatDateES(new Date())}</AccentLabel>
        <h1 className="mt-3 font-brand-display text-3xl leading-[0.95] text-brand-ink md:text-4xl">
          {firstName ? `Hola, ${firstName}.` : "Tu día de hoy."}
        </h1>
        <p className="mt-3 max-w-prose font-brand-body leading-relaxed text-brand-ink-2">
          Cada micro-victoria que sumás hoy es oxitocina que el cerebro registra.
        </p>
      </header>

      <Panel>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <PasoLabel>Programa 180 días</PasoLabel>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-brand-display text-5xl leading-none text-brand-ink md:text-6xl">
                {dayNumber}
              </span>
              <span className="font-brand-display text-xl leading-none text-brand-ink-3">
                / 180
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-brand-display text-3xl leading-none text-brand-accent">
              {progress}%
            </div>
            <div className="mt-1 font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3">
              completado
            </div>
          </div>
        </div>
        <ProgressTrack pct={progress} />
        <div className="mt-3 flex justify-between font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3">
          <span>{formatDateES(startDate)}</span>
          <span>{formatDateES(endDate)}</span>
        </div>
      </Panel>

      <Panel accent>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-brand-accent/15">
              <Trophy size={20} className="text-brand-accent" />
            </div>
            <div>
              <PasoLabel>Hoy</PasoLabel>
              <p className="mt-0.5 font-brand-body text-sm text-brand-ink-2">
                Tus victorias del día
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-brand-display text-4xl leading-none text-brand-accent md:text-5xl">
              {todayVictories}
            </div>
            <div className="mt-1 font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3">
              {todayVictories === 1 ? "victoria" : "victorias"}
            </div>
          </div>
        </div>

        {todayLog?.victories && todayLog.victories.length > 0 && (
          <ul className="mb-5 space-y-2">
            {todayLog.victories.map((v) => (
              <li
                key={v.id}
                className="flex items-center gap-3 rounded-md border border-brand-line bg-brand-bg p-3"
              >
                <CheckCircle2 size={15} className="flex-shrink-0 text-brand-accent" />
                <span className="flex-1 font-brand-body text-sm text-brand-ink">
                  {v.description}
                </span>
                <span className="max-w-[140px] truncate rounded bg-brand-line px-2 py-1 font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3">
                  {getObjectiveLabel(activeObjectives, v.category)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <PrimaryButton onClick={() => setShowAddVictory(true)} className="w-full">
          <Plus size={16} />
          Sumar victoria
        </PrimaryButton>
      </Panel>

      {todayVictories >= 5 && (
        <div className="flex items-center gap-3 rounded-lg border border-brand-accent/40 bg-brand-bg-2 p-4">
          <Flame size={20} className="flex-shrink-0 text-brand-accent" />
          <p className="font-brand-body text-sm text-brand-ink-2">
            <span className="font-semibold text-brand-ink">{todayVictories} victorias hoy</span>. Tu cerebro está generando oxitocina en cadena.
          </p>
        </div>
      )}

      <DownloadsRow />

      <section>
        <PasoLabel>Los 7 pasos</PasoLabel>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: 7 }, (_, i) => {
            const stepNum = i + 1;
            const { icon: Icon, text, bg } = stepStyles[i];
            const isRead = stepsRead.includes(stepNum);
            return (
              <Link
                key={stepNum}
                href={`/paso/${stepNum}`}
                className="flex items-start gap-3 rounded-lg border border-brand-line bg-brand-bg-2 p-4 no-underline transition-all duration-200 hover:translate-x-1 hover:border-brand-line-2 motion-reduce:hover:translate-x-0"
              >
                <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md", bg)}>
                  <Icon size={18} className={text} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <PasoLabel>Paso {stepNum.toString().padStart(2, "0")}</PasoLabel>
                    {isRead && <CheckCircle2 size={12} className="text-brand-accent" />}
                  </div>
                  <h3 className="mt-0.5 font-brand-display text-sm leading-tight text-brand-ink">
                    {stepNames[i]}
                  </h3>
                  <p className="mt-1 font-brand-body text-xs leading-snug text-brand-ink-3 line-clamp-2">
                    {stepSummaries[i]}
                  </p>
                </div>
                <ChevronRight size={14} className="mt-1 flex-shrink-0 text-brand-ink-3" />
              </Link>
            );
          })}
        </div>
      </section>

      {showAddVictory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-brand-bg/80 backdrop-blur-sm animate-fade-in sm:items-center"
          onClick={() => !submitting && setShowAddVictory(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-victory-title"
            className="w-full rounded-t-xl border border-brand-line bg-brand-bg-2 p-6 sm:max-w-md sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="add-victory-title"
                className="font-brand-display text-xl text-brand-ink"
              >
                Sumar victoria
              </h2>
              <button
                onClick={() => setShowAddVictory(false)}
                disabled={submitting}
                aria-label="Cerrar"
                className="text-brand-ink-3 transition-colors hover:text-brand-ink disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddVictory} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="victory-desc"
                  className="block font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3"
                >
                  ¿Qué lograste?
                </label>
                <input
                  id="victory-desc"
                  type="text"
                  placeholder="Ej: Tomé agua en vez de gaseosa"
                  value={victoryDesc}
                  onChange={(e) => setVictoryDesc(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-md border border-brand-line bg-brand-bg px-3.5 py-2.5 font-brand-body text-brand-ink placeholder:text-brand-ink-3 transition-colors focus:border-brand-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="victory-category"
                  className="block font-brand-mono text-[10px] uppercase tracking-wider text-brand-ink-3"
                >
                  Objetivo relacionado
                </label>
                <select
                  id="victory-category"
                  value={victoryCategory}
                  onChange={(e) => setVictoryCategory(e.target.value)}
                  required
                  className="w-full rounded-md border border-brand-line bg-brand-bg px-3.5 py-2.5 font-brand-body text-brand-ink transition-colors focus:border-brand-accent focus:outline-none"
                >
                  <option value="" disabled>
                    Seleccioná un objetivo
                  </option>
                  {activeObjectives.map((obj, i) => (
                    <option key={obj.id} value={obj.id}>
                      #{i + 1}: {obj.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <GhostButton
                  type="button"
                  onClick={() => setShowAddVictory(false)}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancelar
                </GhostButton>
                <PrimaryButton
                  type="submit"
                  disabled={submitting || !victoryCategory || !victoryDesc.trim()}
                  className="flex-1"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getNextUnreadStep(stepsRead: number[]): number {
  for (let i = 1; i <= 7; i++) {
    if (!stepsRead.includes(i)) return i;
  }
  return 7;
}

// ─── Main entry ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const { profile, user, loading, refreshProfile } = useAuth();
  const { objectives } = useObjectives();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-line border-t-brand-accent" />
      </div>
    );
  }

  const phase = profile?.onboardingPhase || "reading";
  const stepsRead = profile?.stepsRead || [];

  if (phase === "reading") {
    return <ReadingDashboard stepsRead={stepsRead} />;
  }

  if (phase === "objectives") {
    return (
      <ObjectivesDashboard
        user={user!}
        objectiveCount={objectives.filter((o) => o.status === "active").length}
        refreshProfile={refreshProfile}
      />
    );
  }

  return (
    <TrackingDashboard
      activeObjectives={objectives.filter((o) => o.status === "active")}
    />
  );
}
