"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import {
  getObjectives,
  addObjective as addObj,
  updateObjective as updateObj,
  deleteObjective as deleteObj,
  type Objective,
} from "@/lib/firestore";
import { cacheGet, cacheSet, cacheInvalidate, cacheKey, TTL } from "@/lib/cache";

export function useObjectives() {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const uid = user?.uid;

  const fetchObjectives = useCallback(async () => {
    if (!uid) return;

    // Try cache first
    const cached = cacheGet<Objective[]>(cacheKey.objectives(uid));
    if (cached) {
      setObjectives(cached);
      setLoading(false);
      return;
    }

    const objs = await getObjectives(uid);
    cacheSet(cacheKey.objectives(uid), objs, TTL.OBJECTIVES);
    setObjectives(objs);
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    if (uid && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchObjectives();
    }
  }, [uid, fetchObjectives]);

  const invalidateAndRefetch = async () => {
    if (!uid) return;
    cacheInvalidate(cacheKey.objectives(uid));
    const objs = await getObjectives(uid);
    cacheSet(cacheKey.objectives(uid), objs, TTL.OBJECTIVES);
    setObjectives(objs);
  };

  const addObjective = async (data: {
    text: string;
    category: "personal" | "profesional" | "relaciones" | "financiero";
    order: number;
  }) => {
    if (!uid) return;
    await addObj(uid, { ...data, status: "active" });
    await invalidateAndRefetch();
  };

  const updateObjective = async (id: string, data: Partial<Objective>) => {
    if (!uid) return;
    await updateObj(uid, id, data);
    await invalidateAndRefetch();
  };

  const deleteObjective = async (id: string) => {
    if (!uid) return;
    await deleteObj(uid, id);
    await invalidateAndRefetch();
  };

  return {
    objectives,
    loading,
    addObjective,
    updateObjective,
    deleteObjective,
    refresh: fetchObjectives,
  };
}
