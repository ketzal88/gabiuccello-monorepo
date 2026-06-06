"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "gabriel@worker.ar";

interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  onboardingPhase: string;
  stepsRead: number[];
  subscription: { status: string; grantedBy?: string; stripeSessionId?: string };
  createdAt: string | null;
  startDate: string | null;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showGrant, setShowGrant] = useState(false);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantName, setGrantName] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantError, setGrantError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json() as { users: AdminUser[] };
    setUsers(data.users || []);
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) fetchUsers();
  }, [user, fetchUsers]);

  const handleToggleStatus = async (uid: string, currentStatus: string) => {
    const token = await user!.getIdToken();
    const newStatus = currentStatus === "active" || currentStatus === "gifted" ? "suspended" : "active";
    await fetch(`/api/admin/users/${uid}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchUsers();
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setGranting(true);
    setGrantError("");
    const token = await user!.getIdToken();
    const res = await fetch("/api/admin/grant-access", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: grantEmail.trim(), name: grantName.trim() }),
    });
    if (res.ok) {
      setShowGrant(false);
      setGrantEmail("");
      setGrantName("");
      fetchUsers();
    } else {
      const err = await res.json() as { error?: string };
      setGrantError(err.error || "Error al crear usuario");
    }
    setGranting(false);
  };

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400">Cargando...</p>
      </div>
    );
  }

  const activeCount = users.filter((u) => u.subscription?.status !== "suspended").length;
  const purchasedCount = users.filter((u) => u.subscription?.grantedBy === "purchase").length;
  const giftedCount = users.filter((u) => u.subscription?.grantedBy === "admin").length;
  const trackingCount = users.filter((u) => u.onboardingPhase === "tracking").length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Admin — 7 Pasos</h1>
            <p className="text-sm text-stone-400 mt-0.5">{users.length} usuarios totales</p>
          </div>
          <button
            onClick={() => setShowGrant(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            + Dar acceso gratis
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Acceso activo" value={activeCount} color="text-green-600" />
          <StatCard label="Compraron" value={purchasedCount} color="text-orange-500" />
          <StatCard label="Acceso regalo" value={giftedCount} color="text-blue-500" />
          <StatCard label="En tracker" value={trackingCount} color="text-violet-500" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Acceso</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Fase</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Progreso</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Registro</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-stone-300 text-sm">Cargando usuarios...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-stone-300 text-sm">Sin usuarios todavía</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <UserRow key={u.uid} user={u} onToggle={handleToggleStatus} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grant access modal */}
      {showGrant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-stone-900 mb-1">Dar acceso gratis</h2>
            <p className="text-sm text-stone-400 mb-5">
              Se crea el usuario en Firebase y se manda un email con el link para crear contraseña.
            </p>
            <form onSubmit={handleGrant} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Email *</label>
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  required
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Nombre</label>
                <input
                  type="text"
                  value={grantName}
                  onChange={(e) => setGrantName(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  placeholder="Nombre completo"
                />
              </div>
              {grantError && (
                <p className="text-sm text-red-500">{grantError}</p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowGrant(false); setGrantError(""); }}
                  className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={granting}
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {granting ? "Creando..." : "Dar acceso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-200">
      <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function UserRow({
  user,
  onToggle,
}: {
  user: AdminUser;
  onToggle: (uid: string, status: string) => void;
}) {
  const status = user.subscription?.status || "active";
  const grantedBy = user.subscription?.grantedBy;
  const phase = user.onboardingPhase || "reading";

  const phaseLabel: Record<string, string> = {
    reading: "Leyendo",
    objectives: "Objetivos",
    tracking: "Tracker",
  };

  const dayNumber = user.startDate && phase === "tracking"
    ? Math.min(
        Math.floor((Date.now() - new Date(user.startDate).getTime()) / 86_400_000) + 1,
        180
      )
    : null;

  const createdFormatted = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const isActive = status !== "suspended";

  return (
    <tr className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
      <td className="px-5 py-3.5">
        <p className="font-medium text-stone-900 text-sm leading-tight">{user.displayName || "Sin nombre"}</p>
        <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              status === "suspended"
                ? "bg-red-50 text-red-600"
                : status === "gifted"
                ? "bg-blue-50 text-blue-600"
                : "bg-green-50 text-green-700"
            }`}
          >
            <span className="text-[8px]">●</span>
            {status === "suspended" ? "Suspendido" : status === "gifted" ? "Regalo" : "Activo"}
          </span>
          {grantedBy === "purchase" && (
            <span className="text-xs text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded-md">Stripe</span>
          )}
          {grantedBy === "admin" && (
            <span className="text-xs text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-md">Admin</span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-stone-600">{phaseLabel[phase] || phase}</span>
        {phase === "reading" && (
          <span className="ml-1.5 text-xs text-stone-300">{user.stepsRead?.length || 0}/7</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        {dayNumber ? (
          <span className="text-sm font-semibold text-orange-500">Día {dayNumber}</span>
        ) : phase === "objectives" ? (
          <span className="text-xs text-blue-400">Escribiendo objetivos</span>
        ) : (
          <span className="text-xs text-stone-200">—</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs text-stone-400">{createdFormatted}</span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          onClick={() => onToggle(user.uid, status)}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            isActive
              ? "text-red-500 hover:bg-red-50"
              : "text-green-600 hover:bg-green-50"
          }`}
        >
          {isActive ? "Suspender" : "Reactivar"}
        </button>
      </td>
    </tr>
  );
}
