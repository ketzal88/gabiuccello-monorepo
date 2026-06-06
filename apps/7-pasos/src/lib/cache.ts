import { Timestamp } from "firebase/firestore";

const PREFIX = "7p:";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// ─── Timestamp serialization ───

function serializeValue(val: unknown): unknown {
  if (val instanceof Timestamp) {
    return { __ts: true, s: val.seconds, n: val.nanoseconds };
  }
  if (Array.isArray(val)) return val.map(serializeValue);
  if (val && typeof val === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = serializeValue(v);
    }
    return out;
  }
  return val;
}

function deserializeValue(val: unknown): unknown {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    if (obj.__ts === true) {
      return new Timestamp(obj.s as number, obj.n as number);
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = deserializeValue(v);
    }
    return out;
  }
  if (Array.isArray(val)) return val.map(deserializeValue);
  return val;
}

// ─── Core helpers ───

export function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<unknown>;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return deserializeValue(entry.data) as T;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  try {
    const entry: CacheEntry<unknown> = {
      data: serializeValue(data),
      expiresAt: Date.now() + ttlMs,
    };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function cacheInvalidate(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export function cacheInvalidateAll(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

// ─── TTL constants ───

export const TTL = {
  PROFILE: 24 * 60 * 60 * 1000, // 24h
  OBJECTIVES: 60 * 60 * 1000,    // 1h
  TODAY_LOG: 30 * 60 * 1000,     // 30min
  RECENT_LOGS: 60 * 60 * 1000,   // 1h
} as const;

// ─── Key builders ───

export const cacheKey = {
  profile: (uid: string) => `profile:${uid}`,
  objectives: (uid: string) => `objectives:${uid}`,
  todayLog: (uid: string, date: string) => `today:${uid}:${date}`,
  recentLogs: (uid: string) => `recent:${uid}`,
} as const;
