\"use client\";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { MailCheck, LockReset, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { auth } from "@/lib/firebase-config";
import { useLanguage } from "@/lib/language-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthActionMode = "verifyEmail" | "resetPassword" | "invalid";

type Status =
  | "idle"
  | "processing"
  | "needsPassword"
  | "success"
  | "error";

export default function AuthActionPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<AuthActionMode>("invalid");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [continueUrl, setContinueUrl] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const newPasswordInputRef = React.useRef<HTMLInputElement | null>(null);

  // Parse query params with URLSearchParams and trigger Firebase action
  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const modeParam = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");
    const rawContinueUrl = searchParams.get("continueUrl");

    // Sanitizar continueUrl: solo mismo origen (dominio propio)
    if (rawContinueUrl) {
      try {
        const resolvedUrl = new URL(rawContinueUrl, window.location.origin);
        if (resolvedUrl.origin === window.location.origin) {
          setContinueUrl(resolvedUrl.toString());
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[auth-action] Ignoring continueUrl from different origin");
          }
        }
      } catch {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[auth-action] Invalid continueUrl, ignoring value");
        }
      }
    }

    if (!modeParam || !oobCode) {
      setMode("invalid");
      setStatus("error");
      setErrorMessage(t("authAction.error.invalidAction"));
      return;
    }

    const normalizedMode =
      modeParam === "verifyEmail"
        ? "verifyEmail"
        : modeParam === "resetPassword"
        ? "resetPassword"
        : "invalid";

    setMode(normalizedMode);

    if (normalizedMode === "invalid") {
      setStatus("error");
      setErrorMessage(t("authAction.error.invalidAction"));
      return;
    }

    const handleVerifyEmail = async () => {
      try {
        setStatus("processing");
        setErrorMessage(null);

        await applyActionCode(auth, oobCode);

        setStatus("success");
      } catch (error: any) {
        console.error("[auth-action] verifyEmail error", error?.code ?? error);
        setStatus("error");

        if (error?.code === "auth/expired-action-code") {
          setErrorMessage(t("authAction.error.expiredCode"));
        } else if (error?.code === "auth/invalid-action-code") {
          setErrorMessage(t("authAction.error.invalidCode"));
        } else {
          setErrorMessage(t("authAction.error.generic"));
        }
      }
    };

    const handlePrepareResetPassword = async () => {
      try {
        setStatus("processing");
        setErrorMessage(null);

        const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
        setEmail(emailFromCode);
        setStatus("needsPassword");
      } catch (error: any) {
        console.error("[auth-action] resetPassword verify error", error?.code ?? error);
        setStatus("error");

        if (error?.code === "auth/expired-action-code") {
          setErrorMessage(t("authAction.error.expiredCode"));
        } else if (error?.code === "auth/invalid-action-code") {
          setErrorMessage(t("authAction.error.invalidCode"));
        } else {
          setErrorMessage(t("authAction.error.generic"));
        }
      }
    };

    if (normalizedMode === "verifyEmail") {
      void handleVerifyEmail();
    } else if (normalizedMode === "resetPassword") {
      void handlePrepareResetPassword();
    }
  }, [t]);

  // Foco automático en el campo de nueva contraseña cuando se muestra el formulario
  useEffect(() => {
    if (status === "needsPassword" && newPasswordInputRef.current) {
      newPasswordInputRef.current.focus();
    }
  }, [status]);

  const handleSubmitNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setStatus("error");
      setErrorMessage(t("authAction.error.invalidAction"));
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(t("authAction.resetPassword.passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("authAction.resetPassword.passwordsDontMatch"));
      return;
    }

    try {
      setIsSubmittingPassword(true);
      setErrorMessage(null);

      await confirmPasswordReset(auth, oobCode, newPassword);

      setStatus("success");
    } catch (error: any) {
      console.error("[auth-action] resetPassword confirm error", error?.code ?? error);
      setStatus("error");

      if (error?.code === "auth/expired-action-code") {
        setErrorMessage(t("authAction.error.expiredCode"));
      } else if (error?.code === "auth/invalid-action-code") {
        setErrorMessage(t("authAction.error.invalidCode"));
      } else if (error?.code === "auth/weak-password") {
        setErrorMessage(t("authAction.resetPassword.passwordTooWeak"));
      } else {
        setErrorMessage(t("authAction.error.generic"));
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const primaryDestination = continueUrl ?? `/${language}/login`;

  const handlePrimaryCta = () => {
    setIsContinuing(true);
    router.push(primaryDestination);
  };

  const handleOpenApp = () => {
    router.push(`/${language}`);
  };

  const renderIcon = () => {
    if (status === "processing" || status === "idle") {
      return <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />;
    }

    if (status === "success") {
      return <CheckCircle2 className="h-10 w-10 text-emerald-600" />;
    }

    if (mode === "resetPassword") {
      return <LockReset className="h-10 w-10 text-amber-600" />;
    }

    if (mode === "verifyEmail") {
      return <MailCheck className="h-10 w-10 text-emerald-600" />;
    }

    return <AlertCircle className="h-10 w-10 text-red-500" />;
  };

  const isLoading = status === "processing" || status === "idle";
  const showResetForm = status === "needsPassword" && mode === "resetPassword";
  const showSuccess = status === "success";
  const showError = status === "error" && !!errorMessage;

  const passwordErrorId = showError ? "auth-action-password-error" : undefined;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-stone-200 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            {renderIcon()}
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-stone-900">
              {mode === "verifyEmail"
                ? t("authAction.verifyEmail.title")
                : mode === "resetPassword"
                ? t("authAction.resetPassword.title")
                : t("authAction.error.title")}
            </CardTitle>
            <CardDescription className="mt-2 text-stone-600">
              {mode === "verifyEmail"
                ? t("authAction.verifyEmail.subtitle")
                : mode === "resetPassword"
                ? t("authAction.resetPassword.subtitle")
                : t("authAction.error.subtitle")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading && (
            <p className="text-center text-sm text-stone-600">
              {t("authAction.loading")}
            </p>
          )}

          {showResetForm && (
            <form
              onSubmit={handleSubmitNewPassword}
              className="space-y-4"
              aria-describedby={passwordErrorId}
            >
              {email && (
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-100">
                  {t("authAction.resetPassword.forEmail", { email })}
                </div>
              )}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-stone-800"
                  htmlFor="auth-action-new-password"
                >
                  {t("authAction.resetPassword.newPassword")}
                </label>
                <Input
                  id="auth-action-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("authAction.resetPassword.newPasswordPlaceholder")}
                  autoComplete="new-password"
                  required
                  ref={newPasswordInputRef}
                  aria-invalid={!!errorMessage}
                  aria-describedby={passwordErrorId}
                />
                <p className="text-xs text-stone-500">
                  {t("authAction.resetPassword.requirements")}
                </p>
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-stone-800"
                  htmlFor="auth-action-confirm-password"
                >
                  {t("authAction.resetPassword.confirmPassword")}
                </label>
                <Input
                  id="auth-action-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("authAction.resetPassword.confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  required
                  aria-invalid={!!errorMessage}
                  aria-describedby={passwordErrorId}
                />
              </div>

              {showError && (
                <div
                  id={passwordErrorId}
                  className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmittingPassword
                  ? t("authAction.resetPassword.submitting")
                  : t("authAction.resetPassword.submit")}
              </Button>
            </form>
          )}

          {showSuccess && (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {mode === "verifyEmail"
                  ? t("authAction.verifyEmail.success")
                  : t("authAction.resetPassword.success")}
              </div>
            </div>
          )}

          {status === "error" && errorMessage && !showResetForm && (
            <div
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p>{errorMessage}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full border-stone-300 text-stone-800 hover:bg-stone-100"
            onClick={handlePrimaryCta}
            disabled={isContinuing}
          >
            {isContinuing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {continueUrl
              ? t("authAction.cta.continue")
              : t("authAction.cta.goToLogin")}
          </Button>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleOpenApp}
          >
            {t("authAction.cta.openApp")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

