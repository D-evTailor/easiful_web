"use client"

import { useLanguage } from "@/lib/language-context"

const PoliticaPrivacidadPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">{t("legal.privacyPolicy")}</h1>

      <div className="space-y-6">
        <p className="italic">
          {t("legal.lastUpdated")}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.dataController")}</h2>
          <p>
            {t("legal.dataControllerText")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.dataTypes")}</h2>
          <p>
            {t("legal.dataTypesText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>{t("legal.identifyingData")}</strong> {t("legal.identifyingDataText")}
            </li>
            <li>
              <strong>{t("legal.connectionData")}</strong> {t("legal.connectionDataText")}
            </li>
            <li>
              <strong>{t("legal.commercialData")}</strong> {t("legal.commercialDataText")}
            </li>
          </ul>
          <p className="mt-2">
            {t("legal.purposes")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>{t("legal.attendQueries")}</strong> {t("legal.attendQueriesText")}
            </li>
            <li>
              <strong>{t("legal.analysis")}</strong> {t("legal.analysisText")}
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.legalBasis")}</h2>
          <p>
            {t("legal.legalBasisText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>{t("legal.userAttention")}</strong> {t("legal.userAttentionText")}
            </li>
            <li>
              <strong>{t("legal.usabilityAnalysis")}</strong> {t("legal.usabilityAnalysisText")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.dataRetention")}</h2>
          <p>
            {t("legal.dataRetentionText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>{t("legal.userAttentionRetention")}</strong> {t("legal.userAttentionRetentionText")}
            </li>
            <li>
              <strong>{t("legal.usabilityRetention")}</strong> {t("legal.usabilityRetentionText")}
            </li>
          </ul>
          <p className="mt-2">
            {t("legal.independentRetention")}
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.dataSharing")}</h2>
          <p>
            {t("legal.dataSharingText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>{t("legal.techProviders")}</li>
            <li>{t("legal.legalAdvisors")}</li>
          </ul>
          <p className="mt-2">
            {t("legal.thirdPartyAccess")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.userRights")}</h2>
          <p>
            {t("legal.userRightsText")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li><strong>{t("legal.access")}</strong> {t("legal.accessText")}</li>
            <li><strong>{t("legal.rectification")}</strong> {t("legal.rectificationText")}</li>
            <li><strong>{t("legal.deletion")}</strong> {t("legal.deletionText")}</li>
            <li><strong>{t("legal.opposition")}</strong> {t("legal.oppositionText")}</li>
            <li><strong>{t("legal.portability")}</strong> {t("legal.portabilityText")}</li>
          </ul>
          <p className="mt-2">
            {t("legal.complaintInfo")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.policyChanges")}</h2>
          <p>
            {t("legal.policyChangesText")}
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliticaPrivacidadPage; 