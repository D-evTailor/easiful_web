"use client"

import { useLanguage } from "@/lib/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-2xl font-bold text-stone-800 mb-4 md:mb-0">Easiful</div>
          <div className="text-stone-600">© 2024 Easiful. {t("footer.rights")}</div>
        </div>
      </div>
    </footer>
  )
}
