import type { ComponentType } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type MetricCardProps = {
  title: string
  value: string
  helperText?: string
  change?: {
    value: number
    description?: string
  }
  positive?: boolean
  icon?: ComponentType<{ className?: string }>
}

export function MetricsCard({ title, value, helperText, change, positive = true, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
        {Icon ? <Icon className="h-5 w-5 text-vanguard-blue" /> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {change ? (
          <div className="flex items-center gap-1 text-sm">
            {positive ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-400" />
            )}
            <span className={cn("font-medium", positive ? "text-emerald-300" : "text-rose-300")}>
              {positive ? "+" : "-"}
              {Math.abs(change.value).toFixed(1)}%
            </span>
            {change.description ? <span className="text-white/50">{change.description}</span> : null}
          </div>
        ) : null}
        {helperText ? <p className="text-xs text-white/50">{helperText}</p> : null}
      </CardContent>
    </Card>
  )
}



