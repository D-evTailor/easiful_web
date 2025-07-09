import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Pricing from "@/components/pricing/pricing"

export default async function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center">
        <header className="relative w-full text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-brand">
            Elige tu Plan
          </h1>
          <p className="text-stone-600 mt-3 text-lg">
            ¡Bienvenido, {session?.user?.name || "Usuario"}! Es hora de llevar tu productividad al siguiente nivel.
          </p>
          <div className="absolute top-0 left-0">
            <Button asChild variant="ghost" size="icon" className="transition-transform hover:scale-110">
              <Link href={`/${locale}/dashboard`}>
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mt-16 w-full">
          <Pricing />
        </div>

      </div>
    </div>
  )
} 