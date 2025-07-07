"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FlipWords } from "@/components/ui/flip-words"
import { Home, Plane, DollarSign, Trophy, Heart, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const { t } = useLanguage()

  const flipWords = [
    
    "hogar",
    "viaje",
    "piso compartido",
    "vida"
  ]

  const features = [
    {
      icon: Home,
      title: t("home.features.home"),
      description: t("home.features.home.desc"),
    },
    {
      icon: Plane,
      title: t("home.features.travel"),
      description: t("home.features.travel.desc"),
    },
    {
      icon: DollarSign,
      title: t("home.features.expenses"),
      description: t("home.features.expenses.desc"),
    },
    {
      icon: Trophy,
      title: t("home.features.gamification"),
      description: t("home.features.gamification.desc"),
    },
    {
      icon: Heart,
      title: t("home.features.peace"),
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
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 mx-auto"
            onClick={() => window.open("https://play.google.com/store/apps/details?id=com.easiful.app", "_blank")}
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-sm opacity-90">Disponible en</span>
              <span className="text-lg font-semibold">Google Play</span>
            </div>
          </Button>
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
