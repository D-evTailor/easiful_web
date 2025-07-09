import { FC } from "react";

const PoliticaCookiesPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>

      <div className="space-y-6">
        <p className="italic">
          Última actualización: 08/07/2025
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. ¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño fichero de texto que un sitio web guarda en tu ordenador o dispositivo móvil cuando visitas el sitio. Permiten que la página web recuerde tus acciones y preferencias (como inicio de sesión, idioma, tamaño de letra y otras preferencias de visualización) durante un período de tiempo, para que no tengas que volver a configurarlas cada vez que vuelvas al sitio o navegues de una página a otra.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. ¿Qué tipos de cookies utilizamos?</h2>
          <p>
            En nuestro sitio web, utilizamos los siguientes tipos de cookies:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4 space-y-2">
            <li>
              <strong>Cookies técnicas o necesarias:</strong> Son aquellas imprescindibles para el funcionamiento del sitio web. Sin ellas, la página no funcionaría correctamente. Incluyen, por ejemplo, cookies que gestionan el consentimiento del usuario.
            </li>
            <li>
              <strong>Cookies de análisis o rendimiento:</strong> Nos permiten reconocer y contar el número de visitantes, así como ver cómo los visitantes se mueven por nuestro sitio web cuando lo están usando. Esto nos ayuda a mejorar la forma en que funciona nuestro sitio web, por ejemplo, asegurando que los usuarios encuentren lo que buscan fácilmente. Utilizamos servicios como Google Analytics para este fin.
            </li>
            <li>
              <strong>Cookies de preferencias o personalización:</strong> Se utilizan para reconocerte cuando regresas a nuestro sitio web. Esto nos permite personalizar nuestro contenido para ti, saludarte por tu nombre y recordar tus preferencias (por ejemplo, tu elección de idioma o región).
            </li>
            <li>
                <strong>Cookies de terceros en enlaces externos:</strong> Este sitio web contiene enlaces a las tiendas de aplicaciones (App Store y Google Play). Al hacer clic en estos enlaces, serás redirigido a sus respectivos sitios, los cuales pueden instalar sus propias cookies. No tenemos control sobre las cookies instaladas por terceros. Por favor, consulta las políticas de cookies de dichas plataformas para más información.
            </li>
          </ul>
          <p className="mt-4">
            A continuación, se presenta una tabla con las cookies utilizadas en este sitio web:
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white border border-stone-200">
              <thead className="bg-stone-100">
                <tr>
                  <th className="py-2 px-4 border-b">Nombre de la Cookie</th>
                  <th className="py-2 px-4 border-b">Proveedor</th>
                  <th className="py-2 px-4 border-b">Finalidad</th>
                  <th className="py-2 px-4 border-b">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">cookie_consent</td>
                  <td className="py-2 px-4 border-b">Propia</td>
                  <td className="py-2 px-4 border-b">Almacena el estado de consentimiento de cookies del usuario.</td>
                  <td className="py-2 px-4 border-b">1 año</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">_ga, _gid, _gat</td>
                  <td className="py-2 px-4 border-b">Google Analytics</td>
                  <td className="py-2 px-4 border-b">Análisis del comportamiento del usuario y medición de la actividad del sitio web.</td>
                  <td className="py-2 px-4 border-b">Variable (hasta 2 años)</td>
                </tr>
                 {/* Añadir más filas si se utilizan más cookies */}
              </tbody>
            </table>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. ¿Cómo puedes gestionar las cookies?</h2>
          <p>
            Puedes controlar y/o eliminar las cookies siempre que lo desees. Para más información, consulta <a href="https://aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aboutcookies.org</a>. Puedes eliminar todas las cookies que ya se encuentran en tu ordenador y puedes configurar la mayoría de los navegadores para que dejen de aceptarlas. Pero si lo haces, es posible que tengas que ajustar manualmente algunas preferencias cada vez que visites un sitio y que dejen de funcionar determinados servicios.
          </p>
          <p className="mt-2">
            A continuación, te proporcionamos enlaces a las guías de los principales navegadores para que puedas configurar tus preferencias:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internet Explorer / Edge</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Cambios en la Política de Cookies</h2>
          <p>
            Podemos actualizar la Política de Cookies de nuestro Sitio Web, por ello le recomendamos revisar esta política cada vez que acceda a nuestro Sitio Web con el objetivo de estar adecuadamente informado sobre cómo y para qué usamos las cookies.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliticaCookiesPage; 