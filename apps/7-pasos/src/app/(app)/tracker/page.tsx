"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useDailyLog } from "@/hooks/use-daily-log";
import { useObjectives } from "@/hooks/use-objectives";
import { getObjectiveLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  Trophy,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Flame,
  TrendingUp,
} from "lucide-react";

export default function TrackerPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const { todayLog, recentLogs, dayNumber, addVictory, updateNotes, loading } = useDailyLog();
  const { objectives } = useObjectives();
  const activeObjectives = objectives.filter((o) => o.status === "active");

  const [showAddVictory, setShowAddVictory] = useState(false);
  const [victoryDesc, setVictoryDesc] = useState("");
  const [victoryCategory, setVictoryCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Sync notes when todayLog loads
  useEffect(() => {
    if (todayLog?.notes !== undefined) setNotes(todayLog.notes);
  }, [todayLog?.notes]);

  // Guard: only accessible in tracking phase
  const phase = profile?.onboardingPhase || "reading";
  if (phase !== "tracking") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy size={40} className="text-stone-200 mb-4" />
        <h2 className="text-xl font-semibold text-stone-700 mb-2">El tracker todavía no está activo</h2>
        <p className="text-stone-500 mb-6 max-w-sm">
          Primero leé los 7 pasos y escribí tus 10 objetivos para activar el tracker de 180 días.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2.5 bg-victoria-500 text-white rounded-xl font-medium hover:bg-victoria-600 transition-colors"
        >
          Ir al inicio
        </button>
      </div>
    );
  }

  const todayVictories = todayLog?.totalVictories || 0;

  // Calculate stats
  const totalVictoriesAllTime = recentLogs.reduce((sum, log) => sum + (log.totalVictories || 0), 0);
  const avgPerDay = recentLogs.length > 0 ? Math.round(totalVictoriesAllTime / recentLogs.length * 10) / 10 : 0;

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

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await updateNotes(notes);
    setSavingNotes(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
            Tracker Diario
          </h1>
          <p className="text-stone-500 mt-1">Día {dayNumber} de 180</p>
        </div>
        <Button onClick={() => setShowAddVictory(true)}>
          <Plus size={16} />
          Victoria
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <Trophy size={18} className="text-victoria-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{todayVictories}</div>
            <div className="text-xs text-stone-500">Hoy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <TrendingUp size={18} className="text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{avgPerDay}</div>
            <div className="text-xs text-stone-500">Promedio/día</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <Flame size={18} className="text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{totalVictoriesAllTime}</div>
            <div className="text-xs text-stone-500">Total (7 días)</div>
          </CardContent>
        </Card>
      </div>

      {/* Oxitocina Reminder */}
      {todayVictories >= 5 && (
        <div className="flex items-center gap-3 p-4 bg-victoria-50 border border-victoria-200 rounded-2xl">
          <Flame size={20} className="text-victoria-500" />
          <p className="text-sm font-medium text-victoria-700">
            {todayVictories} victorias hoy. Tu cerebro está generando oxitocina.
            Cada victoria te pide más.
          </p>
        </div>
      )}

      {/* Today's Victories */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Trophy size={18} className="text-victoria-500" />
            Victorias de hoy
          </h2>
        </CardHeader>
        <CardContent>
          {todayLog?.victories && todayLog.victories.length > 0 ? (
            <div className="space-y-2">
              {todayLog.victories.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 p-3 bg-victoria-50 rounded-xl border border-victoria-100"
                >
                  <CheckCircle2 size={16} className="text-victoria-500 flex-shrink-0" />
                  <span className="text-sm text-stone-700 flex-1">{v.description}</span>
                  <span className="text-xs text-stone-400 bg-white px-2 py-0.5 rounded-full border border-stone-100 max-w-[140px] truncate">
                    {getObjectiveLabel(activeObjectives, v.category)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy size={32} className="text-stone-200 mx-auto mb-3" />
              <p className="text-stone-400 mb-4">Todavía no sumaste victorias hoy</p>
              <Button onClick={() => setShowAddVictory(true)} size="sm">
                <Plus size={14} />
                Sumar la primera
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Notes */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-stone-400" />
            Reflexión del día
          </h2>
        </CardHeader>
        <CardContent>
          <TextArea
            placeholder="¿Qué aprendiste hoy? ¿Cómo te sentís? Escribí lo que quieras..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveNotes}
              disabled={savingNotes}
            >
              {savingNotes ? "Guardando..." : "Guardar nota"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      {recentLogs.length > 1 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <Calendar size={18} className="text-stone-400" />
              Últimos días
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentLogs
                .filter((log) => log.date !== todayLog?.date)
                .map((log) => (
                  <div
                    key={log.date}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-stone-600">
                        Día {log.dayNumber}
                      </span>
                      <span className="text-xs text-stone-400">{log.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-victoria-500" />
                      <span className="text-sm font-semibold text-stone-700">
                        {log.totalVictories}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Victory Modal */}
      <Modal
        isOpen={showAddVictory}
        onClose={() => setShowAddVictory(false)}
        title="Sumar victoria"
      >
        <form onSubmit={handleAddVictory} className="space-y-4 mt-2">
          <Input
            label="¿Qué lograste?"
            placeholder="Ej: Leí 20 páginas antes de dormir"
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
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-victoria-500"
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
