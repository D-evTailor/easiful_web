import { FC } from "react";

const AvisoLegalPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-stone-800">
      <h1 className="text-3xl font-bold mb-6">Aviso Legal</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. DATOS IDENTIFICATIVOS</h2>
          <p>
            En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), a continuación se reflejan los siguientes datos: el profesional titular de dominio web es <strong>[Tu Nombre Completo]</strong> (en adelante Easiful), con domicilio a estos efectos en <strong>[Dirección Física Completa - Dato Obligatorio por Ley]</strong> y número de N.I.F.: <strong>123456789</strong>. Correo electrónico de contacto: <strong>easiful@dev-tailor.com</strong> del sitio web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. USUARIOS</h2>
          <p>
            El acceso y/o uso de este portal de Easiful atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. USO DEL PORTAL</h2>
          <p>
            <strong>www.easiful.com</strong> (o el dominio que corresponda) proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a Easiful o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
          </p>
          <p className="mt-2">
            En dicho registro el USUARIO será responsable de aportar información veraz y lícita. Como consecuencia de este registro, al USUARIO se le puede proporcionar una contraseña de la que será responsable, comprometiéndose a hacer un uso diligente y confidencial de la misma. El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que Easiful ofrece a través de su portal y con carácter enunciativo pero no limitativo, a no emplearlos para:
          </p>
          <ul className="list-disc list-inside mt-2 pl-4">
            <li>incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público;</li>
            <li>difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos;</li>
            <li>provocar daños en los sistemas físicos y lógicos de Easiful, de sus proveedores o de terceras personas, introducir o difundir en la red virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar los daños anteriormente mencionados;</li>
            <li>intentar acceder y, en su caso, utilizar las cuentas de correo electrónico de otros usuarios y modificar o manipular sus mensajes.</li>
          </ul>
          <p className="mt-2">
            Easiful se reserva el derecho de retirar todos aquellos comentarios y aportaciones que vulneren el respeto a la dignidad de la persona, que sean discriminatorios, xenófobos, racistas, pornográficos, que atenten contra la juventud o la infancia, el orden o la seguridad pública o que, a su juicio, no resultaran adecuados para su publicación. En cualquier caso, Easiful no será responsable de las opiniones vertidas por los usuarios a través de los foros, chats, u otras herramientas de participación.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
          <p>
            Easiful por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.), titularidad de Easiful o bien de sus licenciantes.
          </p>
          <p className="mt-2">
            Todos los derechos reservados. En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de Easiful. El USUARIO se compromete a respetar los derechos de Propiedad Intelectual e Industrial titularidad de Easiful. Podrá visualizar los elementos del portal e incluso imprimirlos, copiarlos y almacenarlos en el disco duro de su ordenador o en cualquier otro soporte físico siempre y cuando sea, única y exclusivamente, para su uso personal y privado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD</h2>
          <p>
            Easiful no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. MODIFICACIONES</h2>
          <p>
            Easiful se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>
            La relación entre Easiful y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de <strong>Sevilla</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AvisoLegalPage; 