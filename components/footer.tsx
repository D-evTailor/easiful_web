"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  const { language, t } = useLanguage()

  const getLocalePath = (path: string) => {
    // No special handling needed for "/" here as it's not a direct link
    return `/${language}${path}`;
  }

  return (
    <footer className="bg-stone-50 text-stone-600">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-3 md:mb-4">{t("footer.company")}</h3>
            <p className="mb-3 md:mb-4 text-sm md:text-base">{t("footer.tagline")}</p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-3 md:mb-4 text-sm md:text-base">{t("footer.legal")}</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><Link href={getLocalePath("/legal/aviso-legal")} className="hover:underline text-sm md:text-base">{t("footer.legalNotice")}</Link></li>
              <li><Link href={getLocalePath("/legal/privacidad")} className="hover:underline text-sm md:text-base">{t("footer.privacyPolicy")}</Link></li>
              <li><Link href={getLocalePath("/legal/cookies")} className="hover:underline text-sm md:text-base">{t("footer.cookiePolicy")}</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-3 md:mb-4 text-sm md:text-base">{t("footer.links")}</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><Link href={getLocalePath("/sobre-nosotros")} className="hover:underline text-sm md:text-base">{t("nav.about")}</Link></li>
              <li><Link href={getLocalePath("/contacto")} className="hover:underline text-sm md:text-base">{t("nav.contact")}</Link></li>
              <li><Link href={getLocalePath("/faq")} className="hover:underline text-sm md:text-base">{t("footer.faq")}</Link></li>
            </ul>
          </div>
          
          {/* App Download */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-3 md:mb-4 text-sm md:text-base">{t("footer.downloadApp")}</h4>
            <div className="flex flex-col gap-2 md:-mt-4">
              <Link href="https://www.youtube.com/shorts/le6hBT8JsUY" passHref>
                <Image 
                  src="/apple.png" 
                  alt="Download on the App Store" 
                  width={120} 
                  height={35} 
                  className="hover:opacity-90 transition-opacity md:w-[135px] md:h-[40px]"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
              <Link href="https://www.youtube.com/shorts/SXHMnicI6Pg" passHref>
                <Image 
                  src="/google.png" 
                  alt="Get it on Google Play" 
                  width={120} 
                  height={35} 
                  className="hover:opacity-90 transition-opacity md:w-[135px] md:h-[40px]"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-xs md:text-sm">
          <p>© {new Date().getFullYear()} {t("footer.company")}. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}
