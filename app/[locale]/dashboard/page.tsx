import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { redirect } from "next/navigation"
import { es } from "@/languages/es"
import { en } from "@/languages/en"
import BillingCard from "@/components/dashboard/billing-card"
import InvoiceHistory from "@/components/dashboard/invoice-history"
import type { Subscription, Invoice } from "@/components/dashboard/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock } from "lucide-react"

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
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

  // --- Real Subscription Data ---
  // The user's subscription is now retrieved from the session.
  const userSubscription = session.user.subscription;
  const isPremium = userSubscription?.status === 'active' && userSubscription?.planId !== 'free';

  // We adapt the data for the BillingCard component.
  const subscriptionForCard: Subscription = {
    plan: userSubscription?.planId === 'free' ? 'Gratis' : 'Premium',
    status: userSubscription?.status ?? 'inactivo',
    nextPayment: userSubscription?.endDate 
      ? new Date(userSubscription.endDate).toLocaleDateString() 
      : "N/A",
    price: userSubscription?.planId === 'free' ? "0€/mes" : "15€/mes" // Example price
  }

  // Invoice data would be fetched from your database here.
  const invoices: Invoice[] = []

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-brand">
            {t("dashboard.title")}
          </h1>
          <p className="text-stone-600 mt-1 md:mt-2 text-sm md:text-base">
            {t("dashboard.welcome").replace("{name}", session?.user?.name || t("dashboard.user"))}
          </p>
        </header>

        <div className="space-y-8 md:space-y-12">
          <BillingCard subscription={subscriptionForCard} />
          
          {/* --- Feature Gating Example --- */}
          {!isPremium && (
            <div className="p-4 md:p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <Lock className="mx-auto h-6 w-6 md:h-8 md:w-8 text-yellow-500 mb-2" />
              <h3 className="text-base md:text-lg font-semibold text-yellow-800">{t("dashboard.premium.title")}</h3>
              <p className="text-yellow-700 text-sm md:text-base mt-2">
                {t("dashboard.premium.description")}
              </p>
              <Button asChild className="mt-3 md:mt-4 bg-brand hover:bg-brand/90 text-sm md:text-base">
                <Link href={`/${locale}/pricing`}>{t("dashboard.premium.upgrade")}</Link>
              </Button>
            </div>
          )}
          
          <InvoiceHistory invoices={invoices} isPremium={isPremium} />
        </div>
      </div>
    </div>
  )
} 