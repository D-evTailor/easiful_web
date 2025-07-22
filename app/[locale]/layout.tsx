import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import Providers from "@/components/providers";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easiful - Organiza tu vida. Recupera tu tiempo.",
  description:
    "La app que te ayuda a organizar tu vida diaria con paz, claridad y motivación. Descarga Easiful y transforma tu rutina.",
  keywords: "organización, productividad, app móvil, gestión del hogar, planificación",
  authors: [{ name: "Easiful Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;
  // Validate locale
  const validLocale = locale === "es" || locale === "en" ? locale : "es";

  return (
    <html lang={validLocale}>
      <body className={quicksand.className}>
        <Providers>
          <LanguageProvider initialLanguage={validLocale}>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
            <CookieBanner />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
