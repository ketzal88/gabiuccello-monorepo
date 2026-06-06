"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white text-stone-900 placeholder:text-stone-400",
            "focus:outline-none focus:ring-2 focus:ring-victoria-500 focus:border-transparent",
            "transition-all duration-200",
            error ? "border-red-300" : "border-stone-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ className, label, ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400",
          "focus:outline-none focus:ring-2 focus:ring-victoria-500 focus:border-transparent",
          "transition-all duration-200 resize-none",
          className
        )}
        {...props}
      />
    </div>
  );
}
