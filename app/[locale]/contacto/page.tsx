"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageCircle, User, Send } from "lucide-react"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("contact.nameRequired")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.emailInvalid")
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.messageRequired")
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contact.messageTooShort")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // TODO(TICKET-CONTACT-API): Replace simulated call with real contact form API
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", message: "" })
      setErrors({})
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen py-8 md:py-16 lg:py-24 relative overflow-hidden">
      {/* Organic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-100/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative">
        <div className="text-center mb-8 md:mb-16 animate-fade-in">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4 md:mb-6">{t("contact.title")}</h1>
          <p className="text-base md:text-xl text-stone-600 leading-relaxed">{t("contact.subtitle")}</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-stone-200/50 rounded-3xl shadow-2xl animate-slide-up">
          <CardHeader className="text-center pb-4 md:pb-6 p-4 md:p-6">
            <CardTitle className="text-lg md:text-2xl text-stone-800 flex items-center justify-center gap-2 md:gap-3">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              {t("contact.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-emerald-600 mb-4">{t("contact.success")}</h3>
                <p className="text-stone-600">{t("contact.thanks")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-stone-700 font-medium mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("contact.name")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 transition-colors ${
                      errors.name ? "border-red-300 focus:border-red-500" : "border-stone-300 focus:border-emerald-500"
                    } focus:ring-emerald-500/20 py-3`}
                    placeholder={t("contact.namePlaceholder")}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-stone-700 font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t("contact.email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 transition-colors ${
                      errors.email ? "border-red-300 focus:border-red-500" : "border-stone-300 focus:border-emerald-500"
                    } focus:ring-emerald-500/20 py-3`}
                    placeholder={t("contact.emailPlaceholder")}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-stone-700 font-medium mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t("contact.message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 transition-colors ${
                      errors.message
                        ? "border-red-300 focus:border-red-500"
                        : "border-stone-300 focus:border-emerald-500"
                    } focus:ring-emerald-500/20 resize-none`}
                    placeholder={t("contact.messagePlaceholder")}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-2">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t("contact.sending")}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      {t("contact.send")}
                    </div>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
