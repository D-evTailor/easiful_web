import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Easiful - Organiza tu vida. Recupera tu tiempo.",
  description:
    "La app que te ayuda a organizar tu vida diaria con paz, claridad y motivación. Descarga Easiful y transforma tu rutina.",
  keywords: "organización, productividad, app móvil, gestión del hogar, planificación",
  authors: [{ name: "Easiful Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={quicksand.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
