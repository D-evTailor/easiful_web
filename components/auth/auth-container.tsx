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
    <div className="relative min-h-screen w-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" /> 
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8 bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          
          
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