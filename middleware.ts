import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'es']
const defaultLocale = 'es'

export default function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const searchParams = request.nextUrl.searchParams
  const lang = searchParams.get('lang')
  const locale = locales.includes(lang ?? '') ? (lang as typeof locales[number]) : defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/auth-action', '/auth-action/:path*', '/(es|en)/:path*']
} 