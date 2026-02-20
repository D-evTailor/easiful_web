"use client";

import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/language-context";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  period: string;
  planId: string;
  features: string[];
}

/**
 * The language context `t()` returns `string` at the type level, but feature
 * keys resolve to `string[]` at runtime.  We cast only where necessary.
 */
function getPlans(t: (key: string) => string): Plan[] {
  return [
    {
      name: t("pricing.free"),
      price: "0€",
      period: t("pricing.perMonth"),
      planId: "free",
      features: t("pricing.features.free") as unknown as string[],
    },
    {
      name: t("pricing.premiumMonthly"),
      price: "3.50€",
      period: t("pricing.perMonth"),
      planId: "monthly",
      features: t("pricing.features.premiumMonthly") as unknown as string[],
    },
    {
      name: t("pricing.premiumAnnual"),
      price: "12€",
      period: t("pricing.perYear"),
      planId: "annual",
      features: t("pricing.features.premiumAnnual") as unknown as string[],
    },
  ];
}

export default function PricingClient() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const { upgradeToPlan, isLoading } = useSubscription();

  const userSubscription = session?.user?.subscription;
  const currentPlanId = userSubscription?.planId;

  const handleUpgrade = (planId: string) => {
    if (!session) return;
    upgradeToPlan(planId, language);
  };

  const plans = getPlans(t);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlanId === plan.planId;
        return (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl shadow-lg transition-transform hover:scale-105",
              isCurrentPlan && "border-2 border-brand ring-4 ring-brand/20"
            )}
          >
            <CardHeader className="text-center p-4 md:p-6">
              <CardTitle className="text-lg md:text-2xl font-bold">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-2xl md:text-4xl font-extrabold text-brand">
                {plan.price}
                <span className="text-sm md:text-lg font-medium text-stone-500">
                  {plan.period}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 md:p-6">
              <ul className="space-y-2 md:space-y-3">
                {Array.isArray(plan.features) &&
                  plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 md:gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm md:text-base text-stone-700">
                        {feature}
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
              {plan.planId === "free" ? (
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base"
                  disabled
                >
                  {t("pricing.currentPlan")}
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.planId)}
                  disabled={isLoading || isCurrentPlan}
                  className="w-full bg-brand hover:bg-brand/90 text-sm md:text-base"
                >
                  {isLoading
                    ? t("pricing.processing")
                    : isCurrentPlan
                      ? t("pricing.currentPlan")
                      : t("pricing.subscribe")}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
