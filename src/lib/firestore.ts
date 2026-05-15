import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  Timestamp,
  arrayUnion,
  increment,
  limit,
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "./firebase";
import { getTodayString, generateId } from "./utils";

function getDb() {
  if (!db) throw new Error("Firebase not configured");
  return db;
}

// ─── User Profile ───

export type OnboardingPhase = "reading" | "objectives" | "tracking";

export interface UserProfile {
  displayName: string;
  email: string;
  createdAt: Timestamp;
  startDate: Timestamp;
  stepsRead: number[];
  onboardingPhase: OnboardingPhase;
  subscription?: {
    status: "active" | "suspended" | "gifted";
    grantedBy?: "purchase" | "admin";
    stripeSessionId?: string;
    purchasedAt?: Timestamp;
    expiresAt?: Timestamp;
  };
}

// Returns the profile to avoid a separate getUserProfile call
export async function createUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(getDb(), "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const profile: UserProfile = {
      displayName: user.displayName || "",
      email: user.email || "",
      createdAt: Timestamp.now(),
      startDate: Timestamp.now(),
      stepsRead: [],
      onboardingPhase: "reading",
    };
    await setDoc(userRef, profile);
    return profile;
  }

  const data = userSnap.data() as UserProfile;

  // Update display name if changed (e.g. Google login)
  if (user.displayName && data.displayName !== user.displayName) {
    await updateDoc(userRef, { displayName: user.displayName });
    data.displayName = user.displayName;
  }

  return data;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(getDb(), "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
}

export async function markStepAsRead(userId: string, stepNumber: number) {
  const userRef = doc(getDb(), "users", userId);
  await setDoc(userRef, { stepsRead: arrayUnion(stepNumber) }, { merge: true });
}

export async function updateOnboardingPhase(userId: string, phase: OnboardingPhase) {
  const userRef = doc(getDb(), "users", userId);
  await updateDoc(userRef, { onboardingPhase: phase });
}

// Batch: mark step as read + update phase in a single write
export async function markStepAndUpdatePhase(
  userId: string,
  stepNumber: number,
  phase: OnboardingPhase
) {
  const userRef = doc(getDb(), "users", userId);
  await setDoc(userRef, {
    stepsRead: arrayUnion(stepNumber),
    onboardingPhase: phase,
  }, { merge: true });
}

// ─── Daily Logs ───

export interface Victory {
  id: string;
  description: string;
  category: string;
  completedAt: Timestamp;
}

export interface DailyLog {
  date: string;
  dayNumber: number;
  victories: Victory[];
  totalVictories: number;
  notes?: string;
}

export async function getDailyLog(userId: string, date?: string): Promise<DailyLog | null> {
  const dateStr = date || getTodayString();
  const logRef = doc(getDb(), "users", userId, "dailyLogs", dateStr);
  const logSnap = await getDoc(logRef);
  return logSnap.exists() ? (logSnap.data() as DailyLog) : null;
}

// Optimized: uses arrayUnion + increment instead of read-then-write
export async function addVictory(
  userId: string,
  dayNumber: number,
  description: string,
  category: string
) {
  const dateStr = getTodayString();
  const logRef = doc(getDb(), "users", userId, "dailyLogs", dateStr);

  const victory: Victory = {
    id: generateId(),
    description,
    category,
    completedAt: Timestamp.now(),
  };

  // setDoc with merge creates the doc if it doesn't exist
  // For new docs, increment(1) starts at 1
  await setDoc(logRef, {
    date: dateStr,
    dayNumber,
    victories: arrayUnion(victory),
    totalVictories: increment(1),
    notes: "",
  }, { merge: true });

  return victory;
}

// Optimized: setDoc with merge instead of read-then-write
export async function updateDailyNotes(userId: string, notes: string) {
  const dateStr = getTodayString();
  const logRef = doc(getDb(), "users", userId, "dailyLogs", dateStr);
  await setDoc(logRef, { notes }, { merge: true });
}

export async function getRecentLogs(userId: string, count: number = 7): Promise<DailyLog[]> {
  const logsRef = collection(getDb(), "users", userId, "dailyLogs");
  const q = query(logsRef, orderBy("date", "desc"), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as DailyLog);
}

export async function getAllLogs(userId: string): Promise<DailyLog[]> {
  const logsRef = collection(getDb(), "users", userId, "dailyLogs");
  const q = query(logsRef, orderBy("date", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as DailyLog);
}

// ─── Objectives ───

export interface Objective {
  id?: string;
  text: string;
  category: "personal" | "profesional" | "relaciones" | "financiero";
  createdAt: Timestamp;
  order: number;
  status: "active" | "completed";
}

export async function getObjectives(userId: string): Promise<Objective[]> {
  const objRef = collection(getDb(), "users", userId, "objectives");
  const q = query(objRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Objective));
}

export async function addObjective(userId: string, objective: Omit<Objective, "id" | "createdAt">) {
  const objRef = collection(getDb(), "users", userId, "objectives");
  const id = generateId();
  await setDoc(doc(objRef, id), {
    ...objective,
    createdAt: Timestamp.now(),
  });
  return id;
}

export async function updateObjective(userId: string, objectiveId: string, data: Partial<Objective>) {
  const objRef = doc(getDb(), "users", userId, "objectives", objectiveId);
  await updateDoc(objRef, data);
}

export async function deleteObjective(userId: string, objectiveId: string) {
  const objRef = doc(getDb(), "users", userId, "objectives", objectiveId);
  await deleteDoc(objRef);
}
