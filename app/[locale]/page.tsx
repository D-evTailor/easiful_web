"use client"

import { useLanguage } from "@/lib/language-context"
import { FlipWords } from "@/components/ui/flip-words"
import Image from "next/image"
import { DownloadButton } from "@/components/download-button"
import { FeaturesSection } from "@/components/FeaturesSection"

export default function HomePage() {
  const { t, language } = useLanguage()

  const flipWords = language === "es" ? [
    "hogar",
    "viaje",
    "piso compartido",
    "vida"
  ] : [
    "home",
    "travel",
    "shared apartment",
    "life"
  ]



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-stone-800 mb-6 leading-tight">{t("home.title")}</h1>
            <div className="text-2xl md:text-3xl text-stone-600 mb-8 leading-relaxed font-bold">
              {language === "es" ? "Organiza tu" : "Organize your"}<FlipWords words={flipWords} duration={2000} className="text-emerald-600 font-bold" />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-slide-up">
            <div className="relative">
              <div className="flex gap-4 md:gap-6">
                {/* Primera imagen - Responsiva y con tamaño fijo */}
                <div className="relative w-[200px] h-[400px] sm:w-[240px] sm:h-[480px] md:w-[280px] md:h-[560px] lg:w-[320px] lg:h-[640px] xl:w-[360px] xl:h-[720px]">
                  <div className="w-full h-full rounded-3xl transform rotate-3 overflow-hidden shadow-2xl bg-white">
                    <Image
                      src="/movil_inicio.png"
                      alt="Easiful App - Pantalla de inicio"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, (max-width: 1280px) 320px, 360px"
                    />
                  </div>
                </div>
                
                {/* Video - Responsivo y con el mismo tamaño exacto */}
                <div className="relative w-[200px] h-[400px] sm:w-[240px] sm:h-[480px] md:w-[280px] md:h-[560px] lg:w-[320px] lg:h-[640px] xl:w-[360px] xl:h-[720px]">
                  <div className="w-full h-full rounded-3xl transform -rotate-2 overflow-hidden shadow-2xl bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/family.mp4" type="video/mp4" />
                      {language === "es" ? "Tu navegador no soporta el elemento de video." : "Your browser does not support the video element."}
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
