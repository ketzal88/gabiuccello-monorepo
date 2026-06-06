"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStep, type StepSection } from "@/data/steps-content";
import { useAuth } from "@/context/auth-context";
import { markStepAndUpdatePhase, markStepAsRead, updateOnboardingPhase, getObjectives } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles,
  Flame,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

function RenderSection({ section }: { section: StepSection }) {
  switch (section.type) {
    case "heading":
      return <h2 className="text-2xl md:text-3xl font-display font-semibold text-stone-800 mt-10 mb-4">{section.content}</h2>;
    case "paragraph":
      return <p className="text-lg leading-relaxed text-stone-700 mb-6">{section.content}</p>;
    case "quote":
      return (
        <blockquote className="border-l-4 border-victoria-500 pl-6 py-3 my-8 bg-victoria-50 rounded-r-lg">
          <p className="italic text-stone-600 text-lg">{section.content}</p>
        </blockquote>
      );
    case "list":
      return (
        <div className="mb-6">
          {section.content && <p className="text-lg text-stone-700 mb-3 font-medium">{section.content}</p>}
          <ul className="space-y-2 pl-6">
            {section.items?.map((item, i) => (
              <li key={i} className="text-lg text-stone-700 list-disc">{item}</li>
            ))}
          </ul>
        </div>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto">
          {section.content && <p className="text-lg font-medium text-stone-700 mb-3">{section.content}</p>}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Qué sacar</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Por qué</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-stone-600">Qué sumar</th>
              </tr>
            </thead>
            <tbody>
              {section.rows?.map((row, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-3 px-4 text-stone-700">{row.col1}</td>
                  <td className="py-3 px-4 text-stone-500 text-sm">{row.col2}</td>
                  <td className="py-3 px-4 text-victoria-700 font-medium">{row.col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "exercise":
      return <p className="text-lg leading-relaxed text-stone-700 mb-6">{section.content}</p>;
    default:
      return <p className="text-lg text-stone-700 mb-6">{section.content}</p>;
  }
}

export default function PasoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [marked, setMarked] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [activeObjectiveCount, setActiveObjectiveCount] = useState(0);

  const stepNumber = parseInt(params.number as string, 10);
  const step = getStep(stepNumber);
  const stepsRead = profile?.stepsRead || [];
  const isRead = stepsRead.includes(stepNumber) || marked;
  const phase = profile?.onboardingPhase || "reading";

  useEffect(() => {
    window.scrollTo(0, 0);
    setMarked(false);
    setShowCompletion(false);
  }, [stepNumber]);

  if (!step) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Paso no encontrado</h1>
        <Button onClick={() => router.push("/dashboard")} variant="secondary">
          Volver
        </Button>
      </div>
    );
  }

  // Soft lock: suggest reading in order but don't block
  const prevStepRead = stepNumber === 1 || stepsRead.includes(stepNumber - 1);
  const showOrderWarning = !prevStepRead && !isRead && phase === "reading";

  const handleMarkAsRead = async () => {
    if (!user || isRead) return;

    // Check if this completes all 7 steps
    const allRead = [...stepsRead, stepNumber];
    const allSevenRead = [1, 2, 3, 4, 5, 6, 7].every((n) => allRead.includes(n));

    if (allSevenRead && phase === "reading") {
      // Batch: mark step + update phase in 1 write instead of 2
      await markStepAndUpdatePhase(user.uid, stepNumber, "objectives");
      setMarked(true);
      // Fetch objectives in parallel with profile refresh
      const [objs] = await Promise.all([getObjectives(user.uid), refreshProfile()]);
      setActiveObjectiveCount(objs.filter((o) => o.status === "active").length);
      setShowCompletion(true);
    } else {
      // Normal: just mark as read (1 write + 1 read)
      await markStepAsRead(user.uid, stepNumber);
      setMarked(true);
      await refreshProfile();
    }
  };

  const handleActivateTracker = async () => {
    if (!user) return;
    await updateOnboardingPhase(user.uid, "tracking");
    await refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </Link>

      {/* Order warning */}
      {showOrderWarning && (
        <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700">
              Todavía no leíste el Paso {stepNumber - 1}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Te recomendamos leer los pasos en orden para aprovechar mejor el contenido.
            </p>
            <Link href={`/paso/${stepNumber - 1}`}>
              <Button variant="secondary" size="sm" className="mt-2">
                Ir al Paso {stepNumber - 1}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Step Header */}
      <div className="mb-10">
        <span className="text-sm font-semibold text-victoria-600 uppercase tracking-wider">
          Paso {step.number} de 7
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-900 mt-2 mb-3">
          {step.title}
        </h1>
        <p className="text-xl text-stone-500">{step.subtitle}</p>
      </div>

      <hr className="border-stone-200 mb-10" />

      {/* Content */}
      <article className="prose-step">
        {step.sections.map((section, i) => (
          <RenderSection key={i} section={section} />
        ))}
      </article>

      {/* Exercise Section */}
      <Card className="mt-12 border-victoria-200 bg-victoria-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-victoria-100 flex items-center justify-center">
              <BookOpen size={20} className="text-victoria-600" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Ejercicio</h3>
              <p className="text-sm text-stone-500">{step.exercise.title}</p>
            </div>
          </div>
          <p className="text-stone-700 mb-4">{step.exercise.description}</p>
          <div className="space-y-2">
            {step.exercise.weeks.map((week, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-victoria-100">
                <span className="text-xs font-bold text-victoria-600 bg-victoria-100 px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-stone-600">{week}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closing Quote */}
      <blockquote className="border-l-4 border-stone-300 pl-6 py-3 my-10">
        <p className="text-xl font-display italic text-stone-600">
          &ldquo;{step.closingQuote}&rdquo;
        </p>
      </blockquote>

      {/* Connection Text */}
      <div className="bg-stone-50 rounded-2xl p-6 mb-10">
        <p className="text-stone-600">{step.connectionText}</p>
      </div>

      {/* ─── Post-Step Actions ─── */}

      {/* After Paso 2: prompt for objectives */}
      {stepNumber === 2 && isRead && phase === "reading" && (
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Target size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900 mb-1">
                  ¿Querés escribir tus 10 objetivos ahora?
                </h3>
                <p className="text-sm text-stone-500 mb-4">
                  Este paso te pide que definas tus objetivos. Podés hacerlo ahora o seguir leyendo y hacerlo al final.
                </p>
                <div className="flex gap-3">
                  <Link href="/objetivos">
                    <Button size="sm">
                      <Target size={14} />
                      Escribir objetivos
                    </Button>
                  </Link>
                  {stepNumber < 7 && (
                    <Link href={`/paso/${stepNumber + 1}`}>
                      <Button variant="secondary" size="sm">
                        Seguir leyendo
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* After Paso 7: celebration + next step */}
      {stepNumber === 7 && showCompletion && (
        <Card className="mb-8 border-victoria-300 bg-gradient-to-br from-victoria-50 to-victoria-100/50">
          <CardContent className="pt-8 pb-8 text-center">
            <Sparkles size={40} className="text-victoria-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-stone-900 mb-2">
              ¡Terminaste los 7 pasos!
            </h2>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Increíble. Ahora tu cerebro tiene un mapa completo para los próximos 180 días.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/cierre">
                <Button size="lg">
                  <Sparkles size={18} />
                  Leer el cierre del libro
                  <ArrowRight size={16} />
                </Button>
              </Link>
              {activeObjectiveCount >= 10 ? (
                <Button size="lg" variant="secondary" onClick={handleActivateTracker}>
                  <Flame size={18} />
                  Activar tracker
                </Button>
              ) : (
                <Link href="/objetivos">
                  <Button size="lg" variant="secondary">
                    <Target size={18} />
                    Escribir objetivos
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mark as Read + Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 pt-8">
        <div>
          {!isRead ? (
            <Button onClick={handleMarkAsRead}>
              <CheckCircle2 size={16} />
              Terminé de leer este paso
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 text-victoria-600 font-medium">
              <CheckCircle2 size={16} />
              Leído
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {stepNumber > 1 && (
            <Link href={`/paso/${stepNumber - 1}`}>
              <Button variant="secondary" size="sm">
                <ArrowLeft size={14} />
                Paso {stepNumber - 1}
              </Button>
            </Link>
          )}
          {stepNumber < 7 && (
            <Link href={`/paso/${stepNumber + 1}`}>
              <Button variant="secondary" size="sm">
                Paso {stepNumber + 1}
                <ArrowRight size={14} />
              </Button>
            </Link>
          )}
          {stepNumber === 7 && isRead && !showCompletion && (
            <Link href="/dashboard">
              <Button size="sm">
                Ir al dashboard
                <ArrowRight size={14} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
