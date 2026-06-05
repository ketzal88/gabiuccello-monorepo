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
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-300 cursor-not-allowed select-none"
      >
        <item.icon size={18} />
        {item.label}
        <Lock size={12} className="ml-auto text-stone-200" />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
        isActive
          ? "bg-victoria-50 text-victoria-700"
          : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
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
      <div className="min-h-screen bg-cream-50">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-100 flex-col z-40">
          <div className="px-6 py-6">
            <Link href="/dashboard" className="text-xl font-display font-bold text-stone-900">
              7 Pasos
            </Link>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return <NavLink key={item.href} item={item} isActive={isActive} />;
            })}
          </nav>
          <div className="p-3 border-t border-stone-100">
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-stone-900 truncate">
                {user?.displayName || user?.email}
              </p>
              <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all w-full"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <header className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-stone-100 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/dashboard" className="text-lg font-display font-bold text-stone-900">
              7 Pasos
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="px-3 pb-3 space-y-1 animate-fade-in">
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all w-full"
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
