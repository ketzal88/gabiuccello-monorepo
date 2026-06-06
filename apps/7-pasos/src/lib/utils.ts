import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, format, addDays } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDayNumber(startDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diff = differenceInDays(today, start) + 1;
  return Math.max(1, Math.min(diff, 180));
}

export function calculateProgress(dayNumber: number): number {
  return Math.round((dayNumber / 180) * 100);
}

export function getEndDate(startDate: Date): Date {
  return addDays(startDate, 179);
}

export function formatDateES(date: Date): string {
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const OBJECTIVE_CATEGORIES = [
  { value: "personal", label: "Personal", color: "bg-blue-100 text-blue-700" },
  { value: "profesional", label: "Profesional", color: "bg-purple-100 text-purple-700" },
  { value: "relaciones", label: "Relaciones", color: "bg-pink-100 text-pink-700" },
  { value: "financiero", label: "Financiero", color: "bg-amber-100 text-amber-700" },
] as const;

export function getObjectiveLabel(
  objectives: { id?: string; text: string }[],
  category: string,
  maxLength = 40
): string {
  const obj = objectives.find((o) => o.id === category);
  if (!obj) return category;
  return obj.text.length > maxLength ? obj.text.slice(0, maxLength) + "..." : obj.text;
}
