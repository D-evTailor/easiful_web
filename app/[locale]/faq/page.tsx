"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/lib/language-context";

const FAQPage = () => {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t("faq.whatIsEasiful"),
      answer: t("faq.whatIsEasifulAnswer")
    },
    {
      question: t("faq.isFree"),
      answer: t("faq.isFreeAnswer")
    },
    {
      question: t("faq.platforms"),
      answer: t("faq.platformsAnswer")
    },
    {
      question: t("faq.dataProtection"),
      answer: t("faq.dataProtectionAnswer")
    },
    {
      question: t("faq.support"),
      answer: t("faq.supportAnswer")
    },
    {
      question: t("faq.multipleDevices"),
      answer: t("faq.multipleDevicesAnswer")
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-stone-800">{t("faq.title")}</h1>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-stone-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQPage; 