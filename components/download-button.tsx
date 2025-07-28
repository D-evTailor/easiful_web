"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function DownloadButton() {
  const { language } = useLanguage()
  const handleDownload = () => {
    window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1&ab_channel=Duran", "_blank")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Google Play Button */}
      <button
        onClick={handleDownload}
        className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        <Image
          src="/google.png"
          alt={language === "es" ? "Disponible en Google Play" : "Get it on Google Play"}
          width={200}
          height={60}
          className="cursor-pointer"
          style={{ width: 'auto', height: 'auto' }}
        />
      </button>

      {/* App Store Button */}
      <button
        onClick={handleDownload}
        className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        <Image
          src="/apple.png"
          alt="Download on the App Store"
          width={200}
          height={60}
          className="cursor-pointer"
          style={{ width: 'auto', height: 'auto' }}
        />
      </button>
    </div>
  )
} 