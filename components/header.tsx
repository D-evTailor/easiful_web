"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useLanguage } from "@/lib/language-context"
import { Globe, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

export default function Header() {
  const { data: session, status } = useSession()
  const { language, t } = useLanguage()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLanguageChange = (newLang: string) => {
    const currentPath = pathname
    const newPath = currentPath.replace(/^\/(es|en)/, `/${newLang}`)
    window.location.href = newPath
  }

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/sobre-nosotros", label: t("nav.about") },
    { href: "/contacto", label: t("nav.contact") },
  ]

  const getLocalePath = (path: string) => {
    if (path === "/") return `/${language}`;
    return `/${language}${path}`;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href={getLocalePath("/")} className="text-2xl font-bold text-stone-800 hover:text-emerald-600 transition-colors">
            Easiful
          </Link>

          {/* Combined Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={getLocalePath(item.href)}
                  className="text-stone-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Auth Button or Profile Icon on Desktop */}
            {status === "unauthenticated" && (
              <Button asChild size="sm">
                <Link href={getLocalePath("/login")}>{t("nav.login")}</Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent border-stone-300">
                  <Globe className="w-4 h-4" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLanguageChange("es")}>{t("language.spanish")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>{t("language.english")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Icon on Desktop (Authenticated) */}
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="w-9 h-9 border-2 border-stone-200 group-hover:border-emerald-500 transition-colors">
                      <AvatarImage src={session.user?.image || undefined} alt="User avatar" />
                      <AvatarFallback>
                        <User className="w-5 h-5 text-stone-600" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href={getLocalePath("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: getLocalePath('/') })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-stone-200">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={getLocalePath(item.href)}
                  className="text-stone-700 hover:text-emerald-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                {status === "unauthenticated" ? (
                  <Button asChild className="w-full">
                    <Link href={getLocalePath("/login")} onClick={() => setIsMobileMenuOpen(false)}>{t("nav.login")}</Link>
                  </Button>
                ) : (
                   <Button asChild className="w-full" variant="secondary">
                    <Link href={getLocalePath("/dashboard")} onClick={() => setIsMobileMenuOpen(false)}>{t("nav.goToDashboard")}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
