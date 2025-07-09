import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import BillingCard from "@/components/dashboard/billing-card"
import InvoiceHistory from "@/components/dashboard/invoice-history"
import type { Subscription, Invoice } from "@/components/dashboard/types"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // En un futuro, estos datos vendrán de tu base de datos.
  // Podrías tener una lógica como:
  // const subscriptionData = await getUserSubscription(session.user.id);
  // const invoiceData = await getUserInvoices(session.user.id);

  const subscription: Subscription = {
    plan: "Gratis",
    status: "Activo",
    nextPayment: "N/A",
    price: "0€/mes"
  }

  const invoices: Invoice[] = [] // Por defecto no hay facturas

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
          <BillingCard subscription={subscription} />
          <InvoiceHistory invoices={invoices} />
        </div>
      </div>
    </div>
  )
} 