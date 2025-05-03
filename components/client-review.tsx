"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Building2, Briefcase, Database, Globe, ShieldCheck } from "lucide-react"

export type BusinessType = "tech" | "finance" | "healthcare" | "retail" | "manufacturing"

interface ClientReviewProps {
  name: string
  position: string
  company: string
  review: string
  rating: number
  businessType: BusinessType
}

export function ClientReview({ name, position, company, review, rating, businessType }: ClientReviewProps) {
  // Get appropriate icon based on business type
  const getBusinessIcon = () => {
    switch (businessType) {
      case "tech":
        return <Database className="h-8 w-8 text-blue-500" />
      case "finance":
        return <Briefcase className="h-8 w-8 text-green-600" />
      case "healthcare":
        return <ShieldCheck className="h-8 w-8 text-red-500" />
      case "retail":
        return <Globe className="h-8 w-8 text-purple-500" />
      case "manufacturing":
        return <Building2 className="h-8 w-8 text-orange-500" />
      default:
        return <Building2 className="h-8 w-8 text-gray-500" />
    }
  }

  // Get appropriate background color based on business type
  const getBackgroundColor = () => {
    switch (businessType) {
      case "tech":
        return "bg-blue-50"
      case "finance":
        return "bg-green-50"
      case "healthcare":
        return "bg-red-50"
      case "retail":
        return "bg-purple-50"
      case "manufacturing":
        return "bg-orange-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
      <div className={`${getBackgroundColor()} p-4 flex justify-between items-center border-b`}>
        <div className="flex items-center">
          <div className="mr-3">{getBusinessIcon()}</div>
          <div>
            <h4 className="font-semibold text-gray-900">{company}</h4>
            <p className="text-sm text-gray-600">{position}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>
      </div>
      <CardContent className="p-5">
        <blockquote className="text-gray-700 italic mb-4">"{review}"</blockquote>
        <div className="text-right text-sm font-medium text-gray-900">— {name}</div>
      </CardContent>
    </Card>
  )
}
