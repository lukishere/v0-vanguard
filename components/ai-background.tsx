"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AIBackgroundProps {
  variant?: "light" | "dark" | "gradient"
  opacity?: number
  className?: string
}

export function AIBackground({ variant = "light", opacity = 0.15, className = "" }: AIBackgroundProps) {
  const [imagePath, setImagePath] = useState("/images/ai-bg-1.jpg")

  // Randomly select a background image on mount
  useEffect(() => {
    const bgOptions = [
      "/placeholder.svg?height=1200&width=1920",
      "/placeholder.svg?height=1200&width=1920",
      "/placeholder.svg?height=1200&width=1920",
    ]
    setImagePath(bgOptions[Math.floor(Math.random() * bgOptions.length)])
  }, [])

  const getGradient = () => {
    switch (variant) {
      case "dark":
        return "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))"
      case "gradient":
        return "linear-gradient(to bottom, rgba(0, 71, 171, 0.7), rgba(255, 255, 255, 0.95))"
      case "light":
      default:
        return "linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.95))"
    }
  }

  return (
    <div className={`absolute inset-0 w-full h-full -z-10 overflow-hidden ${className}`} style={{ opacity }}>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: getGradient(),
          zIndex: 1,
        }}
      />
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imagePath || "/placeholder.svg"}
          alt="AI Technology Background"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}
