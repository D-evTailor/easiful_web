import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FC } from "react";

const faqItems = [
  {
    question: "¿Qué es Easiful?",
    answer: "Easiful es una aplicación móvil diseñada para simplificar, organizar y motivar a la hora de realizar tareas del hogar y planificar viajes."
  },
  {
    question: "¿La aplicación es gratuita?",
    answer: "Sí, puedes descargar y usar Easiful de forma gratuita con anuncios. También ofrecemos una suscripción premium sin anuncios y con funciones extra por 3.5€ al mes o un pago único de 12€ al año."
  },
  {
    question: "¿En qué plataformas está disponible?",
    answer: "Actualmente, Easiful está disponible para dispositivos iOS en la App Store y para dispositivos Android en la Google Play Store."
  },
  {
    question: "¿Cómo puedo proteger mis datos?",
    answer: "Tu privacidad es nuestra prioridad. Todos tus datos se almacenan de forma segura y cifrada. Puedes consultar nuestra Política de Privacidad para obtener más detalles sobre cómo protegemos tu información."
  },
  {
    question: "¿Cómo puedo contactar con el soporte técnico?",
    answer: "Si tienes algún problema o sugerencia, puedes contactarnos a través del formulario de contacto de nuestra web o enviando un correo electrónico a easiful@dev-tailor.com."
  },
  {
    question: "¿Puedo usar la aplicación en varios dispositivos?",
    answer: "Sí, tu cuenta de Easiful se sincroniza en la nube, por lo que puedes acceder a tu información desde cualquier dispositivo compatible donde hayas iniciado sesión."
  }
];

const FAQPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-stone-800">Preguntas Frecuentes (FAQ)</h1>
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