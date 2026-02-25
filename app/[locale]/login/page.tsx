"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useLanguage } from "@/lib/language-context"
import { Mail, Lock, Download } from "lucide-react"
import { AuthContainer } from "@/components/auth/auth-container"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthSeparator } from "@/components/auth/auth-separator"

const AUTH_ERROR_CODES_USER_NOT_FOUND = [
  "UserNotFound",
  "AccessDenied",
  "OAuthCallback",
];

export default function LoginPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return;

    const errorParam = new URLSearchParams(window.location.search).get("error");
    if (!errorParam) {
      setError(null);
      return;
    }

    if (AUTH_ERROR_CODES_USER_NOT_FOUND.includes(errorParam)) {
      setError(t("login.userNotFound"));
    } else {
      setError(t("login.userNotFound"));
    }

    window.history.replaceState({}, "", window.location.pathname);
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        if (result.error.includes("USER_NOT_FOUND")) {
          setError(t("login.userNotFound"));
        } else {
          setError(t("login.credentialsError"));
        }
      } else if (result?.ok) {
        router.push(`/${language}/dashboard`);
      } else {
        setError(t("login.credentialsError"));
      }
    } catch {
      setIsLoading(false);
      setError(t("login.credentialsError"));
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: `/${language}/dashboard`,
      redirect: true,
    });
  }

  const handleDownloadApp = () => {
    const storeUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;
    if (storeUrl) {
      window.open(storeUrl, "_blank");
    }
  };

  return (
    <AuthContainer
      imageSrc="/login.png"
      imageAlt="Ciervo meditando en la naturaleza"
      title={t("login.title")}
      subtitle={t("login.subtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <AuthInput
            label={t("login.email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("contact.emailPlaceholder")}
            icon={<Mail className="w-5 h-5" />}
            required
          />
          <AuthInput
            label={t("login.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-500 text-center font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-start">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              className="rounded border-stone-300 text-stone-800 focus:ring-amber-200"
            />
            {t("login.rememberMe")}
          </label>
        </div>

        <div className="space-y-4">
          <AuthButton type="submit" isLoading={isLoading}>
            {isLoading ? t("login.signingIn") : t("login.signIn")}
          </AuthButton>

          <AuthSeparator text={t("login.continueWith")} />

          <AuthButton
            type="button"
            variant="google"
            onClick={handleGoogleLogin}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            }
          >
            {t("login.continueWithGoogle")}
          </AuthButton>
        </div>

        <div className="text-center text-sm text-stone-600 pt-4 border-t border-stone-200 mt-2">
          <p className="font-medium text-stone-800 mb-3">{t("login.noAccount")}</p>
          <AuthButton
            type="button"
            variant="outline"
            onClick={handleDownloadApp}
            icon={<Download className="w-5 h-5 mr-2" />}
          >
            {t("login.downloadToRegister")}
          </AuthButton>
        </div>
      </form>
    </AuthContainer>
  )
}
