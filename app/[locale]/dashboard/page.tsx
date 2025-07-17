import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import BillingCard from "@/components/dashboard/billing-card"
import InvoiceHistory from "@/components/dashboard/invoice-history"
import type { Subscription, Invoice } from "@/components/dashboard/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock } from "lucide-react"

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions)

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
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-brand">
            Panel de Facturación
          </h1>
          <p className="text-stone-600 mt-2">
            ¡Bienvenido de nuevo, {session?.user?.name || "Usuario"}! Aquí tienes un resumen de tu cuenta.
          </p>
        </header>

        <div className="space-y-12">
          <BillingCard subscription={subscriptionForCard} />
          
          {/* --- Feature Gating Example --- */}
          {!isPremium && (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="text-lg font-semibold text-yellow-800">Función Premium</h3>
              <p className="text-yellow-700">
                El historial de facturas solo está disponible en el plan Premium.
              </p>
              <Button asChild className="mt-4 bg-brand hover:bg-brand/90">
                <Link href={`/${locale}/pricing`}>Actualizar a Premium</Link>
              </Button>
            </div>
          )}
          
          <InvoiceHistory invoices={invoices} isPremium={isPremium} />
        </div>
      </div>
    </div>
  )
} 