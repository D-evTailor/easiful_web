"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = {
  free: {
    name: "Gratis",
    price: { monthly: "0€", annual: "0€" },
    description: "Para empezar a organizar tu vida.",
    features: [
      "Funcionalidades básicas",
      "Sincronización en 1 dispositivo",
      "Con anuncios"
    ],
    cta: "Tu Plan Actual",
    ctaDisabled: true,
  },
  premium: {
    name: "Premium",
    price: { monthly: "3.5€/mes", annual: "12€/año" },
    description: "Desbloquea todo el potencial de Easiful.",
    features: [
      "Todas las funcionalidades extra",
      "Sincronización ilimitada",
      "Sin anuncios",
      "Soporte prioritario"
    ],
    cta: "Actualizar a Premium",
    ctaDisabled: false,
  }
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex items-center space-x-2">
        <Label htmlFor="billing-cycle" className={billingCycle === 'monthly' ? 'text-stone-800 font-semibold' : 'text-stone-500'}>
          Pago Mensual
        </Label>
        <Switch
          id="billing-cycle"
          checked={billingCycle === 'annual'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
          aria-label="Cambiar a pago anual"
        />
        <Label htmlFor="billing-cycle" className={billingCycle === 'annual' ? 'text-stone-800 font-semibold' : 'text-stone-500'}>
          <span className="font-extrabold text-stone-800">
            Pago Anual <span className="text-sm font-normal text-brand">(Ahorra más de un 70%!)</span>
          </span>
        </Label>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {(Object.keys(plans) as Array<keyof typeof plans>).map((planKey) => {
          const plan = plans[planKey];
          const isPremium = plan.name === "Premium";
          return (
            <Card key={plan.name} className={`flex flex-col ${isPremium ? 'border-2 border-brand shadow-lg relative' : ''}`}>
              {isPremium && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <span className="bg-brand text-white px-3 py-1 text-sm font-semibold rounded-full">MÁS POPULAR</span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-3xl font-bold mb-4">
                  {plan.price[billingCycle]}
                </div>
                <ul className="space-y-2 text-stone-600">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={isPremium ? "default" : "outline"} className={`w-full ${isPremium ? 'bg-brand hover:bg-brand/90' : ''}`} disabled={plan.ctaDisabled}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 