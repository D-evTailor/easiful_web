"use client"

import { useLanguage } from "@/lib/language-context"
import { Heart, Clock, Sparkles } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">{t("about.title")}</h1>
          <p className="text-xl md:text-2xl text-stone-600 leading-relaxed max-w-3xl mx-auto">{t("about.subtitle")}</p>
        </div>

        <div className="space-y-16 animate-slide-up">
          {/* Main Content */}
          <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 border border-stone-200/50 shadow-xl">
            <div className="space-y-8 text-lg text-stone-700 leading-relaxed">
              <p className="text-xl font-medium text-stone-800 mb-6">{t("about.content1")}</p>
              <p>{t("about.content2")}</p>
              <p>{t("about.content3")}</p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl border border-emerald-200/50 card-hover">
              <div className="w-20 h-20 bg-emerald-200/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Tranquilidad</h3>
              <p className="text-stone-600 leading-relaxed">
                Encuentra paz mental en tu rutina diaria. Cada función está diseñada para reducir el estrés y crear
                armonía.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl border border-amber-200/50 card-hover">
              <div className="w-20 h-20 bg-amber-200/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Tiempo</h3>
              <p className="text-stone-600 leading-relaxed">
                Recupera horas valiosas cada día. Optimiza tu tiempo para dedicarlo a lo que realmente importa.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-3xl border border-stone-200/50 card-hover">
              <div className="w-20 h-20 bg-stone-200/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-stone-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Claridad</h3>
              <p className="text-stone-600 leading-relaxed">
                Organiza tus pensamientos y tareas con claridad. Transforma el caos en un sistema que funciona.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-3xl p-8 md:p-12 border border-stone-200/50">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Nuestra Misión</h2>
            <p className="text-lg text-stone-700 leading-relaxed max-w-3xl mx-auto">
              Creemos que la tecnología debe simplificar la vida, no complicarla. Easiful es más que una app de
              organización: es tu compañero digital para crear una vida más equilibrada, productiva y serena.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
