"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "";

export function DownloadButton() {
  const { language } = useLanguage()

  if (!GOOGLE_PLAY_URL && !APP_STORE_URL) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
      {GOOGLE_PLAY_URL && (
        <a
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <Image
            src="/google.png"
            alt={language === "es" ? "Disponible en Google Play" : "Get it on Google Play"}
            width={160}
            height={48}
            className="cursor-pointer md:w-[200px] md:h-[60px]"
            style={{ width: 'auto', height: 'auto' }}
          />
        </a>
      )}

      {APP_STORE_URL && (
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <Image
            src="/apple.png"
            alt="Download on the App Store"
            width={160}
            height={48}
            className="cursor-pointer md:w-[200px] md:h-[60px]"
            style={{ width: 'auto', height: 'auto' }}
          />
        </a>
      )}
    </div>
  )
}
