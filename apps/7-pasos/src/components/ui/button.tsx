"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-victoria-500 text-white hover:bg-victoria-600 focus:ring-victoria-500 shadow-sm hover:shadow":
              variant === "primary",
            "bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-400":
              variant === "secondary",
            "text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:ring-stone-400":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500":
              variant === "danger",
          },
          {
            "text-sm px-3 py-1.5 gap-1.5": size === "sm",
            "text-sm px-4 py-2.5 gap-2": size === "md",
            "text-base px-6 py-3 gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
