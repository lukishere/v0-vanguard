import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface CTAArrowProps {
  href: string
  label: string
  icon?: LucideIcon
}

export function CTAArrow({ href, label, icon: Icon }: CTAArrowProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/80"
      aria-label={label}
    >
      <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/10 text-slate-100 transition-transform duration-300 group-hover:translate-x-1">
        {Icon ? <Icon className="h-4 w-4" /> : "→"}
      </span>
    </Link>
  )
}





