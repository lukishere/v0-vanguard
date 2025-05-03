"use client"

import { useLanguage } from "@/contexts/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CTAButton } from "@/components/cta-button"
import AnimatedTextHeader from "@/components/animated-text-header"

export default function FAQPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our services",
      cta: "Didn't find what you're looking for?",
      faqs: [
        {
          question: "What services does VANGUARD-IA offer?",
          answer:
            "VANGUARD-IA offers a comprehensive range of services including AI consulting, IT consulting, web branding, infrastructure consulting, and security solutions. Our team of experts works closely with clients to understand their unique needs and deliver tailored solutions that drive business growth and innovation.",
        },
        {
          question: "How can AI benefit my business?",
          answer:
            "AI can benefit your business in numerous ways, including automating repetitive tasks, providing data-driven insights, enhancing customer experiences, optimizing operations, and enabling predictive analytics. Our AI consulting services help you identify the most valuable applications of AI for your specific business needs and implement solutions that deliver measurable results.",
        },
        {
          question: "What is the process for starting a project with VANGUARD-IA?",
          answer:
            "Our process typically begins with an initial consultation to understand your business goals and challenges. We then conduct a thorough assessment of your current systems and processes, develop a strategic plan, and present a detailed proposal. Once approved, our team works closely with you throughout implementation, providing regular updates and ensuring a smooth transition. We also offer ongoing support and maintenance services.",
        },
        {
          question: "Do you offer services for small businesses or only large enterprises?",
          answer:
            "We offer services for businesses of all sizes, from startups and small businesses to large enterprises. Our solutions are scalable and can be tailored to meet the specific needs and budget constraints of your organization, regardless of its size.",
        },
        {
          question: "How do you ensure the security of my data?",
          answer:
            "Security is a top priority at VANGUARD-IA. We implement industry-leading security measures and best practices to protect your data, including encryption, secure access controls, regular security audits, and compliance with relevant regulations such as GDPR. Our security experts continuously monitor for potential threats and vulnerabilities to ensure your data remains protected.",
        },
        {
          question: "What makes VANGUARD-IA different from other consultancies?",
          answer:
            "What sets VANGUARD-IA apart is our holistic approach to technology consulting. We combine deep technical expertise with a strong understanding of business strategy to deliver solutions that not only solve immediate challenges but also support long-term growth. Our team stays at the forefront of technological innovations, ensuring that our clients benefit from the latest advancements in AI, IT, and security.",
        },
      ],
    },
    es: {
      title: "Preguntas Frecuentes",
      subtitle: "Encuentra respuestas a preguntas comunes sobre nuestros servicios",
      cta: "¿No encontraste lo que buscabas?",
      faqs: [
        {
          question: "¿Qué servicios ofrece VANGUARD-IA?",
          answer:
            "VANGUARD-IA ofrece una amplia gama de servicios que incluyen consultoría de IA, consultoría de TI, branding web, consultoría de infraestructura y soluciones de seguridad. Nuestro equipo de expertos trabaja estrechamente con los clientes para comprender sus necesidades únicas y ofrecer soluciones personalizadas que impulsen el crecimiento empresarial y la innovación.",
        },
        {
          question: "¿Cómo puede beneficiar la IA a mi negocio?",
          answer:
            "La IA puede beneficiar a su negocio de numerosas maneras, incluyendo la automatización de tareas repetitivas, proporcionando información basada en datos, mejorando las experiencias de los clientes, optimizando operaciones y permitiendo análisis predictivos. Nuestros servicios de consultoría de IA le ayudan a identificar las aplicaciones más valiosas de IA para sus necesidades específicas de negocio e implementar soluciones que ofrezcan resultados medibles.",
        },
        {
          question: "¿Cuál es el proceso para iniciar un proyecto con VANGUARD-IA?",
          answer:
            "Nuestro proceso típicamente comienza con una consulta inicial para comprender sus objetivos y desafíos empresariales. Luego realizamos una evaluación exhaustiva de sus sistemas y procesos actuales, desarrollamos un plan estratégico y presentamos una propuesta detallada. Una vez aprobada, nuestro equipo trabaja estrechamente con usted durante toda la implementación, proporcionando actualizaciones regulares y asegurando una transición sin problemas. También ofrecemos servicios continuos de soporte y mantenimiento.",
        },
        {
          question: "¿Ofrecen servicios para pequeñas empresas o solo para grandes empresas?",
          answer:
            "Ofrecemos servicios para empresas de todos los tamaños, desde startups y pequeñas empresas hasta grandes corporaciones. Nuestras soluciones son escalables y pueden adaptarse para satisfacer las necesidades específicas y las limitaciones presupuestarias de su organización, independientemente de su tamaño.",
        },
        {
          question: "¿Cómo garantizan la seguridad de mis datos?",
          answer:
            "La seguridad es una prioridad máxima en VANGUARD-IA. Implementamos medidas de seguridad líderes en la industria y mejores prácticas para proteger sus datos, incluyendo cifrado, controles de acceso seguro, auditorías de seguridad regulares y cumplimiento con regulaciones relevantes como el GDPR. Nuestros expertos en seguridad monitorean continuamente posibles amenazas y vulnerabilidades para garantizar que sus datos permanezcan protegidos.",
        },
        {
          question: "¿Qué hace a VANGUARD-IA diferente de otras consultorías?",
          answer:
            "Lo que distingue a VANGUARD-IA es nuestro enfoque holístico de la consultoría tecnológica. Combinamos una profunda experiencia técnica con una sólida comprensión de la estrategia empresarial para ofrecer soluciones que no solo resuelven desafíos inmediatos, sino que también apoyan el crecimiento a largo plazo. Nuestro equipo se mantiene a la vanguardia de las innovaciones tecnológicas, asegurando que nuestros clientes se beneficien de los últimos avances en IA, TI y seguridad.",
        },
      ],
    },
  }

  const currentContent = language === "en" ? content.en : content.es

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="vanguard-container">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-vanguard-blue mb-4">
            <AnimatedTextHeader
              phrases={[
                currentContent.title,
                currentContent.subtitle,
                language === "en"
                  ? "Support & Information"
                  : "Soporte e Información"
              ]}
              className="text-vanguard-blue"
            />
          </h1>
          <p className="text-xl text-gray-600">{currentContent.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="mb-12">
            {currentContent.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="overflow-hidden transition-all duration-500 hover:bg-gray-50 rounded-md"
              >
                <AccordionTrigger className="text-vanguard-blue font-medium text-left group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 animate-fade-in">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{currentContent.cta}</h3>
            <CTAButton type="contact" />
          </div>
        </div>
      </div>
    </div>
  )
}
