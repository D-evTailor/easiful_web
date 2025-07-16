"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useLanguage } from "@/lib/language-context"
import { Mail, Lock } from "lucide-react"
import { AuthContainer } from "@/components/auth/auth-container"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthSeparator } from "@/components/auth/auth-separator"

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setIsLoading(false)

    if (result?.error) {
      setError("Las credenciales son incorrectas. Por favor, inténtalo de nuevo.");
    } else if (result?.ok) {
      router.push(`/${language}/dashboard`); // Redirigir al dashboard tras un login exitoso
    }
  }

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: `/${language}/dashboard` });
  }

  return (
    <AuthContainer
      imageSrc="/login.png"
      imageAlt="Ciervo meditando en la naturaleza"
      title="¡Bienvenido de vuelta!"
      subtitle="Accede a tu cuenta para continuar organizando tu vida"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <AuthInput
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="tu@email.com"
            icon={<Mail className="w-5 h-5" />}
            required
          />
          
          <AuthInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input 
              type="checkbox" 
              className="rounded border-stone-300 text-stone-800 focus:ring-amber-200"
            />
            Recordarme
          </label>
          
          <Link 
            href="/forgot-password" 
            className="text-sm text-stone-600 hover:text-stone-800 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="space-y-4">
          <AuthButton type="submit" isLoading={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </AuthButton>

          <AuthSeparator text="o continúa con" />

          <AuthButton 
            type="button" 
            variant="google" 
            onClick={handleGoogleLogin}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Continuar con Google
          </AuthButton>
        </div>

        <div className="text-center text-sm text-stone-600">
          ¿No tienes cuenta?{" "}
          <Link 
            href={`/${language}/register`} 
            className="font-medium text-stone-800 hover:text-emerald-600 transition-colors"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </AuthContainer>
  )
} 