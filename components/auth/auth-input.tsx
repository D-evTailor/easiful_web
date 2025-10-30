"use client"

import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-stone-500 transition-colors duration-200 group-hover:text-stone-600 group-focus-within:text-stone-700"
              aria-hidden
            >
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900",
              "focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand",
              "transition-colors duration-200 placeholder:text-stone-400",
              "hover:border-stone-400",
              icon && "pl-11",
              error && "border-red-300 focus:ring-red-200 focus:border-red-400",
              className
            )}
            ref={ref}
            aria-invalid={Boolean(error) || undefined}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"

export { AuthInput } 