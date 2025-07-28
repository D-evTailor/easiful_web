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
      <div className="absolute inset-0 bg-black/30 md:bg-black/20 z-10" />
      
      {/* Formulario - Responsive Layout */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-8">
        {/* Mobile: Full screen overlay, Desktop: Right half */}
        <div className="w-full max-w-md md:max-w-lg lg:max-w-md md:ml-auto md:mr-0 md:w-1/2 md:h-full md:flex md:items-center md:justify-center">
          <div className="w-full bg-white/95 md:bg-stone-50/90 backdrop-blur-md rounded-2xl md:rounded-none p-6 md:p-8 shadow-2xl md:shadow-none">
            <div className="text-center space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900">{title}</h1>
              <p className="text-stone-700 text-base md:text-lg">{subtitle}</p>
            </div>
            <div className="mt-6 md:mt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 