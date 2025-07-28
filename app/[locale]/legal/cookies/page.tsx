"use client"

import { useLanguage } from "@/lib/language-context"

const PoliticaCookiesPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">{t("legal.cookiePolicy")}</h1>

      <div className="space-y-6">
        <p className="italic">
          {t("legal.lastUpdated")}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.cookiesWhat")}</h2>
          <p>
            {t("legal.cookiesWhatText")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.cookiesTypes")}</h2>
          <p>
            {t("legal.cookiesTypesText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
            <li>
              <strong>{t("legal.cookiesTechnical")}</strong> {t("legal.cookiesTechnicalText")}
            </li>
            <li>
              <strong>{t("legal.cookiesAnalytics")}</strong> {t("legal.cookiesAnalyticsText")}
            </li>
            <li>
              <strong>{t("legal.cookiesPreferences")}</strong> {t("legal.cookiesPreferencesText")}
            </li>
            <li>
                <strong>{t("legal.cookiesThirdParty")}</strong> {t("legal.cookiesThirdPartyText")}
            </li>
          </ul>
          <p className="mt-4">
            {t("legal.cookiesTable")}
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white border border-stone-200">
              <thead className="bg-stone-100">
                <tr>
                  <th className="py-2 px-4 border-b">{t("legal.cookiesTableName")}</th>
                  <th className="py-2 px-4 border-b">{t("legal.cookiesTableProvider")}</th>
                  <th className="py-2 px-4 border-b">{t("legal.cookiesTablePurpose")}</th>
                  <th className="py-2 px-4 border-b">{t("legal.cookiesTableDuration")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">cookie_consent</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableOwn")}</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableConsent")}</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableDuration1")}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">_ga, _gid, _gat</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableGoogle")}</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableAnalysis")}</td>
                  <td className="py-2 px-4 border-b">{t("legal.cookiesTableDuration2")}</td>
                </tr>
                 {/* Añadir más filas si se utilizan más cookies */}
              </tbody>
            </table>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.cookiesManagement")}</h2>
          <p>
            {t("legal.cookiesManagementText")}
          </p>
          <p className="mt-2">
            {t("legal.cookiesBrowsers")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internet Explorer / Edge</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.cookiesChanges")}</h2>
          <p>
            {t("legal.cookiesChangesText")}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliticaCookiesPage; 