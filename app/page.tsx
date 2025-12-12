"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { ServiceCard } from "@/components/service-card"
import { BlogCard } from "@/components/blog-card"
import { ClientReview } from "@/components/client-review"
import Image from "next/image"
import type { BusinessType } from "@/components/client-review"
import { SectionTitle } from "@/components/section-title"
import LogoLoop from "@/components/LogoLoop"
import "@/components/LogoLoop.css"
import { servicesContent } from "@/lib/content/services"
import { useMemo } from "react"

export default function Home() {
  const { t, language } = useLanguage()

  const currentContent = useMemo(() => servicesContent[language], [language])
  const services = useMemo(
    () =>
      currentContent.services.map((service) => ({
        title: service.title,
        description: service.description,
        benefit: service.benefit,
      })),
    [currentContent.services, language]
  )

  const reviews = [
    {
      name: t("reviews.client1.name"),
      position: t("reviews.client1.position"),
      company: t("reviews.client1.company"),
      review: t("reviews.client1.review"),
      rating: 5,
      businessType: "tech",
    },
    {
      name: t("reviews.client2.name"),
      position: t("reviews.client2.position"),
      company: t("reviews.client2.company"),
      review: t("reviews.client2.review"),
      rating: 5,
      businessType: "finance",
    },
    {
      name: t("reviews.client3.name"),
      position: t("reviews.client3.position"),
      company: t("reviews.client3.company"),
      review: t("reviews.client3.review"),
      rating: 5,
      businessType: "healthcare",
    },
  ]

  const newsPosts = [
    {
      title: "Google's Latest AI Breakthroughs",
      description:
        "Discover how Google is pushing the boundaries of artificial intelligence with their latest research and developments.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 2, 2025",
      slug: "google-ai-breakthroughs",
      keywords: ["Google AI", "artificial intelligence", "machine learning", "AI research"],
    },
    {
      title: "ChatGPT's Evolution and Impact",
      description: "Explore how ChatGPT is transforming industries and revolutionizing human-AI interaction.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 28, 2025",
      slug: "chatgpt-evolution",
      keywords: ["ChatGPT", "AI integration", "digital transformation", "tech innovation"],
    },
    {
      title: "The Future of AI in Search Engines",
      description: "How Google and ChatGPT are revolutionizing search with artificial intelligence.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 15, 2025",
      slug: "ai-search-engines",
      keywords: ["AI search", "Google search", "ChatGPT", "search algorithms"],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="relative z-10 vanguard-container py-24">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex min-h-[8rem] w-full items-center justify-start sm:min-h-[9rem] lg:min-h-[10rem]">
                  <SectionTitle
                    text={[
                      t("hero.title"),
                      t("hero.advancedSolutions"),
                      t("hero.technology")
                    ]}
                    as="h1"
                    className="text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
                    initialDelay={120}
                  />
                </div>
                <div className="vanguard-divider"></div>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">{t("hero.subtitle")}</p>
              <div className="flex flex-wrap gap-4">
                <CTAButton type="learn" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-lg shadow-md">
                <Image
                  src="/images/v-hero-new.jpg"
                  alt="VANGUARD-IA - Innovation and Creativity"
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24 pl-4 md:pl-0">
          {/* LogoLoop moved here - above "Nuestros Servicios" */}
          <div className="mb-16">
            <LogoLoop
              logos={[
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
                  alt: "AWS",
                  href: "https://aws.amazon.com"
                },
                {
                  src: "https://cdn.simpleicons.org/githubcopilot/FFFFFF",
                  alt: "Copilot",
                  href: "https://github.com/features/copilot"
                },
                {
                  src: "https://cdn.simpleicons.org/anthropic/FFFFFF",
                  alt: "Anthropic",
                  href: "https://www.anthropic.com"
                },
                {
                  src: "https://cdn.simpleicons.org/cursor/FFFFFF",
                  alt: "Cursor AI",
                  href: "https://cursor.sh"
                },
                {
                  src: "https://cdn.simpleicons.org/github/FFFFFF",
                  alt: "GitHub",
                  href: "https://github.com"
                },
                {
                  src: "https://cdn.simpleicons.org/n8n/FFFFFF",
                  alt: "N8N",
                  href: "https://n8n.io"
                },
                {
                  src: "https://cdn.simpleicons.org/google/FFFFFF",
                  alt: "Google",
                  href: "https://www.google.com"
                },
                {
                  src: "https://cdn.simpleicons.org/perplexity/FFFFFF",
                  alt: "Perplexity AI",
                  href: "https://www.perplexity.ai"
                },
                {
                  src: "https://cdn.simpleicons.org/figma/FFFFFF",
                  alt: "Figma",
                  href: "https://www.figma.com"
                },
                {
                  src: "https://cdn.simpleicons.org/huggingface/FFFFFF",
                  alt: "Deepseek",
                  href: "https://www.deepseek.com"
                },
                {
                  src: "https://cdn.simpleicons.org/alibabacloud/FFFFFF",
                  alt: "Qwen (Alibaba)",
                  href: "https://www.alibabacloud.com"
                },
                {
                  src: "https://cdn.simpleicons.org/nvidia/FFFFFF",
                  alt: "NVIDIA",
                  href: "https://www.nvidia.com"
                },
              ]}
              speed={60}
              logoHeight={40}
              gap={48}
              pauseOnHover={true}
            />
          </div>
          <div className="mb-16 text-center">
            <SectionTitle
              text={t("services.title")}
              as="h2"
              className="mb-6 text-2xl text-white sm:text-3xl"
              initialDelay={220}
            />
            <div className="vanguard-divider mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 items-stretch">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                benefit={service.benefit}
              />
            ))}
          </div>

          {/* QUAN Partnership Section */}
          <div className="mt-16 border-t border-slate-800/70 pt-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  {t("quan.title")} ({t("quan.poweredBy")})
                </h3>
                <div className="flex items-center justify-center">
                  <Image
                    src="/images/quan-logo.png"
                    alt="QUAN LLC Logo"
                    width={150}
                    height={150}
                    className="ml-3"
                  />
                </div>
              </div>
              <p className="max-w-3xl text-base text-slate-300 sm:text-lg">
                {t("quan.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mb-16 text-center">
            <SectionTitle
              text={t("reviews.title")}
              as="h2"
              className="mb-6 text-2xl text-white sm:text-3xl"
              initialDelay={240}
            />
            <p className="mx-auto max-w-2xl text-blue-100 mb-8">{t("reviews.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {reviews.map((review, index) => (
              <ClientReview
                key={index}
                name={review.name}
                position={review.position}
                company={review.company}
                review={review.review}
                rating={review.rating}
                businessType={review.businessType as BusinessType}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
