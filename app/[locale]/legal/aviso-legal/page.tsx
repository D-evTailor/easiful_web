"use client"

import { useLanguage } from "@/lib/language-context"

const AvisoLegalPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">{t("legal.legalNotice")}</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.legalNoticeTitle")}</h2>
          <p>
            {t("legal.legalNoticeText")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.users")}</h2>
          <p>
            {t("legal.usersText")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.portalUse")}</h2>
          <p>
            {t("legal.portalUseText")}
          </p>
          <p className="mt-2">
            {t("legal.portalUse2")}
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>{t("legal.illegalActivities")}</li>
            <li>{t("legal.illegalContent")}</li>
            <li>{t("legal.damageSystems")}</li>
            <li>{t("legal.unauthorizedAccess")}</li>
          </ul>
          <p className="mt-2">
            {t("legal.portalUse3")}
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.intellectualProperty")}</h2>
          <p>
            {t("legal.intellectualPropertyText")}
          </p>
          <p className="mt-2">
            {t("legal.intellectualProperty2")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.warrantyExclusion")}</h2>
          <p>
            {t("legal.warrantyExclusionText")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.modifications")}</h2>
          <p>
            {t("legal.modificationsText")}
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("legal.applicableLaw")}</h2>
          <p>
            {t("legal.applicableLawText")}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AvisoLegalPage; 