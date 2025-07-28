import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { redirect } from "next/navigation"
import { es } from "@/languages/es"
import { en } from "@/languages/en"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PricingClient from "@/components/pricing/pricing-client"

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions)
  const t = (key: string): string => {
    const translations = locale === "es" ? es : en;
    const value = translations[key as keyof typeof es];
    return typeof value === 'string' ? value : key;
  }

  if (!session) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center">
        <header className="relative w-full text-center max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-brand">
            {t("pricing.title")}
          </h1>
          <p className="text-stone-600 mt-2 md:mt-3 text-base md:text-lg">
            {t("pricing.subtitle").replace("{name}", session?.user?.name || t("dashboard.user"))}
          </p>
          <div className="absolute top-0 left-0">
            <Button asChild variant="ghost" size="icon" className="transition-transform hover:scale-110 h-8 w-8 md:h-10 md:w-10">
              <Link href={`/${locale}/dashboard`}>
                <ArrowLeft className="h-4 w-4 md:h-6 md:w-6" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mt-8 md:mt-16 w-full">
          <PricingClient />
        </div>

      </div>
    </div>
  )
} 