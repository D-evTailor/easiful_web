"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Subscription {
  plan: string;
  status: "Activo" | "Cancelado" | "Prueba";
  price: string;
  nextPayment: string;
}

interface BillingCardProps {
  subscription: Subscription;
}

export default function BillingCard({ subscription }: BillingCardProps) {
  const { language } = useLanguage();

  const statusClasses = {
    Activo: "bg-emerald-100 text-emerald-800",
    Cancelado: "bg-red-100 text-red-800",
    Prueba: "bg-amber-100 text-amber-800",
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-stone-700 mb-4">Tu Suscripción</h2>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{subscription.plan}</span>
            <span 
              className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[subscription.status]}`}
            >
              {subscription.status}
            </span>
          </CardTitle>
          <CardDescription>
            {subscription.price}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-stone-600">
            {subscription.status === "Activo" 
              ? `Tu suscripción se renovará el ${subscription.nextPayment}.`
              : "No tienes una suscripción activa."
            }
          </p>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button asChild>
            <Link href={`/${language}/pricing`}>Gestionar Suscripción</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
} 