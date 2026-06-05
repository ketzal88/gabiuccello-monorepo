"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { isFullTier } from "@/lib/firestore";
import { buildUpgradeUrl } from "@/lib/upgrade-url";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  CalendarDays,
  Sparkles,
  Check,
  Flame,
  type LucideIcon,
} from "lucide-react";

declare const fbq: ((...args: unknown[]) => void) | undefined;

export default function UpgradePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [upgradeUrl, setUpgradeUrl] = useState<string>("");

  // Redirigir si ya tiene tier full
  useEffect(() => {
    if (profile && isFullTier(profile)) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  useEffect(() => {
    if (user) setUpgradeUrl(buildUpgradeUrl(user.uid));
  }, [user]);

  const handleCheckoutClick = () => {
    // Meta Pixel InitiateCheckout — el event_id debe matchear el del webhook CAPI
    try {
      if (typeof fbq === "function") {
        fbq(
          "track",
          "InitiateCheckout",
          {
            value: 10.0,
            currency: "USD",
            content_ids: ["7pasos-upgrade-app"],
            content_type: "product",
            num_items: 1,
          },
          { eventID: `ick_upgrade_${Date.now()}` }
        );
      }
    } catch {
      // silencioso
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-mono uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          Acceso de por vida
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-stone-900 leading-tight mb-4">
          Sumá la app de tracking a tu libro
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Ya tenés el libro. Ahora desbloqueá el sistema completo para aplicarlo durante los próximos 180 días — y para siempre.
        </p>
      </div>

      {/* Lo que incluye */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-display font-bold text-stone-900 mb-6">
            Lo que vas a desbloquear:
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureBlock
              icon={Trophy}
              title="Tracker de victorias"
              description="Registrá cada victoria diaria. Visualizá tu streak. La disciplina se vuelve hábito cuando la ves crecer."
            />
            <FeatureBlock
              icon={Target}
              title="10 Objetivos guiados"
              description="El sistema del Paso 2: escribilos en presente, dividilos en las 4 categorías, repasalos cada mañana."
            />
            <FeatureBlock
              icon={CalendarDays}
              title="Progreso 180 días"
              description="Calendario visual de tus 6 meses. Cada día contado, cada victoria sumada, cada paso documentado."
            />
          </div>
        </CardContent>
      </Card>

      {/* Bullets */}
      <Card className="bg-stone-50 border-stone-200">
        <CardContent className="p-6 md:p-8">
          <ul className="space-y-3 text-stone-700">
            <BulletItem>Acceso de por vida — pagás una vez, listo</BulletItem>
            <BulletItem>Tracker de hábitos diario con streak</BulletItem>
            <BulletItem>Sistema de los 10 objetivos paso a paso</BulletItem>
            <BulletItem>Vista de progreso de los 180 días</BulletItem>
            <BulletItem>Updates futuros incluidos</BulletItem>
            <BulletItem>Garantía 180 días — si aplicaste el sistema y no funcionó, devolvemos</BulletItem>
          </ul>
        </CardContent>
      </Card>

      {/* Pricing + CTA */}
      <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
        <CardContent className="p-6 md:p-10 text-center">
          <div className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-3">
            Precio único
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl md:text-6xl font-display font-bold text-stone-900">
              US$10
            </span>
          </div>
          <div className="font-mono text-xs text-stone-500 mb-8">
            ≈ $14.366 ARS · Pago único · Acceso de por vida
          </div>

          <a
            href={upgradeUrl || "#"}
            onClick={handleCheckoutClick}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-display text-lg uppercase tracking-wide px-8 py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
          >
            <Flame size={20} />
            Desbloquear la app
          </a>

          <p className="text-xs text-stone-500 mt-4 font-mono uppercase tracking-wider">
            Pago seguro vía Stripe · Acceso inmediato
          </p>
        </CardContent>
      </Card>

      {/* Garantía */}
      <div className="text-center max-w-xl mx-auto text-sm text-stone-500 leading-relaxed">
        <strong className="text-stone-700">Garantía 180 días.</strong> Si aplicaste el sistema durante esos días y no funcionó para vos, escribime a{" "}
        <a href="mailto:hola@gabiuccello.com" className="text-orange-600 underline">
          hola@gabiuccello.com
        </a>{" "}
        con tu progreso (qué pasos completaste, qué intentaste) y devuelvo el monto completo.
      </div>

      <div className="text-center pt-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          Volver al libro
        </Button>
      </div>
    </div>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600">
        <Icon size={22} />
      </div>
      <h3 className="font-display font-bold text-stone-900 text-lg leading-tight">
        {title}
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white mt-0.5">
        <Check size={12} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}
