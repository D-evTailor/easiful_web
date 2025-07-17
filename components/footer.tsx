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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-stone-800 mb-4">Easiful</h3>
            <p className="mb-4">Simplifica tu vida</p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href={getLocalePath("/legal/aviso-legal")} className="hover:underline">Aviso Legal</Link></li>
              <li><Link href={getLocalePath("/legal/privacidad")} className="hover:underline">Política de Privacidad</Link></li>
              <li><Link href={getLocalePath("/legal/cookies")} className="hover:underline">Política de Cookies</Link></li>
              {/* Add 'Condiciones de Contratación' if you sell something */}
              {/* <li><Link href={getLocalePath("/legal/terminos")} className="hover:underline">Condiciones de Contratación</Link></li> */}
            </ul>
          </div>

          {/* Quick Links (Optional) */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link href={getLocalePath("/sobre-nosotros")} className="hover:underline">Sobre Nosotros</Link></li>
              <li><Link href={getLocalePath("/contacto")} className="hover:underline">Contacto</Link></li>
              <li><Link href={getLocalePath("/faq")} className="hover:underline">FAQ</Link></li>
            </ul>
          </div>
          
          {/* App Download */}
          <div>
            <h4 className="font-semibold text-stone-800 mb-4">Descarga la App</h4>
            <div className="flex flex-col -mt-4">
              <Link href="https://www.youtube.com/shorts/le6hBT8JsUY" passHref>
                <Image 
                  src="/apple.png" 
                  alt="Download on the App Store" 
                  width={135} 
                  height={40} 
                  className="hover:opacity-90 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
              <Link href="https://www.youtube.com/shorts/SXHMnicI6Pg" passHref className="-mt-4">
                <Image 
                  src="/google.png" 
                  alt="Get it on Google Play" 
                  width={135} 
                  height={40} 
                  className="hover:opacity-90 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Easiful. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}
