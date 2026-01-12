import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CTAArrow } from "@/components/cta-arrow"
import SpotlightCard from "@/components/SpotlightCard"
import Link from "next/link"

interface ServiceCardProps {
  title: string
  description: string
  benefit?: string
}

function processDescription(description: string) {
  const parts = description.split(/(EXIN\.com)/g)
  return parts.map((part, index) => {
    if (part === "EXIN.com") {
      return (
        <Link
          key={index}
          href="https://www.exin.com/about-exin/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-vanguard-blue hover:text-vanguard-blue/80 underline transition-colors"
        >
          {part}
        </Link>
      )
    }
    return part
  })
}

export function ServiceCard({ title, description, benefit }: ServiceCardProps) {
  return (
    <SpotlightCard className="p-[1px] h-full">
      <Card className="group relative flex h-full min-h-[320px] flex-col overflow-hidden border border-slate-600/50 bg-gradient-to-br from-slate-700/80 to-slate-800/90 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-slate-400/70 hover:shadow-xl">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-vanguard-red via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:h-1 group-hover:opacity-100" />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-100 transition-transform duration-300 group-hover:translate-x-1">
            {title}
          </CardTitle>
          <div className="mt-3 h-1 w-12 bg-vanguard-red transition-all duration-300 group-hover:w-16" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <CardDescription className="mb-4 text-slate-300">{processDescription(description)}</CardDescription>
          {benefit && (
            <div className="mb-6 rounded-md border-l-2 border-vanguard-gold/50 bg-slate-900/50 p-3">
              <p className="text-sm font-medium text-vanguard-gold/90">{benefit}</p>
            </div>
          )}
          <CTAArrow href="/services" label={title} icon={ArrowUpRight} />
        </CardContent>
      </Card>
    </SpotlightCard>
  )
}
