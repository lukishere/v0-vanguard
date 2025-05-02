"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"

interface AnimatedIconProps {
  icon: LucideIcon
  size?: number
  color?: string
  hoverColor?: string
  className?: string
}

export function AnimatedIcon({
  icon: Icon,
  size = 24,
  color = "#0047AB",
  hoverColor = "#0047AB",
  className = "",
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-300 transform ${isHovered ? "scale-110" : ""} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        size={size}
        color={isHovered ? hoverColor : color}
        className={`transition-all duration-300 ${isHovered ? "animate-pulse-subtle" : ""}`}
      />
    </div>
  )
}
