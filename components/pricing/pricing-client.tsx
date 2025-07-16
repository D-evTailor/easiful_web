"use client"

import { useSession } from "next-auth/react"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// --- (IMPORTANT) ---
// Replace these with your actual Stripe Price IDs from your Stripe Dashboard.
const PLANS = [
  {
    name: "Gratis",
    price: "0€",
    period: "/mes",
    priceId: "free", // A local identifier, not a Stripe ID
    features: [
      "1 Proyecto",
      "Funcionalidades básicas",
      "Soporte por email",
    ],
  },
  {
    name: "Premium Mensual",
    price: "3.50€",
    period: "/mes",
    priceId: "price_PREMIUM_MONTHLY_ID", // Replace this
    features: [
      "Proyectos ilimitados",
      "Todas las funcionalidades premium",
      "Soporte prioritario",
      "Acceso a la comunidad",
    ],
  },
  {
    name: "Premium Anual",
    price: "12€",
    period: "/año",
    priceId: "price_PREMIUM_ANNUAL_ID", // Replace this
    features: [
      "Todo lo del plan mensual",
      "2 meses gratis",
      "Facturación anual",
      "Acceso anticipado a betas",
    ],
  },
]

export default function PricingClient() {
  const { data: session } = useSession()
  const { upgradeToPlan, isLoading } = useSubscription()

  const userSubscription = session?.user?.subscription
  const currentPlanId = userSubscription?.planId

  const handleUpgrade = (priceId: string) => {
    if (!session) {
      // This should ideally redirect to login, but for now, we'll just log.
      console.error("User is not authenticated.")
      return
    }
    upgradeToPlan(priceId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {PLANS.map((plan) => {
        const isCurrentPlan = currentPlanId === plan.priceId
        return (
          <Card 
            key={plan.name}
            className={cn(
                "flex flex-col rounded-2xl shadow-lg transition-transform hover:scale-105",
                isCurrentPlan && "border-2 border-brand ring-4 ring-brand/20"
            )}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-extrabold text-brand">
                {plan.price}<span className="text-lg font-medium text-stone-500">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.priceId === "free" ? (
                <Button variant="outline" className="w-full" disabled>
                  Plan Actual
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={isLoading || isCurrentPlan}
                  className="w-full bg-brand hover:bg-brand/90"
                >
                  {isLoading ? "Procesando..." : (isCurrentPlan ? "Plan Actual" : "Suscribirse")}
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
} 