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
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black opacity-100">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/50 backdrop-blur-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand",
              "transition-all duration-300 placeholder:text-stone-400",
              "hover:border-stone-400 hover:bg-stone-50",
              icon && "pl-10",
              error && "border-red-300 focus:ring-red-200 focus:border-red-400",
              className
            )}
            ref={ref}
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