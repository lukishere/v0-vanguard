import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedIcon } from "@/components/animated-icon"
import { CTAArrow } from "@/components/cta-arrow"
import SpotlightCard from "@/components/SpotlightCard"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <SpotlightCard className="p-[1px]">
      <Card className="group relative flex h-full min-h-[320px] flex-col overflow-hidden border border-slate-800/70 bg-slate-950/70 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-slate-500/70">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-vanguard-red via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:h-1 group-hover:opacity-100" />
        <CardHeader className="pb-2">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-slate-900/80 transition-all duration-300 group-hover:scale-105 group-hover:bg-vanguard-red/20">
            <AnimatedIcon icon={Icon} size={24} />
          </div>
          <CardTitle className="text-lg font-semibold text-slate-100 transition-transform duration-300 group-hover:translate-x-1">
            {title}
          </CardTitle>
          <div className="mt-3 h-1 w-12 bg-vanguard-red transition-all duration-300 group-hover:w-16" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <CardDescription className="mb-6 text-slate-300">{description}</CardDescription>
          <CTAArrow href="/services" label={title} icon={ArrowUpRight} />
        </CardContent>
      </Card>
    </SpotlightCard>
  )
}
