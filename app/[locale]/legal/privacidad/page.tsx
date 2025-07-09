import { FC } from "react";

const PoliticaPrivacidadPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

      <div className="space-y-6">
        <p className="italic">
          Última actualización: 08/07/2025
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos recabados a través del sitio web <strong>www.easiful.com</strong> (en adelante, la "Web" o el "Sitio Web") es <strong>[Tu Nombre Completo]</strong> (en adelante, "Easiful"), con N.I.F. <strong>123456789</strong>, domicilio en <strong>[Dirección Física Completa - Dato Obligatorio por Ley]</strong> y correo electrónico de contacto <strong>easiful@dev-tailor.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. ¿Qué datos personales tratamos y con qué finalidad?</h2>
          <p>
            En función de los productos, servicios o funcionalidades de los que quieras disfrutar en cada momento necesitaremos tratar unos datos u otros. Con carácter general, dichos datos serán, según el caso, los siguientes:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>Datos identificativos:</strong> nombre, apellidos, datos de contacto.
            </li>
            <li>
              <strong>Información de conexión, geolocalización y navegación (en caso de que interactúes con nosotros desde el móvil, por ejemplo):</strong> Si utilizas nuestro sitio web, podemos recoger datos sobre tu dirección IP, qué navegador utilizas y cómo lo usas, con el fin de mejorar tu experiencia como usuario.
            </li>
            <li>
              <strong>Datos de carácter comercial:</strong> si estás suscrito a nuestra newsletter.
            </li>
          </ul>
          <p className="mt-2">
            Trataremos estos datos para las siguientes finalidades:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>Atender tus consultas:</strong> Si te pones en contacto con nosotros a través de los formularios de contacto, trataremos tus datos para gestionar tu solicitud.
            </li>
            <li>
              <strong>Análisis de usabilidad y de calidad:</strong> para mejorar la experiencia del usuario y ofrecer un servicio de mayor calidad (ver Política de Cookies).
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Legitimación para el tratamiento de tus datos</h2>
          <p>
            La base legal que nos permite tratar tus datos personales depende de la finalidad para la que los tratemos:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>Atención al Usuario:</strong> La base legítima es tu consentimiento expreso al contactarnos.
            </li>
            <li>
              <strong>Análisis de usabilidad:</strong> Nuestro interés legítimo para analizar la usabilidad del Sitio Web y mejorar la calidad de la experiencia del usuario.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. ¿Durante cuánto tiempo conservaremos tus datos?</h2>
          <p>
            El plazo de conservación de tus datos dependerá de las finalidades para las que los tratemos:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>
              <strong>Atención al Usuario:</strong> Trataremos tus datos durante el tiempo que sea necesario para atender tu solicitud o petición.
            </li>
            <li>
              <strong>Análisis de usabilidad:</strong> Trataremos tus datos puntualmente durante el tiempo en el que procedamos a realizar la acción o la encuesta de calidad o hasta que anonimicemos tus datos de navegación.
            </li>
          </ul>
          <p className="mt-2">
            Independientemente de que tratemos tus datos durante el tiempo estrictamente necesario para cumplir con la finalidad correspondiente, los conservaremos posteriormente debidamente guardados y protegidos durante el tiempo en que pudieran surgir responsabilidades derivadas del tratamiento, en cumplimiento con la normativa vigente en cada momento.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. ¿Compartiremos tus datos con terceros?</h2>
          <p>
            Para cumplir las finalidades indicadas en la presente Política de Privacidad, es necesario que demos acceso a tus datos personales a terceras partes que nos prestan apoyo en los servicios que te ofrecemos, a saber:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>Proveedores de servicios tecnológicos y analíticos.</li>
            <li>Asesores legales y otros profesionales.</li>
          </ul>
          <p className="mt-2">
            Dichos terceros solo tendrán acceso a los datos personales que sean estrictamente necesarios para prestar el servicio, exigiéndoles que mantengan la confidencialidad sobre los mismos y no los utilicen para ninguna otra finalidad.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. ¿Cuáles son tus derechos?</h2>
          <p>
            Nos comprometemos a respetar la confidencialidad de tus datos personales y a garantizarte el ejercicio de tus derechos. Podrás ejercitarlos sin coste alguno escribiéndonos un correo electrónico a nuestra dirección <strong>easiful@dev-tailor.com</strong>, simplemente indicándonos el motivo de tu solicitud y el derecho que quieres ejercitar. Los derechos que puedes ejercer son:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li><strong>Acceso:</strong> solicitar acceso a los datos que disponemos de ti.</li>
            <li><strong>Rectificación:</strong> solicitar que rectifiquemos los datos que ya disponemos.</li>
            <li><strong>Supresión:</strong> solicitar que suprimamos tus datos en la medida en que ya no sean necesarios para la finalidad para la que necesitemos tratarlos.</li>
            <li><strong>Oposición:</strong> solicitar que limitemos el tratamiento de tus datos.</li>
            <li><strong>Portabilidad:</strong> solicitar que te entreguemos tus datos en un formato interoperable.</li>
          </ul>
          <p className="mt-2">
            Finalmente, te informamos de tu derecho a presentar una reclamación ante la autoridad de control en materia de protección de datos pertinente, en particular, ante la Agencia Española de Protección de Datos (https://www.aepd.es/).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Cambios en la política de privacidad</h2>
          <p>
            Es posible que modifiquemos la información contenida en esta Política de Privacidad cuando lo estimemos conveniente. En caso de que lo hagamos, te lo notificaremos por distintas vías a través de la Web (por ejemplo, a través de un banner, un pop-up o una notificación push), o incluso te lo comunicaremos a tu dirección de correo electrónico cuando el cambio en cuestión sea significativo para con tu privacidad, de manera que puedas revisar los cambios, valorarlos y, en su caso, oponerte o darte de baja de algún servicio o funcionalidad.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliticaPrivacidadPage; 