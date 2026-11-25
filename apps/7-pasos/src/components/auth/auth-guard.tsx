"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { hasAccess } from "@/lib/firestore";
import { signOut } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // La app es solo para quien compró o recibió acceso. El chequeo real está en
  // las reglas de Firestore y en /api/libro; esto es la UX.
  if (!hasAccess(profile)) {
    const suspended = profile?.subscription?.status === "suspended";
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
        <div className="max-w-md text-center flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-stone-900">Tu cuenta no tiene acceso activo</h1>
          <p className="text-stone-600">
            {suspended
              ? "Tu acceso está suspendido. Si creés que es un error, escribinos a hola@gabiuccello.com."
              : "Para usar la app necesitás comprar el libro. Si ya lo compraste, entrá con el mismo mail que usaste en el pago."}
          </p>
          {!suspended && (
            <a
              href="/venta"
              className="inline-block rounded-md bg-victoria-500 px-6 py-3 font-semibold text-white"
            >
              Ver el libro
            </a>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm text-stone-500 underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
