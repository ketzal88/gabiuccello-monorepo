"use client";

import { useAuth } from "@/context/auth-context";
import { isFullTier } from "@/lib/firestore";
import { buildUpgradeUrl } from "@/lib/upgrade-url";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function UpgradeBanner() {
  const { profile, user } = useAuth();

  if (!profile || !user || isFullTier(profile)) return null;

  const upgradeUrl = buildUpgradeUrl(user.uid);

  return (
    <Link
      href={upgradeUrl}
      className="block bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b border-orange-700/40 hover:from-orange-600 hover:to-orange-700 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
        <Sparkles size={18} className="shrink-0" />
        <p className="text-sm md:text-base flex-1 leading-tight">
          <span className="font-semibold">Desbloqueá la app de tracking de por vida</span>
          <span className="hidden sm:inline"> — sumá Tracker, Objetivos y Progreso por solo </span>
          <span className="inline sm:hidden"> · </span>
          <span className="font-bold">US$10</span>
        </p>
        <span className="font-mono text-xs uppercase tracking-wider whitespace-nowrap underline underline-offset-2">
          Ver detalles →
        </span>
      </div>
    </Link>
  );
}
