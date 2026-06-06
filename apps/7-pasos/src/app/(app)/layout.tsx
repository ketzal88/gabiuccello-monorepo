"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { useAuth } from "@/context/auth-context";
import { isFullTier } from "@/lib/firestore";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Target,
  CalendarDays,
  LogOut,
  Menu,
  X,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useState, useMemo } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled: boolean;
}

function useNavItems(): NavItem[] {
  const { profile } = useAuth();
  const phase = profile?.onboardingPhase || "reading";
  const stepsRead = profile?.stepsRead;
  const fullTier = isFullTier(profile);

  return useMemo(() => {
    const isTracking = phase === "tracking";
    const hasReadPaso2 = stepsRead && stepsRead.includes(2);
    const canSeeObjectives = isTracking || hasReadPaso2 || phase === "objectives";

    // tier "book": el dashboard sigue siendo el libro siempre. El resto bloqueado
    // permanentemente sin importar onboardingPhase — necesitan upgrade.
    return [
      {
        href: "/dashboard",
        label: fullTier && isTracking ? "Dashboard" : "El Libro",
        icon: fullTier && isTracking ? LayoutDashboard : BookOpen,
        disabled: false,
      },
      {
        href: "/tracker",
        label: "Tracker",
        icon: Trophy,
        disabled: !fullTier || !isTracking,
      },
      {
        href: "/objetivos",
        label: "Objetivos",
        icon: Target,
        disabled: !fullTier || !canSeeObjectives,
      },
      {
        href: "/progreso",
        label: "Progreso",
        icon: CalendarDays,
        disabled: !fullTier || !isTracking,
      },
    ];
  }, [phase, stepsRead, fullTier]);
}

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  if (item.disabled) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-brand-ink-3 cursor-not-allowed select-none opacity-60"
      >
        <item.icon size={18} />
        {item.label}
        <Lock size={12} className="ml-auto" />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-brand-accent/15 text-brand-accent"
          : "text-brand-ink-2 hover:text-brand-ink hover:bg-brand-line"
      )}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = useNavItems();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-bg font-brand-body text-brand-ink">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-brand-bg-2 border-r border-brand-line flex-col z-40">
          <div className="px-6 py-6">
            <Link href="/dashboard" className="font-brand-display text-base tracking-tight text-brand-ink">
              7<span className="text-brand-accent">·</span>PASOS
            </Link>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return <NavLink key={item.href} item={item} isActive={isActive} />;
            })}
          </nav>
          <div className="p-3 border-t border-brand-line">
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-brand-ink truncate">
                {user?.displayName || user?.email}
              </p>
              <p className="text-xs text-brand-ink-3 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-brand-ink-2 hover:text-brand-ink hover:bg-brand-line transition-colors w-full"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <header className="md:hidden fixed top-0 left-0 right-0 bg-brand-bg/85 backdrop-blur-lg border-b border-brand-line z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/dashboard" className="font-brand-display text-sm tracking-tight text-brand-ink">
              7<span className="text-brand-accent">·</span>PASOS
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-brand-ink-2 hover:text-brand-ink hover:bg-brand-line transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="px-3 pb-3 space-y-1 animate-fade-in border-t border-brand-line pt-3">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={isActive}
                    onClick={() => !item.disabled && setMobileMenuOpen(false)}
                  />
                );
              })}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-brand-ink-2 hover:text-brand-ink hover:bg-brand-line transition-colors w-full"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </nav>
          )}
        </header>

        {/* Main content */}
        <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
          <UpgradeBanner />
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
