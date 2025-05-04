"use client"

import { useLanguage } from "@/contexts/language-context"
import { BlogCard } from "@/components/blog-card"
import { TechBackground } from "@/components/tech-background"
import AnimatedTextHeader from "@/components/animated-text-header"

export default function BlogPage() {
  const { t } = useLanguage()

  const newsPosts = [
    {
      title: "Google's Latest AI Breakthroughs",
      description:
        "Discover how Google is pushing the boundaries of artificial intelligence with their latest research and developments.",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      date: "April 2, 2025",
      slug: "google-ai-breakthroughs",
      keywords: ["Google AI", "artificial intelligence", "machine learning", "AI research"],
    },
    {
      title: "ChatGPT's Evolution and Impact",
      description: "Explore how ChatGPT is transforming industries and revolutionizing human-AI interaction.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/OpenAI_Logo.svg",
      date: "March 28, 2025",
      slug: "chatgpt-evolution",
      keywords: ["ChatGPT", "AI integration", "digital transformation", "tech innovation"],
    },
    {
      title: "The Future of AI in Search Engines",
      description: "How Google and ChatGPT are revolutionizing search with artificial intelligence.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
      date: "March 15, 2025",
      slug: "ai-search-engines",
      keywords: ["AI search", "Google search", "ChatGPT", "search algorithms"],
    },
    {
      title: "AI Ethics in Tech Giants",
      description: "Examining how Google and ChatGPT are addressing ethical concerns in AI development.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      date: "March 10, 2025",
      slug: "ai-ethics-tech-giants",
      keywords: ["AI ethics", "responsible AI", "tech governance", "AI policy"],
    },
    {
      title: "AI-Powered Business Solutions",
      description: "How Google and ChatGPT are helping businesses leverage AI for growth and innovation.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      date: "February 28, 2025",
      slug: "ai-business-solutions",
      keywords: ["AI business", "enterprise AI", "AI tools", "business automation"],
    },
    {
      title: "The AI Arms Race: Google vs ChatGPT",
      description: "A comparative analysis of AI strategies between Google and ChatGPT.",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      date: "February 15, 2025",
      slug: "ai-arms-race",
      keywords: ["AI competition", "tech giants", "AI development", "innovation race"],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="vanguard-section bg-white">
        <div className="vanguard-container">
          <h1 className="text-4xl md:text-5xl font-bold text-vanguard-blue mb-6">
            <AnimatedTextHeader
              phrases={[
                t("news.title"),
                t("news.subtitle"),
                "AI, Technology, Business"
              ]}
              className="text-vanguard-blue"
            />
          </h1>
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
