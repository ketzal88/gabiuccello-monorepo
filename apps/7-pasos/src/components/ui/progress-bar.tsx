"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-stone-600">Progreso</span>
          <span className="text-sm font-semibold text-victoria-600">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-stone-100 rounded-full overflow-hidden",
          {
            "h-1.5": size === "sm",
            "h-3": size === "md",
            "h-4": size === "lg",
          }
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-victoria-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
