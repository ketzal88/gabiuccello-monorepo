"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import {
  getDailyLog,
  addVictory as addVictoryToDb,
  updateDailyNotes,
  getRecentLogs,
  type DailyLog,
} from "@/lib/firestore";
import { calculateDayNumber, getTodayString } from "@/lib/utils";
import { cacheGet, cacheSet, cacheInvalidate, cacheKey, TTL } from "@/lib/cache";

export function useDailyLog() {
  const { user, profile } = useAuth();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const uid = user?.uid;
  const dayNumber = profile?.startDate
    ? calculateDayNumber(profile.startDate.toDate())
    : 1;

  const todayDate = getTodayString();

  const fetchToday = useCallback(async () => {
    if (!uid) return;

    const cached = cacheGet<DailyLog>(cacheKey.todayLog(uid, todayDate));
    if (cached) {
      setTodayLog(cached);
      return;
    }

    const log = await getDailyLog(uid);
    if (log) cacheSet(cacheKey.todayLog(uid, todayDate), log, TTL.TODAY_LOG);
    setTodayLog(log);
  }, [uid, todayDate]);

  const fetchRecent = useCallback(async () => {
    if (!uid) return;

    const cached = cacheGet<DailyLog[]>(cacheKey.recentLogs(uid));
    if (cached) {
      setRecentLogs(cached);
      return;
    }

    const logs = await getRecentLogs(uid, 7);
    cacheSet(cacheKey.recentLogs(uid), logs, TTL.RECENT_LOGS);
    setRecentLogs(logs);
  }, [uid]);

  useEffect(() => {
    if (uid && !fetchedRef.current) {
      fetchedRef.current = true;
      Promise.all([fetchToday(), fetchRecent()]).finally(() => setLoading(false));
    }
  }, [uid, fetchToday, fetchRecent]);

  const addVictory = async (description: string, category: string) => {
    if (!uid) return;
    await addVictoryToDb(uid, dayNumber, description, category);
    // Invalidate and refetch
    cacheInvalidate(cacheKey.todayLog(uid, todayDate));
    cacheInvalidate(cacheKey.recentLogs(uid));
    const [log, logs] = await Promise.all([getDailyLog(uid), getRecentLogs(uid, 7)]);
    if (log) cacheSet(cacheKey.todayLog(uid, todayDate), log, TTL.TODAY_LOG);
    cacheSet(cacheKey.recentLogs(uid), logs, TTL.RECENT_LOGS);
    setTodayLog(log);
    setRecentLogs(logs);
  };

  const updateNotes = async (notes: string) => {
    if (!uid) return;
    await updateDailyNotes(uid, notes);
    cacheInvalidate(cacheKey.todayLog(uid, todayDate));
    const log = await getDailyLog(uid);
    if (log) cacheSet(cacheKey.todayLog(uid, todayDate), log, TTL.TODAY_LOG);
    setTodayLog(log);
  };

  return {
    todayLog,
    recentLogs,
    loading,
    dayNumber,
    addVictory,
    updateNotes,
    refresh: fetchToday,
  };
}
