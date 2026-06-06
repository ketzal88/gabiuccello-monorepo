"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { getAllLogs, type DailyLog } from "@/lib/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { calculateDayNumber, cn } from "@/lib/utils";
import { cacheGet, cacheSet } from "@/lib/cache";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Trophy,
  Calendar,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ALL_LOGS_TTL = 30 * 60 * 1000; // 30min

export default function ProgresoPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const uid = user?.uid;
  const phase = profile?.onboardingPhase || "reading";
  const startDate = useMemo(() => profile?.startDate?.toDate() || new Date(), [profile?.startDate]);
  const dayNumber = calculateDayNumber(startDate);

  useEffect(() => {
    if (!uid || fetchedRef.current) return;
    fetchedRef.current = true;

    const key = `alllogs:${uid}`;
    const cached = cacheGet<DailyLog[]>(key);
    if (cached) {
      setLogs(cached);
      setLoading(false);
      return;
    }

    getAllLogs(uid).then((allLogs) => {
      cacheSet(key, allLogs, ALL_LOGS_TTL);
      setLogs(allLogs);
      setLoading(false);
    });
  }, [uid]);

  // Memoize all expensive computations
  const { logMap, totalVictories, daysWithActivity, avgPerDay, bestDay } = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;
    let best = 0;
    logs.forEach((log) => {
      const v = log.totalVictories || 0;
      map.set(log.date, v);
      total += v;
      if (v > best) best = v;
    });
    return {
      logMap: map,
      totalVictories: total,
      daysWithActivity: logs.length,
      avgPerDay: logs.length > 0 ? Math.round(total / logs.length * 10) / 10 : 0,
      bestDay: best,
    };
  }, [logs]);

  const { months, weeklyTotals, maxWeekly } = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const daysList: { date: string; dayNum: number; victories: number; isPast: boolean; isToday: boolean }[] = [];
    for (let i = 0; i < 180; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, "yyyy-MM-dd");
      daysList.push({
        date: dateStr,
        dayNum: i + 1,
        victories: logMap.get(dateStr) || 0,
        isPast: dateStr < today,
        isToday: dateStr === today,
      });
    }

    const monthsList: { name: string; days: typeof daysList }[] = [];
    let currentMonth = "";
    daysList.forEach((day) => {
      const monthName = format(new Date(day.date), "MMMM yyyy", { locale: es });
      if (monthName !== currentMonth) {
        currentMonth = monthName;
        monthsList.push({ name: monthName, days: [] });
      }
      monthsList[monthsList.length - 1].days.push(day);
    });

    const weekly: number[] = [];
    for (let i = 0; i < daysList.length; i += 7) {
      weekly.push(daysList.slice(i, i + 7).reduce((sum, d) => sum + d.victories, 0));
    }

    return {
      months: monthsList,
      weeklyTotals: weekly,
      maxWeekly: Math.max(...weekly, 1),
    };
  }, [startDate, logMap]);

  // Guard: only accessible in tracking phase
  if (phase !== "tracking") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Calendar size={40} className="text-stone-200 mb-4" />
        <h2 className="text-xl font-semibold text-stone-700 mb-2">Progreso no disponible aún</h2>
        <p className="text-stone-500 mb-6 max-w-sm">
          Primero leé los 7 pasos y escribí tus 10 objetivos para ver tu progreso de 180 días.
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
          Tu Progreso
        </h1>
        <p className="text-stone-500 mt-1">180 días de micro-decisiones</p>

      </div>

      {/* Main Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl font-bold text-stone-900">Día {dayNumber}</span>
              <span className="text-lg text-stone-400 ml-2">de 180</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-stone-500">
                {180 - dayNumber} días restantes
              </div>
            </div>
          </div>
          <ProgressBar value={dayNumber} max={180} size="lg" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <Trophy size={18} className="text-victoria-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{totalVictories}</div>
            <div className="text-xs text-stone-500">Victorias totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <Calendar size={18} className="text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{daysWithActivity}</div>
            <div className="text-xs text-stone-500">Días activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{avgPerDay}</div>
            <div className="text-xs text-stone-500">Promedio/día</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5 text-center">
            <Flame size={18} className="text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-stone-900">{bestDay}</div>
            <div className="text-xs text-stone-500">Mejor día</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      {weeklyTotals.some((w) => w > 0) && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-stone-400" />
              Tendencia semanal
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-24">
              {weeklyTotals.map((total, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      total > 0 ? "bg-victoria-500" : "bg-stone-100",
                      i < Math.ceil(dayNumber / 7) ? "opacity-100" : "opacity-30"
                    )}
                    style={{ height: `${(total / maxWeekly) * 100}%`, minHeight: total > 0 ? "4px" : "2px" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-400">
              <span>Sem 1</span>
              <span>Sem 13</span>
              <span>Sem 26</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 180 Day Calendar Grid */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Calendar size={18} className="text-stone-400" />
            Calendario de 180 días
          </h2>
        </CardHeader>
        <CardContent>
          {months.map((month) => (
            <div key={month.name} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-stone-600 capitalize mb-2">
                {month.name}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day) => (
                  <div
                    key={day.date}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                      getIntensityClass(day.victories, day.isPast, day.isToday),
                      day.isToday && (day.victories > 4 ? "bg-victoria-500 text-white" : day.victories > 0 ? "bg-victoria-100" : "bg-white")
                    )}
                    title={`Día ${day.dayNum}: ${day.victories} victorias`}
                  >
                    {day.victories > 0 ? day.victories : ""}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100">
            <span className="text-xs text-stone-400">Menos</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-stone-100" />
              <div className="w-4 h-4 rounded bg-victoria-100" />
              <div className="w-4 h-4 rounded bg-victoria-200" />
              <div className="w-4 h-4 rounded bg-victoria-500" />
              <div className="w-4 h-4 rounded bg-victoria-700" />
            </div>
            <span className="text-xs text-stone-400">Más victorias</span>
          </div>
        </CardContent>
      </Card>

      {/* Motivational */}
      {totalVictories > 0 && (
        <div className="bg-gradient-to-br from-victoria-500 to-emerald-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-display">
            {totalVictories >= 900
              ? "900+ victorias. Cambiaste tu vida."
              : totalVictories >= 100
              ? `${totalVictories} victorias. Tu cerebro ya no quiere volver atrás.`
              : `${totalVictories} victorias acumuladas. Cada una generó oxitocina. Seguí sumando.`}
          </p>
        </div>
      )}
    </div>
  );
}

function getIntensityClass(victories: number, isPast: boolean, isToday: boolean) {
  if (isToday) return "ring-2 ring-victoria-500 ring-offset-1";
  if (!isPast && victories === 0) return "bg-stone-50 border border-stone-100";
  if (victories === 0) return "bg-stone-100";
  if (victories <= 2) return "bg-victoria-100";
  if (victories <= 4) return "bg-victoria-200";
  if (victories <= 6) return "bg-victoria-500 text-white";
  return "bg-victoria-700 text-white";
}
