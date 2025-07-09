"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { FlipWords } from "@/components/ui/flip-words"
import { Home, Plane, DollarSign, Trophy, Heart, CheckCircle } from "lucide-react"
import Image from "next/image"
import { DownloadButton } from "@/components/download-button"

export default function HomePage() {
  const t = useTranslations()

  const flipWords = [
    
    "hogar",
    "viaje",
    "piso compartido",
    "vida"
  ]

  const features = [
    {
      icon: Home,
      title: t("home.features.home.title"),
      description: t("home.features.home.desc"),
    },
    {
      icon: Plane,
      title: t("home.features.travel.title"),
      description: t("home.features.travel.desc"),
    },
    {
      icon: DollarSign,
      title: t("home.features.expenses.title"),
      description: t("home.features.expenses.desc"),
    },
    {
      icon: Trophy,
      title: t("home.features.gamification.title"),
      description: t("home.features.gamification.desc"),
    },
    {
      icon: Heart,
      title: t("home.features.peace.title"),
      description: t("home.features.peace.desc"),
    },
  ]

  const useCases = [t("home.uses.luggage"), t("home.uses.expenses"), t("home.uses.planning"), t("home.uses.home")]

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
      <section className="bg-white/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">{t("home.features.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-white/80 backdrop-blur-sm border-stone-200 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-4">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">{t("home.uses.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="card-hover bg-gradient-to-r from-emerald-50 to-stone-50 p-6 rounded-2xl border border-stone-200"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <p className="text-stone-700 font-medium text-lg">{useCase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
