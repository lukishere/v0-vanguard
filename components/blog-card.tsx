import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CTAButton } from "@/components/cta-button"
import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
  title: string
  description: string
  image: string
  date: string
  slug: string
  keywords?: string[]
}

export function BlogCard({ title, description, image, date, slug, keywords = [] }: BlogCardProps) {
  // Generate a Google News search URL based on the blog post title and keywords
  const generateGoogleNewsUrl = () => {
    // Combine title and keywords for a more relevant search
    const searchTerms = [...keywords, title].filter(Boolean).join(" ")
    // Encode the search terms for a URL
    const encodedSearch = encodeURIComponent(searchTerms)
    // Create a Google News search URL
    return `https://news.google.com/search?q=${encodedSearch}&hl=en-US&gl=US&ceid=US:en`
  }

  return (
    <Card className="vanguard-card border-0 overflow-hidden group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-white/90 text-vanguard-blue text-xs font-medium py-1 px-2 rounded">
          {date}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-vanguard-blue">
          <Link
            href={`/blog/${slug}`}
            className="hover:text-vanguard-blue/80 transition-all duration-300 vanguard-button-hover inline-block"
          >
            {title}
          </Link>
        </CardTitle>
        <div className="vanguard-divider w-12 transition-all duration-300 group-hover:w-16"></div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <CTAButton type="external" href={generateGoogleNewsUrl()} isExternal={true} text="Read News Articles" />
      </CardFooter>
    </Card>
  )
}
