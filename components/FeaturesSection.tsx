"use client"

import { useLanguage } from "@/lib/language-context"
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingCart,
  Wallet,
  Users,
  Trophy,
} from "lucide-react"
import { motion } from "motion/react"

export const FeaturesSection = () => {
  const { t } = useLanguage()

  const features = [
    {
      icon: LayoutDashboard,
      title: t("home.features.dashboard.title") || "Dashboard",
      desc: t("home.features.dashboard.desc") || "Visión global de tu proyecto en un vistazo",
    },
    {
      icon: CalendarCheck,
      title: t("home.features.planning.title") || "Planificación",
      desc: t("home.features.planning.desc") || "Gestiona tareas y fechas clave en un solo lugar",
    },
    {
      icon: ShoppingCart,
      title: t("home.features.shopping.title") || "Listas de compras",
      desc: t("home.features.shopping.desc") || "Crea y comparte listas colaborativas al instante",
    },
    {
      icon: Wallet,
      title: t("home.features.expenses.title") || "Gastos",
      desc: t("home.features.expenses.desc") || "Registra y reparte gastos en segundos",
    },
    {
      icon: Users,
      title: t("home.features.members.title") || "Miembros",
      desc: t("home.features.members.desc") || "Invita y gestiona roles de tu equipo o compañeros",
    },
    {
      icon: Trophy,
      title: t("home.features.gamification.title") || "Gamificación",
      desc: t("home.features.gamification.desc") || "Convierte el progreso en recompensas motivadoras",
    },
  ]

  // Animaciones y variantes como la versión anterior
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
  }

  const iconVariants = {
    hover: { 
      rotate: -3,
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <section className="bg-white/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            {t("home.features.title")}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            {t("home.features.subtitle")}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -4,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200/50 hover:border-emerald-300/50 overflow-hidden">
                {/* Border gradient on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-stone-800 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-stone-600 leading-relaxed group-hover:text-stone-700 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 