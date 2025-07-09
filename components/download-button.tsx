"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function DownloadButton() {
  const t = useTranslations("home.download")
  return (
    <Button
      size="lg"
      className="bg-black hover:bg-gray-800 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 mx-auto"
      onClick={() => window.open("https://play.google.com/store/apps/details?id=com.easiful.app", "_blank")}
    >
      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
      </svg>
      <div className="flex flex-col items-start">
        <span className="text-sm opacity-90">{t("available")}</span>
        <span className="text-lg font-semibold">{t("store")}</span>
      </div>
    </Button>
  )
} 