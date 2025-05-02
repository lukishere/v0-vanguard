"use client"

import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: April 7, 2025",
      sections: [
        {
          title: "Introduction",
          content:
            "At VANGUARD, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.",
        },
        {
          title: "Information We Collect",
          content:
            "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Technical Data, Usage Data, and Marketing and Communications Data.",
          subsections: [
            {
              subtitle: "Identity Data",
              content: "Includes first name, last name, username or similar identifier, and title.",
            },
            {
              subtitle: "Contact Data",
              content: "Includes billing address, delivery address, email address, and telephone numbers.",
            },
            {
              subtitle: "Technical Data",
              content:
                "Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.",
            },
            {
              subtitle: "Usage Data",
              content:
                "Includes information about how you use our website, products, and services, including the full Uniform Resource Locators (URLs), clickstream to, through and from our site, pages you viewed or searched for, page response times, download errors, length of visits to certain pages, page interaction information, and methods used to browse away from the page.",
            },
            {
              subtitle: "Marketing and Communications Data",
              content:
                "Includes your preferences in receiving marketing from us and our third parties and your communication preferences.",
            },
          ],
        },
        {
          title: "How We Use Your Information",
          content:
            "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you. Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests. Where we need to comply with a legal obligation.",
          subsections: [
            {
              subtitle: "Legitimate Interests",
              content:
                "We may process your data for our legitimate interests, provided your fundamental rights do not override these interests. Our legitimate interests include providing you with the best service/products, improving our offerings, and ensuring our website operates efficiently and securely.",
            },
            {
              subtitle: "Marketing",
              content:
                "We may use your data to form a view on what we think you may want or need, or what may be of interest to you. You will receive marketing communications from us if you have requested information from us or purchased services from us and you have not opted out of receiving that marketing.",
            },
          ],
        },
        {
          title: "Data Security",
          content:
            "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.",
        },
        {
          title: "Your Legal Rights",
          content:
            "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.",
          subsections: [
            {
              subtitle: "Right to Access",
              content:
                "You have the right to request copies of your personal data. We may charge a reasonable fee for additional copies or unfounded requests.",
            },
            {
              subtitle: "Right to Rectification",
              content:
                "You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.",
            },
            {
              subtitle: "Right to Erasure",
              content:
                "You have the right to request that we erase your personal data, under certain conditions. This is sometimes referred to as 'the right to be forgotten'.",
            },
            {
              subtitle: "Right to Restrict Processing",
              content:
                "You have the right to request that we restrict the processing of your personal data, under certain conditions.",
            },
            {
              subtitle: "Right to Object to Processing",
              content:
                "You have the right to object to our processing of your personal data, under certain conditions, particularly if the legal basis for processing is our legitimate interest.",
            },
            {
              subtitle: "Right to Data Portability",
              content:
                "You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.",
            },
          ],
        },
        {
          title: "Cookies",
          content:
            "Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive.",
          subsections: [
            {
              subtitle: "Types of Cookies We Use",
              content:
                "Strictly Necessary Cookies: Required for the operation of our website. Analytical/Performance Cookies: Allow us to recognize and count the number of visitors and see how visitors move around our website. Functionality Cookies: Used to recognize you when you return to our website. Targeting Cookies: Record your visit to our website, the pages you have visited and the links you have followed.",
            },
            {
              subtitle: "Managing Cookies",
              content:
                "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.",
            },
          ],
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this privacy policy or our privacy practices, please contact us at negocios@vanguard.es.",
        },
      ],
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última Actualización: 7 de abril de 2025",
      sections: [
        {
          title: "Introducción",
          content:
            "En VANGUARD, respetamos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad y cómo la ley lo protege.",
        },
        {
          title: "Información que Recopilamos",
          content:
            "Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted que hemos agrupado de la siguiente manera: Datos de identidad, Datos de contacto, Datos técnicos, Datos de uso y Datos de marketing y comunicaciones.",
          subsections: [
            {
              subtitle: "Datos de Identidad",
              content: "Incluye nombre, apellido, nombre de usuario o identificador similar y título.",
            },
            {
              subtitle: "Datos de Contacto",
              content:
                "Incluye dirección de facturación, dirección de entrega, dirección de correo electrónico y números de teléfono.",
            },
            {
              subtitle: "Datos Técnicos",
              content:
                "Incluye dirección de protocolo de Internet (IP), sus datos de inicio de sesión, tipo y versión del navegador, configuración y ubicación de la zona horaria, tipos y versiones de complementos del navegador, sistema operativo y plataforma, y otra tecnología en los dispositivos que utiliza para acceder a este sitio web.",
            },
            {
              subtitle: "Datos de Uso",
              content:
                "Incluye información sobre cómo utiliza nuestro sitio web, productos y servicios, incluidas las URL completas, el flujo de clics hacia, a través y desde nuestro sitio, las páginas que vio o buscó, los tiempos de respuesta de la página, los errores de descarga, la duración de las visitas a determinadas páginas, la información de interacción de la página y los métodos utilizados para navegar fuera de la página.",
            },
            {
              subtitle: "Datos de Marketing y Comunicaciones",
              content:
                "Incluye sus preferencias para recibir marketing de nosotros y de terceros, y sus preferencias de comunicación.",
            },
          ],
        },
        {
          title: "Cómo Usamos su Información",
          content:
            "Solo usaremos sus datos personales cuando la ley nos lo permita. Más comúnmente, usaremos sus datos personales en las siguientes circunstancias: Cuando necesitemos ejecutar el contrato que estamos a punto de celebrar o hemos celebrado con usted. Cuando sea necesario para nuestros intereses legítimos (o los de un tercero) y sus intereses y derechos fundamentales no anulen esos intereses. Cuando necesitemos cumplir con una obligación legal.",
          subsections: [
            {
              subtitle: "Intereses Legítimos",
              content:
                "Podemos procesar sus datos para nuestros intereses legítimos, siempre que sus derechos fundamentales no anulen estos intereses. Nuestros intereses legítimos incluyen proporcionarle el mejor servicio/productos, mejorar nuestras ofertas y garantizar que nuestro sitio web funcione de manera eficiente y segura.",
            },
            {
              subtitle: "Marketing",
              content:
                "Podemos usar sus datos para formarnos una opinión sobre lo que creemos que puede querer o necesitar, o lo que puede interesarle. Recibirá comunicaciones de marketing de nuestra parte si ha solicitado información de nosotros o ha comprado servicios de nosotros y no ha optado por no recibir ese marketing.",
            },
          ],
        },
        {
          title: "Seguridad de Datos",
          content:
            "Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, usen o accedan de manera no autorizada, se alteren o divulguen accidentalmente. Además, limitamos el acceso a sus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tienen una necesidad comercial de conocerlos.",
        },
        {
          title: "Sus Derechos Legales",
          content:
            "Bajo ciertas circunstancias, usted tiene derechos bajo las leyes de protección de datos en relación con sus datos personales, incluido el derecho a solicitar acceso, corrección, eliminación, restricción, transferencia, a oponerse al procesamiento, a la portabilidad de datos y (donde el motivo legal del procesamiento es el consentimiento) a retirar el consentimiento.",
          subsections: [
            {
              subtitle: "Derecho de Acceso",
              content:
                "Tiene derecho a solicitar copias de sus datos personales. Podemos cobrar una tarifa razonable por copias adicionales o solicitudes infundadas.",
            },
            {
              subtitle: "Derecho de Rectificación",
              content:
                "Tiene derecho a solicitar que corrijamos cualquier información que crea que es inexacta o que completemos la información que crea que está incompleta.",
            },
            {
              subtitle: "Derecho de Supresión",
              content:
                "Tiene derecho a solicitar que eliminemos sus datos personales, bajo ciertas condiciones. Esto a veces se denomina 'el derecho al olvido'.",
            },
            {
              subtitle: "Derecho a Restringir el Procesamiento",
              content:
                "Tiene derecho a solicitar que restrinjamos el procesamiento de sus datos personales, bajo ciertas condiciones.",
            },
            {
              subtitle: "Derecho a Oponerse al Procesamiento",
              content:
                "Tiene derecho a oponerse a nuestro procesamiento de sus datos personales, bajo ciertas condiciones, particularmente si la base legal para el procesamiento es nuestro interés legítimo.",
            },
            {
              subtitle: "Derecho a la Portabilidad de Datos",
              content:
                "Tiene derecho a solicitar que transfiramos los datos que hemos recopilado a otra organización, o directamente a usted, bajo ciertas condiciones.",
            },
          ],
        },
        {
          title: "Cookies",
          content:
            "Nuestro sitio web utiliza cookies para distinguirlo de otros usuarios de nuestro sitio web. Esto nos ayuda a brindarle una buena experiencia cuando navega por nuestro sitio web y también nos permite mejorar nuestro sitio. Una cookie es un pequeño archivo de letras y números que almacenamos en su navegador o en el disco duro de su computadora si está de acuerdo. Las cookies contienen información que se transfiere al disco duro de su computadora.",
          subsections: [
            {
              subtitle: "Tipos de Cookies que Utilizamos",
              content:
                "Cookies Estrictamente Necesarias: Requeridas para el funcionamiento de nuestro sitio web. Cookies Analíticas/de Rendimiento: Nos permiten reconocer y contar el número de visitantes y ver cómo los visitantes se mueven por nuestro sitio web. Cookies de Funcionalidad: Se utilizan para reconocerlo cuando regresa a nuestro sitio web. Cookies de Orientación: Registran su visita a nuestro sitio web, las páginas que ha visitado y los enlaces que ha seguido.",
            },
            {
              subtitle: "Gestión de Cookies",
              content:
                "Puede configurar su navegador para rechazar todas o algunas cookies del navegador, o para alertarlo cuando los sitios web establecen o acceden a cookies. Si deshabilita o rechaza las cookies, tenga en cuenta que algunas partes de este sitio web pueden volverse inaccesibles o no funcionar correctamente.",
            },
          ],
        },
        {
          title: "Contáctenos",
          content:
            "Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, contáctenos en negocios@vanguard.es.",
        },
      ],
    },
  }

  const currentContent = language === "en" ? content.en : content.es

  return (
    <div className="py-12">
      <div className="vanguard-container">
        <h1 className="text-3xl font-bold text-vanguard-blue mb-2">{currentContent.title}</h1>
        <p className="text-gray-500 mb-8">{currentContent.lastUpdated}</p>

        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-vanguard-blue mb-3">{section.title}</h2>
              <p className="text-gray-600 mb-4">{section.content}</p>

              {section.subsections && (
                <div className="pl-4 mt-4 space-y-4 border-l-2 border-gray-100">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-medium text-vanguard-blue mb-2">{subsection.subtitle}</h3>
                      <p className="text-gray-600">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
