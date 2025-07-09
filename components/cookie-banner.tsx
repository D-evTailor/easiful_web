"use client"

import { useState, useEffect, FC } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
};

const CookieBanner: FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    const consentStatus = localStorage.getItem("cookie_consent");
    if (!consentStatus) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = { necessary: true, analytics: true, preferences: true };
    localStorage.setItem("cookie_consent", JSON.stringify(newConsent));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newConsent = { necessary: true, analytics: false, preferences: false };
    localStorage.setItem("cookie_consent", JSON.stringify(newConsent));
    setShowBanner(false);
  };
  
  const handleSavePreferences = () => {
    localStorage.setItem("cookie_consent", JSON.stringify(consent));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* The Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-100/95 backdrop-blur-sm border-t border-stone-200 p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-stone-700">
            <p>
              Utilizamos cookies para mejorar tu experiencia. Al hacer clic en "Aceptar todas", aceptas nuestro uso de cookies. Consulta nuestra{" "}
              <Link href="/legal/cookies" className="font-semibold underline hover:text-stone-900">
                Política de Cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              Configurar
            </Button>
            <Button variant="outline" onClick={handleRejectAll}>
              Rechazar todas
            </Button>
            <Button onClick={handleAcceptAll}>Aceptar todas</Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Cookies</DialogTitle>
            <DialogDescription>
              Gestiona tus preferencias de cookies. Puedes habilitar o deshabilitar categorías específicas a continuación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="necessary-cookies" className="font-semibold">
                  Cookies Necesarias
                </Label>
                <p className="text-sm text-stone-500">
                  Estas cookies son esenciales para que el sitio web funcione y no se pueden desactivar.
                </p>
              </div>
              <Switch id="necessary-cookies" checked disabled />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="analytics-cookies" className="font-semibold">
                  Cookies de Análisis
                </Label>
                <p className="text-sm text-stone-500">
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio web.
                </p>
              </div>
              <Switch
                id="analytics-cookies"
                checked={consent.analytics}
                onCheckedChange={(checked) => setConsent(prev => ({ ...prev, analytics: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="preferences-cookies" className="font-semibold">
                  Cookies de Preferencias
                </Label>
                <p className="text-sm text-stone-500">
                  Permiten recordar información que cambia el aspecto o comportamiento de la web.
                </p>
              </div>
              <Switch
                id="preferences-cookies"
                checked={consent.preferences}
                onCheckedChange={(checked) => setConsent(prev => ({ ...prev, preferences: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleRejectAll}>Rechazar todas</Button>
            <Button onClick={handleSavePreferences}>Guardar Preferencias</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner; 