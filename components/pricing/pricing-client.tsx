// ✅ CONFIGURACIÓN COMPLETA - IDs de Precio de Stripe
// 
// Product IDs y Price IDs configurados correctamente:
// 
// PRODUCTO MENSUAL (3.5€/mes):
// - Product ID: prod_SeNbcpF2Ka0cwQ  
// - Price ID: price_1Rj4q9PY7RDrzGXCxZ4Afq9k ✅
// 
// PRODUCTO ANUAL (12€/año):
// - Product ID: prod_ShK7zH2jz0pLYZ
// - Price ID: price_1RlvTkPY7RDrzGXCZAX3wkJg ✅
//
// ✅ Los Price IDs reales ya están configurados en el array getPlans() más abajo.
// ✅ Listos para crear sesiones de checkout de Stripe.

"use client"

import { useSession } from "next-auth/react"
import { useLanguage } from "@/lib/language-context"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const getPlans = (t: any) => [
  {
    name: t("pricing.free"),
    price: "0€",
    period: t("pricing.perMonth"),
    priceId: "free", // A local identifier, not a Stripe ID
    features: t("pricing.features.free") as string[],
  },
  {
    name: t("pricing.premiumMonthly"),
    price: "3.50€",
    period: t("pricing.perMonth"),
    // ✅ Price ID real del producto mensual 3.5€ (prod_SeNbcpF2Ka0cwQ)
    priceId: "price_1Rj4q9PY7RDrzGXCxZ4Afq9k", 
    features: t("pricing.features.premiumMonthly") as string[],
  },
  {
    name: t("pricing.premiumAnnual"),
    price: "12€",
    period: t("pricing.perYear"),
    // ✅ Price ID real del producto anual 12€ (prod_ShK7zH2jz0pLYZ)
    priceId: "price_1RlvTkPY7RDrzGXCZAX3wkJg",
    features: t("pricing.features.premiumAnnual") as string[],
  },
]

export default function PricingClient() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const { upgradeToPlan, isLoading } = useSubscription()

  const userSubscription = session?.user?.subscription
  const currentPlanId = userSubscription?.planId

  const handleUpgrade = (priceId: string) => {
    if (!session) {
      // This should ideally redirect to login, but for now, we'll just log.
      console.error(t("pricing.error.notAuthenticated"))
      return
    }
    upgradeToPlan(priceId)
  }

  const plans = getPlans(t);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      {plans.map((plan: any) => {
        const isCurrentPlan = currentPlanId === plan.priceId
        return (
          <Card 
            key={plan.name}
            className={cn(
                "flex flex-col rounded-2xl shadow-lg transition-transform hover:scale-105",
                isCurrentPlan && "border-2 border-brand ring-4 ring-brand/20"
            )}
          >
            <CardHeader className="text-center p-4 md:p-6">
              <CardTitle className="text-lg md:text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-2xl md:text-4xl font-extrabold text-brand">
                {plan.price}<span className="text-sm md:text-lg font-medium text-stone-500">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 md:p-6">
              <ul className="space-y-2 md:space-y-3">
                {Array.isArray(plan.features) && plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm md:text-base text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
              {plan.priceId === "free" ? (
                <Button variant="outline" className="w-full text-sm md:text-base" disabled>
                  {t("pricing.currentPlan")}
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={isLoading || isCurrentPlan}
                  className="w-full bg-brand hover:bg-brand/90 text-sm md:text-base"
                >
                  {isLoading ? t("pricing.processing") : (isCurrentPlan ? t("pricing.currentPlan") : t("pricing.subscribe"))}
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
} 