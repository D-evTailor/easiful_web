"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
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

const CookieBanner = () => {
  const { t } = useLanguage();
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
              {t("cookies.message")}{" "}
              <Link href="/legal/cookies" className="font-semibold underline hover:text-stone-900">
                {t("cookies.policy")}
              </Link>
              .
            </p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              {t("cookies.configure")}
            </Button>
            <Button variant="outline" onClick={handleRejectAll}>
              {t("cookies.rejectAll")}
            </Button>
            <Button onClick={handleAcceptAll}>{t("cookies.acceptAll")}</Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cookies.settings.title")}</DialogTitle>
            <DialogDescription>
              {t("cookies.settings.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="necessary-cookies" className="font-semibold">
                  {t("cookies.necessary.title")}
                </Label>
                <p className="text-sm text-stone-500">
                  {t("cookies.necessary.description")}
                </p>
              </div>
              <Switch id="necessary-cookies" checked disabled />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="analytics-cookies" className="font-semibold">
                  {t("cookies.analytics.title")}
                </Label>
                <p className="text-sm text-stone-500">
                  {t("cookies.analytics.description")}
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
                  {t("cookies.preferences.title")}
                </Label>
                <p className="text-sm text-stone-500">
                  {t("cookies.preferences.description")}
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
            <Button variant="outline" onClick={handleRejectAll}>{t("cookies.rejectAll")}</Button>
            <Button onClick={handleSavePreferences}>{t("cookies.savePreferences")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner; 