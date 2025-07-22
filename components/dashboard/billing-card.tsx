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
  const { language, t } = useLanguage();

  const statusClasses = {
    [t("status.active")]: "bg-emerald-100 text-emerald-800",
    [t("status.cancelled")]: "bg-red-100 text-red-800",
    [t("status.trial")]: "bg-amber-100 text-amber-800",
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-stone-700 mb-4">{t("dashboard.subscription.title")}</h2>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{subscription.plan}</span>
            <span 
              className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[subscription.status as keyof typeof statusClasses]}`}
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
            {subscription.status === t("status.active")
              ? t("dashboard.subscription.renewal").replace("{date}", subscription.nextPayment)
              : t("dashboard.subscription.inactive")
            }
          </p>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button asChild>
            <Link href={`/${language}/pricing`}>{t("dashboard.subscription.manage")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
} 