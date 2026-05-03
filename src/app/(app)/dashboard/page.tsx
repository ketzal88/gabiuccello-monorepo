"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useDailyLog } from "@/hooks/use-daily-log";
import { useObjectives } from "@/hooks/use-objectives";
import { updateOnboardingPhase, type Objective } from "@/lib/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { calculateProgress, formatDateES, getEndDate, getObjectiveLabel, cn } from "@/lib/utils";
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
  Sparkles,
  ArrowRight,
  Download,
  type LucideIcon,
} from "lucide-react";

function PdfDownloadBanner() {
  return (
    <a
      href="/libro/7-pasos-para-cambiar-tu-vida.pdf"
      download
      className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors no-underline"
    >
      <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
        <Download size={15} className="text-stone-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 leading-tight">Descargar PDF</p>
        <p className="text-xs text-stone-400">Para leer offline</p>
      </div>
    </a>
  );
}

const stepIcons: { icon: LucideIcon; color: string; bg: string }[] = [
  { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Users, color: "text-violet-500", bg: "bg-violet-50" },
  { icon: Eye, color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Dumbbell, color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: HeartPulse, color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: Feather, color: "text-indigo-500", bg: "bg-indigo-50" },
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

// ─── Reading Phase ───

function ReadingDashboard({ stepsRead }: { stepsRead: number[] }) {
  const readCount = stepsRead.length;
  const nextStep = getNextUnreadStep(stepsRead);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
          Tu camino de 7 pasos
        </h1>
        <p className="text-stone-500 mt-1">
          Leé cada paso para transformar tu vida en 180 días
        </p>
      </div>

      {/* Reading Progress */}
      <Card className="border-victoria-200 bg-gradient-to-br from-white to-victoria-50/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-victoria-100 flex items-center justify-center">
                <BookOpen size={20} className="text-victoria-600" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900">Progreso de lectura</h2>
                <p className="text-sm text-stone-500">{readCount} de 7 pasos leídos</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-victoria-500">
                {Math.round((readCount / 7) * 100)}%
              </span>
            </div>
          </div>
          <ProgressBar value={readCount} max={7} showLabel={false} size="lg" />
        </CardContent>
      </Card>

      {/* Objectives prompt after paso 2 */}
      {stepsRead.includes(2) && !stepsRead.includes(7) && (
        <Link href="/objetivos">
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors cursor-pointer">
            <Target size={20} className="text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-700">
                Ya leiste el Paso 2 sobre objetivos. ¿Queres escribir los tuyos?
              </p>
              <p className="text-xs text-blue-500 mt-0.5">Podés hacerlo ahora o después de terminar la lectura</p>
            </div>
            <ArrowRight size={16} className="text-blue-400" />
          </div>
        </Link>
      )}

      {/* All 7 read → prompt to write objectives */}
      {readCount === 7 && (
        <Card className="border-victoria-300 bg-gradient-to-br from-victoria-50 to-victoria-100/50">
          <CardContent className="pt-6 pb-6 text-center">
            <Sparkles size={32} className="text-victoria-500 mx-auto mb-3" />
            <h2 className="text-xl font-display font-bold text-stone-900 mb-2">
              ¡Terminaste la lectura!
            </h2>
            <p className="text-stone-600 mb-5 max-w-md mx-auto">
              Ahora es momento de escribir tus 10 objetivos para los próximos 180 días.
            </p>
            <Link href="/objetivos">
              <Button size="lg">
                <Target size={18} />
                Escribir mis objetivos
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <PdfDownloadBanner />

      {/* Intro card */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Los 7 Pasos</h2>
        <div className="mb-3">
          <Link href="/intro">
            <Card hover className="border-amber-200 bg-amber-50/50">
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-100 text-xl">
                    🔥
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-amber-600 uppercase">
                      Introducción
                    </span>
                    <h3 className="font-semibold text-stone-900 text-sm">
                      Antes de empezar
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Por qué este es un libro de matemática, no de autoayuda
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* 7 Steps Timeline */}
      <div>
        <div className="space-y-3">
          {stepNames.map((name, i) => {
            const stepNum = i + 1;
            const { icon: Icon, color, bg } = stepIcons[i];
            const isRead = stepsRead.includes(stepNum);
            const isNext = stepNum === nextStep;
            const isLocked = !isRead && !isNext;

            return (
              <Link
                key={i}
                href={isLocked ? "#" : `/paso/${stepNum}`}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <Card
                  hover={!isLocked}
                  className={cn(
                    "transition-all",
                    isNext && "border-victoria-300 ring-2 ring-victoria-100",
                    isLocked && "opacity-50 cursor-default"
                  )}
                >
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                          isLocked ? "bg-stone-100" : bg
                        )}
                      >
                        {isLocked ? (
                          <Lock size={18} className="text-stone-300" />
                        ) : (
                          <Icon size={20} className={color} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-400 uppercase">
                            Paso {stepNum}
                          </span>
                          {isRead && (
                            <CheckCircle2 size={14} className="text-victoria-500" />
                          )}
                          {isNext && (
                            <span className="text-xs bg-victoria-100 text-victoria-700 px-2 py-0.5 rounded-full font-medium">
                              Siguiente
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-stone-900 text-sm">
                          {name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                          {stepSummaries[i]}
                        </p>
                      </div>
                      {!isLocked && (
                        <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Objectives Phase ───

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

  const handleActivateTracker = async () => {
    await updateOnboardingPhase(user.uid, "tracking");
    await refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
          Escribí tus 10 objetivos
        </h1>
        <p className="text-stone-500 mt-1">
          El paso 2 te pide 10 objetivos escritos en presente, específicos y medibles
        </p>
      </div>

      {/* Progress */}
      <Card className="border-victoria-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900">Tus objetivos</h2>
                <p className="text-sm text-stone-500">{objectiveCount} de 10</p>
              </div>
            </div>
            <span className="text-3xl font-bold text-victoria-500">
              {objectiveCount}/10
            </span>
          </div>
          <ProgressBar value={objectiveCount} max={10} showLabel={false} size="lg" />
        </CardContent>
      </Card>

      {/* CTA */}
      {objectiveCount >= 10 ? (
        <Card className="border-victoria-300 bg-gradient-to-br from-victoria-50 to-victoria-100/50">
          <CardContent className="pt-6 pb-6 text-center">
            <Sparkles size={32} className="text-victoria-500 mx-auto mb-3" />
            <h2 className="text-xl font-display font-bold text-stone-900 mb-2">
              ¡Tus objetivos están listos!
            </h2>
            <p className="text-stone-600 mb-5 max-w-md mx-auto">
              Ahora activá tu tracker de 180 días para empezar a sumar victorias diarias.
            </p>
            <Button size="lg" onClick={handleActivateTracker}>
              <Flame size={18} />
              Activar tracker de 180 días
              <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Link href="/objetivos">
          <Card hover className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900">
                    {objectiveCount === 0
                      ? "Escribir mi primer objetivo"
                      : `Seguir escribiendo (${10 - objectiveCount} restantes)`}
                  </h3>
                  <p className="text-sm text-stone-500 mt-0.5">
                    Recordá: en presente, específicos y medibles
                  </p>
                </div>
                <ArrowRight size={18} className="text-stone-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <BookOpen size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>Tip:</strong> si necesitas repasar, podés volver a leer cualquier paso
          desde la sección &ldquo;Los 7 Pasos&rdquo; más abajo.
        </p>
      </div>

      {/* Steps for rereading */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Repasar los 7 Pasos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stepNames.map((name, i) => {
            const { icon: Icon, color, bg } = stepIcons[i];
            return (
              <Link key={i} href={`/paso/${i + 1}`}>
                <Card hover className="h-full">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
                        <Icon size={16} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-stone-400">Paso {i + 1}</span>
                        <h3 className="font-medium text-stone-900 text-sm">{name}</h3>
                      </div>
                      <ChevronRight size={14} className="text-stone-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tracking Phase (original dashboard) ───

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
          {profile?.displayName ? `Hola, ${profile.displayName.split(" ")[0]}` : "Tu Dashboard"}
        </h1>
        <p className="text-stone-500 mt-1">
          {formatDateES(new Date())}
        </p>
      </div>

      {/* Progress Bar 180 Days */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl font-bold text-stone-900">Día {dayNumber}</span>
              <span className="text-lg text-stone-400 ml-2">de 180</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-victoria-500">{progress}%</div>
              <div className="text-xs text-stone-400">completado</div>
            </div>
          </div>
          <ProgressBar value={dayNumber} max={180} showLabel={false} size="lg" />
          <div className="flex justify-between mt-2 text-xs text-stone-400">
            <span>{formatDateES(startDate)}</span>
            <span>{formatDateES(endDate)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Card */}
      <Card className="border-victoria-200 bg-gradient-to-br from-white to-victoria-50/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-victoria-100 flex items-center justify-center">
                <Trophy size={20} className="text-victoria-600" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900">Hoy</h2>
                <p className="text-sm text-stone-500">Tus victorias del día</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-victoria-500">
                {todayVictories}
              </span>
              <p className="text-xs text-stone-400">
                {todayVictories === 1 ? "victoria" : "victorias"}
              </p>
            </div>
          </div>

          {todayLog?.victories && todayLog.victories.length > 0 && (
            <div className="space-y-2 mb-4">
              {todayLog.victories.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100"
                >
                  <CheckCircle2 size={16} className="text-victoria-500 flex-shrink-0" />
                  <span className="text-sm text-stone-700 flex-1">{v.description}</span>
                  <span className="text-xs text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full max-w-[140px] truncate">
                    {getObjectiveLabel(activeObjectives, v.category)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={() => setShowAddVictory(true)}
            className="w-full"
            size="lg"
          >
            <Plus size={18} />
            Sumar victoria
          </Button>
        </CardContent>
      </Card>

      {/* Streak indicator */}
      {todayVictories >= 5 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Flame size={20} className="text-amber-500" />
          <p className="text-sm font-medium text-amber-700">
            {todayVictories} victorias hoy. Tu cerebro está generando oxitocina en cadena.
          </p>
        </div>
      )}

      <PdfDownloadBanner />

      {/* 7 Steps Grid */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Los 7 Pasos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stepNames.map((name, i) => {
            const { icon: Icon, color, bg } = stepIcons[i];
            const isRead = stepsRead.includes(i + 1);
            return (
              <Link key={i} href={`/paso/${i + 1}`}>
                <Card hover className="h-full">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                          bg
                        )}
                      >
                        <Icon size={20} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-400 uppercase">
                            Paso {i + 1}
                          </span>
                          {isRead && (
                            <CheckCircle2 size={14} className="text-victoria-500" />
                          )}
                        </div>
                        <h3 className="font-semibold text-stone-900 text-sm">
                          {name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                          {stepSummaries[i]}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-stone-300 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Add Victory Modal */}
      <Modal
        isOpen={showAddVictory}
        onClose={() => setShowAddVictory(false)}
        title="Sumar victoria"
      >
        <form onSubmit={handleAddVictory} className="space-y-4 mt-2">
          <Input
            label="¿Qué lograste?"
            placeholder="Ej: Tomé agua en vez de gaseosa"
            value={victoryDesc}
            onChange={(e) => setVictoryDesc(e.target.value)}
            required
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">
              Objetivo relacionado
            </label>
            <select
              value={victoryCategory}
              onChange={(e) => setVictoryCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-victoria-500 focus:border-transparent"
              required
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddVictory(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting || !victoryCategory}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Helper ───

function getNextUnreadStep(stepsRead: number[]): number {
  for (let i = 1; i <= 7; i++) {
    if (!stepsRead.includes(i)) return i;
  }
  return 7;
}

// ─── Main Dashboard ───

export default function DashboardPage() {
  const { profile, user, loading, refreshProfile } = useAuth();
  const { objectives } = useObjectives();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
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

  return <TrackingDashboard activeObjectives={objectives.filter((o) => o.status === "active")} />;
}
