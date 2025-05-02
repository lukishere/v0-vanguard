import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CTAButton } from "@/components/cta-button"
import { AnimatedIcon } from "@/components/animated-icon"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <Card className="vanguard-card border-0 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-0 bg-vanguard-red group-hover:h-full transition-all duration-500"></div>
      <CardHeader className="pb-2">
        <div className="bg-gray-50 w-12 h-12 rounded-md flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-vanguard-blue/5">
          <AnimatedIcon icon={Icon} size={24} />
        </div>
        <CardTitle className="text-vanguard-blue group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </CardTitle>
        <div className="vanguard-divider w-12 transition-all duration-300 group-hover:w-16"></div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 mb-6">{description}</CardDescription>
        <CTAButton type="learn" />
      </CardContent>
    </Card>
  )
}
