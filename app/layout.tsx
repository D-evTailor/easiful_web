import type React from "react"
import type { Metadata, Viewport } from "next"
import { Quicksand } from "next/font/google"
import "@/styles/globals.css"

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
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={quicksand.className}>
        {children}
      </body>
    </html>
  )
}
