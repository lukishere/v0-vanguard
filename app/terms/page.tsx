"use client"

import { useLanguage } from "@/contexts/language-context"

export default function TermsPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: April 7, 2025",
      sections: [
        {
          title: "Introduction",
          content:
            "These terms and conditions outline the rules and regulations for the use of VANGUARD-IA's Website. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use VANGUARD-IA's website if you do not accept all of the terms and conditions stated on this page.",
        },
        {
          title: "Intellectual Property Rights",
          content:
            "Other than the content you own, under these Terms, VANGUARD-IA and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.",
        },
        {
          title: "Restrictions",
          content:
            "You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material; using this Website in any way that is or may be damaging to this Website; using this Website in any way that impacts user access to this Website; using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity; engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website.",
        },
        {
          title: "Your Content",
          content:
            "In these Terms and Conditions, 'Your Content' shall mean any audio, video, text, images or other material you choose to display on this Website. By displaying Your Content, you grant VANGUARD-IA a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.",
        },
        {
          title: "No Warranties",
          content:
            "This Website is provided 'as is,' with all faults, and VANGUARD-IA makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website.",
        },
        {
          title: "Limitation of Liability",
          content:
            "In no event shall VANGUARD-IA, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise.",
        },
      ],
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última Actualización: 7 de abril de 2025",
      sections: [
        {
          title: "Introducción",
          content:
            "Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de VANGUARD-IA. Al acceder a este sitio web, asumimos que acepta estos términos y condiciones en su totalidad. No continúe usando el sitio web de VANGUARD-IA si no acepta todos los términos y condiciones establecidos en esta página.",
        },
        {
          title: "Derechos de Propiedad Intelectual",
          content:
            "Aparte del contenido que usted posee, según estos Términos, VANGUARD-IA y/o sus licenciantes poseen todos los derechos de propiedad intelectual y materiales contenidos en este sitio web. Se le otorga una licencia limitada solo para fines de visualización del material contenido en este sitio web.",
        },
        {
          title: "Restricciones",
          content:
            "Está específicamente restringido de todo lo siguiente: publicar cualquier material del sitio web en cualquier otro medio; vender, sublicenciar y/o comercializar de otra manera cualquier material del sitio web; realizar y/o mostrar públicamente cualquier material del sitio web; usar este sitio web de cualquier manera que sea o pueda ser perjudicial para este sitio web; usar este sitio web de cualquier manera que afecte el acceso de los usuarios a este sitio web; usar este sitio web contrario a las leyes y regulaciones aplicables, o de cualquier manera que pueda causar daño al sitio web, o a cualquier persona o entidad comercial; participar en cualquier minería de datos, recolección de datos, extracción de datos o cualquier otra actividad similar en relación con este sitio web.",
        },
        {
          title: "Su Contenido",
          content:
            "En estos Términos y Condiciones, 'Su Contenido' significará cualquier audio, video, texto, imágenes u otro material que elija mostrar en este sitio web. Al mostrar Su Contenido, otorga a VANGUARD-IA una licencia no exclusiva, mundial, irrevocable, libre de regalías, sublicenciable para usar, reproducir, adaptar, publicar, traducir y distribuirlo en cualquier y todos los medios.",
        },
        {
          title: "Sin Garantías",
          content:
            "Este sitio web se proporciona 'tal cual', con todas las fallas, y VANGUARD-IA no hace representaciones o garantías expresas o implícitas, de ningún tipo relacionado con este sitio web o los materiales contenidos en este sitio web.",
        },
        {
          title: "Limitación de Responsabilidad",
          content:
            "En ningún caso, VANGUARD-IA, ni ninguno de sus funcionarios, directores y empleados, serán responsables de nada que surja de o esté relacionado de alguna manera con su uso de este sitio web, ya sea que dicha responsabilidad esté bajo contrato, agravio o de otra manera.",
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
            <div key={index}>
              <h2 className="text-xl font-semibold text-vanguard-blue mb-3">{section.title}</h2>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
