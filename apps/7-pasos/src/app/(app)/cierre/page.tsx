"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cierreContent, type StepSection } from "@/data/steps-content";
import { updateOnboardingPhase, getObjectives } from "@/lib/firestore";
import { Flame, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function RenderSection({ section }: { section: StepSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-stone-800 mt-10 mb-4">
          {section.content}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-lg leading-relaxed text-stone-700 mb-6">
          {section.content}
        </p>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-victoria-500 pl-6 py-3 my-8 bg-victoria-50 rounded-r-lg">
          <p className="italic text-stone-600 text-lg">{section.content}</p>
        </blockquote>
      );
    case "list":
      return (
        <div className="mb-6">
          {section.content && (
            <p className="text-lg text-stone-700 mb-3 font-medium">
              {section.content}
            </p>
          )}
          <ul className="space-y-2 pl-6">
            {section.items?.map((item, i) => (
              <li key={i} className="text-lg text-stone-700 list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return (
        <p className="text-lg text-stone-700 mb-6">{section.content}</p>
      );
  }
}

export default function CierrePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [objectiveCount, setObjectiveCount] = useState(0);
  const [activating, setActivating] = useState(false);

  const phase = profile?.onboardingPhase || "reading";

  useEffect(() => {
    if (!user) return;
    getObjectives(user.uid).then((objs) => {
      setObjectiveCount(objs.filter((o) => o.status === "active").length);
    });
  }, [user]);

  const handleActivate = async () => {
    if (!user || activating) return;
    setActivating(true);
    await updateOnboardingPhase(user.uid, "tracking");
    await refreshProfile();
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-sm font-semibold text-victoria-600 uppercase tracking-wider">
          Cierre
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-900 mt-2 mb-3">
          {cierreContent.title}
        </h1>
        <p className="text-xl text-stone-500">{cierreContent.subtitle}</p>
      </div>

      <hr className="border-stone-200 mb-10" />

      {/* Content */}
      <article className="prose-step">
        {cierreContent.sections.map((section, i) => (
          <RenderSection key={i} section={section} />
        ))}
      </article>

      {/* Closing Quote */}
      <blockquote className="border-l-4 border-stone-300 pl-6 py-3 my-10">
        <p className="text-xl font-display italic text-stone-600">
          &ldquo;{cierreContent.closingQuote}&rdquo;
        </p>
      </blockquote>

      {/* CTA — only shown in reading/objectives phase */}
      {phase !== "tracking" && (
        <div className="bg-gradient-to-br from-victoria-50 to-victoria-100/50 rounded-2xl p-8 text-center border border-victoria-200">
          {objectiveCount >= 10 ? (
            <>
              <p className="text-stone-600 mb-6 text-lg">
                Tenés tus 10 objetivos escritos. Es momento de activar los 180 días.
              </p>
              <Button size="lg" onClick={handleActivate} disabled={activating}>
                <Flame size={18} />
                {activating ? "Activando..." : "Activar tracker de 180 días"}
                <ArrowRight size={16} />
              </Button>
            </>
          ) : (
            <>
              <p className="text-stone-600 mb-6 text-lg">
                Antes de activar el tracker, escribí tus 10 objetivos para los próximos 180 días.
              </p>
              <Link href="/objetivos">
                <Button size="lg">
                  <Target size={18} />
                  Escribir mis 10 objetivos
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </>
          )}
        </div>
      )}

      {phase === "tracking" && (
        <div className="text-center pt-8 border-t border-stone-200">
          <Link href="/dashboard">
            <Button variant="secondary">
              Ir al dashboard
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
