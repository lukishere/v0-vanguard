"use client"

import { useLanguage } from "@/contexts/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CTAButton } from "@/components/cta-button"
import { SectionTitle } from "@/components/section-title"
import { faqContent } from "@/lib/content/faq"

export default function FAQPage() {
  const { language } = useLanguage()
  const currentContent = faqContent[language]

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="vanguard-container">
        <div className="text-center mb-12">
          <SectionTitle
            text={[
              currentContent.title,
              currentContent.subtitle,
              t("faq.support")
            ]}
            as="h1"
            className="text-2xl sm:text-3xl text-vanguard-blue mb-4"
            initialDelay={120}
          />
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
            <SectionTitle
              text={currentContent.cta}
              as="h3"
              className="text-lg sm:text-xl text-vanguard-blue mb-4"
              initialDelay={200}
            />
            <CTAButton type="contact" />
          </div>
        </div>
      </div>
    </div>
  )
}
