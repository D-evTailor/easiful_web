"use client"

import { useTranslations } from "next-intl"
import { FlipWords } from "@/components/ui/flip-words"
import Image from "next/image"
import { DownloadButton } from "@/components/download-button"
import { FeaturesSection } from "@/components/FeaturesSection"

export default function HomePage() {
  const t = useTranslations()

  const flipWords = [
    "hogar",
    "viaje",
    "piso compartido",
    "vida"
  ]



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-stone-800 mb-6 leading-tight">{t("home.title")}</h1>
            <div className="text-2xl md:text-3xl text-stone-600 mb-8 leading-relaxed font-bold">
              Organiza tu<FlipWords words={flipWords} duration={2000} className="text-emerald-600 font-bold" />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-slide-up">
            <div className="relative">
              <div className="flex gap-6">
                <div className="phone-shadow animate-float">
                  <Image
                    src="/movil_inicio.png"
                    alt="Easiful App - Pantalla de inicio"
                    width={280}
                    height={560}
                    priority
                    className="rounded-3xl transform rotate-3 object-cover"
                    style={{ aspectRatio: '280/560' }}
                  />
                </div>
                <div className="phone-shadow animate-float" style={{ animationDelay: "1s" }}>
                  <div className="w-[280px] h-[560px] rounded-3xl transform -rotate-2 overflow-hidden bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '280/560' }}
                    >
                      <source src="/family.mp4" type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center">
          <DownloadButton />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  )
}
