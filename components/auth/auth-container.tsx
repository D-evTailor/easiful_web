"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface AuthContainerProps {
  children: React.ReactNode
  imageSrc: string
  imageAlt: string
  title: string
  subtitle: string
  showBackButton?: boolean
}

export function AuthContainer({ 
  children, 
  imageSrc, 
  imageAlt, 
  title, 
  subtitle,
  showBackButton = true 
}: AuthContainerProps) {

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Imagen de fondo en toda la pantalla */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/20 z-10" />
      {/* Formulario en la mitad derecha, ocupando toda la mitad */}
      <div className="absolute right-0 top-0 h-full w-1/2 bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-md z-20 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
            <p className="text-stone-700 dark:text-stone-300 text-lg">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
} 