"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "google" | "outline"
  isLoading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant = "primary", isLoading, icon, children, ...props }, ref) => {
    const baseStyles = "w-full px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    
    const variants = {
      primary: "bg-brand hover:bg-brand/90 text-white shadow-lg hover:shadow-xl",
      google: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md",
      outline: "bg-transparent hover:bg-stone-50 text-stone-700 border-2 border-stone-300 hover:border-stone-400"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        <div className="flex items-center justify-center gap-3">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            icon && <span className="w-5 h-5">{icon}</span>
          )}
          <span>{children}</span>
        </div>
      </button>
    )
  }
)

AuthButton.displayName = "AuthButton"

export { AuthButton } 