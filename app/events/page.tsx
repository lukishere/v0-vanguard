"use client"

import { useLanguage } from "@/contexts/language-context"
import { BlogCard } from "@/components/blog-card"
import { TechBackground } from "@/components/tech-background"
import AnimatedTextHeader from "@/components/animated-text-header"

export default function BlogPage() {
  const { t } = useLanguage()

  const newsPosts = [
    {
      title: "Google Unveils Gemini Ultra 2: Next-Gen Multimodal AI",
      description:
        "Gemini Ultra 2 doubles context length, adds live video understanding, and ships with a privacy-first on-device variant for Pixel 10.",
      image:
        "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80",
      date: "June 12, 2025",
      slug: "google-gemini-ultra-2",
      keywords: ["Google", "Gemini", "multimodal AI", "Pixel 10"],
    },
    {
      title: "ChatGPT 6 Turbo Released with 256K Context Window",
      description:
        "OpenAI's newest model brings faster responses, native code execution sandboxes, and citation-aware outputs for enterprises.",
      image:
        "https://images.unsplash.com/photo-1650893074747-686f8c1eaf9a?auto=format&fit=crop&w=800&q=80",
      date: "June 10, 2025",
      slug: "chatgpt-6-turbo",
      keywords: ["OpenAI", "ChatGPT 6", "large context", "enterprise AI"],
    },
    {
      title: "Vanguard-IA Secures €5 M EU Grant for AI Ethics Platform",
      description:
        "The grant accelerates development of Vanguard-IA's real-time audit tool that scores model transparency & bias across industries.",
      image:
        "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80",
      date: "June 8, 2025",
      slug: "vanguard-ia-eu-grant",
      keywords: ["Vanguard-IA", "AI ethics", "EU innovation"],
    },
    {
      title: "WWDC 2025: Apple Debuts 'Apple Intelligence OS' & Private Cloud Compute",
      description:
        "Apple's on-device LLM 'Ferret' powers new system-wide writing tools, while PCC handles heavy AI workloads under end-to-end encryption.",
      image:
        "https://images.unsplash.com/photo-1557872945-32ff50b37b14?auto=format&fit=crop&w=800&q=80",
      date: "June 7, 2025",
      slug: "wwdc-2025-apple-intelligence",
      keywords: ["Apple", "WWDC 2025", "on-device AI", "privacy"],
    },
    {
      title: "OpenAI & Google Sign Historic AI Safety Accord",
      description:
        "The two rivals commit to shared eval benchmarks, red-team data pools, and an emergency 'Kill-Switch' protocol for frontier models.",
      image:
        "https://images.unsplash.com/photo-1556742449-2b2a7c59b513?auto=format&fit=crop&w=800&q=80",
      date: "June 3, 2025",
      slug: "ai-safety-accord",
      keywords: ["AI safety", "OpenAI", "Google", "governance"],
    },
    {
      title: "AI-Generated Pop Hit 'Neon Dreams' Breaks into Billboard Top 10",
      description:
        "Co-created by musician Ava Rae and Sony's MuseNet-X, the track sparks debate on royalties for synthetic artists.",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      date: "June 1, 2025",
      slug: "neon-dreams-ai-music",
      keywords: ["AI music", "Billboard", "MuseNet-X", "copyright"],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="vanguard-section bg-white">
        <div className="vanguard-container">
          <div className="text-4xl md:text-5xl font-bold text-vanguard-blue mb-6">
            <AnimatedTextHeader
              phrases={[
                t("events.title"),
                t("events.subtitle"),
                "Events, Updates, Company"
              ]}
              className="text-vanguard-blue"
            />
          </div>
          <div className="vanguard-divider"></div>
        </div>
      </section>

      {/* News Posts */}
      <section className="py-16">
        <div className="vanguard-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsPosts.map((post, index) => (
              <BlogCard
                key={index}
                title={post.title}
                description={post.description}
                image={null}
                date={post.date}
                slug={post.slug}
                keywords={post.keywords}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
