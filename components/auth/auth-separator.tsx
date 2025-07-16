import React from "react"

interface AuthSeparatorProps {
  text: string
}

export function AuthSeparator({ text }: AuthSeparatorProps) {
  return (
    <div className="relative flex items-center justify-center my-6">
      {/* Líneas decorativas */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-stone-300" />
      
      {/* Texto central con diseño elegante */}
      <div className="mx-4 px-3 py-1">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider bg-transparent">
          {text}
        </span>
      </div>
      
      {/* Líneas decorativas */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-stone-300 to-stone-300" />
    </div>
  )
} 