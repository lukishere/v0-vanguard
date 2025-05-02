"use client"

import { useLanguage } from "@/contexts/language-context"
import { BlogCard } from "@/components/blog-card"
import { TechBackground } from "@/components/tech-background"

export default function BlogPage() {
  const { t } = useLanguage()

  const blogPosts = [
    {
      title: "The Future of AI in Business",
      description:
        "Explore how artificial intelligence is transforming business operations and creating new opportunities.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 2, 2025",
      slug: "future-of-ai-in-business",
      keywords: ["artificial intelligence", "AI business applications", "machine learning", "business automation"],
    },
    {
      title: "Securing Your Digital Infrastructure",
      description: "Learn about the latest security threats and how to protect your business from cyber attacks.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 28, 2025",
      slug: "securing-digital-infrastructure",
      keywords: ["cybersecurity", "digital security", "cyber threats", "network protection", "data security"],
    },
    {
      title: "Effective Web Branding Strategies",
      description: "Discover how to create a compelling web presence that resonates with your target audience.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 15, 2025",
      slug: "effective-web-branding-strategies",
      keywords: ["web branding", "digital marketing", "brand identity", "online presence", "web design"],
    },
    {
      title: "Cloud Infrastructure: Benefits and Challenges",
      description:
        "An in-depth look at the advantages and potential pitfalls of moving your infrastructure to the cloud.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 10, 2025",
      slug: "cloud-infrastructure-benefits-challenges",
      keywords: ["cloud computing", "cloud infrastructure", "cloud migration", "AWS", "Azure", "Google Cloud"],
    },
    {
      title: "The Role of Data Analytics in Modern Business",
      description: "How data-driven insights can help businesses make better decisions and gain competitive advantage.",
      image: "/placeholder.svg?height=400&width=600",
      date: "February 28, 2025",
      slug: "role-of-data-analytics",
      keywords: ["data analytics", "business intelligence", "big data", "data-driven decisions", "analytics tools"],
    },
    {
      title: "Building a Strong Digital Brand Identity",
      description: "Key strategies for creating a cohesive and memorable brand presence across digital channels.",
      image: "/placeholder.svg?height=400&width=600",
      date: "February 15, 2025",
      slug: "building-strong-digital-brand-identity",
      keywords: ["digital branding", "brand identity", "online marketing", "brand strategy", "visual identity"],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50 py-12 relative overflow-hidden">
        <TechBackground />
        <div className="vanguard-container">
          <h1 className="text-3xl md:text-4xl font-bold text-vanguard-blue mb-4">{t("blog.title")}</h1>
          <p className="text-xl text-gray-600">{t("blog.subtitle")}</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="vanguard-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={index}
                title={post.title}
                description={post.description}
                image={post.image}
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
