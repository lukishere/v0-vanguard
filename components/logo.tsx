"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface LogoProps {
  className?: string
  variant?: "default" | "white"
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 ${className} transition-all duration-300 hover:opacity-90`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex-shrink-0">
        <Image
          src="/images/vanguard-logo.png"
          alt="VANGUARD-IA Logo"
          width={44}
          height={44}
          style={{ height: 'auto' }}
          className={`object-contain transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
        />
      </div>
      <span
        className={`text-2xl font-bold transition-all duration-300 font-heading tracking-tight ${
          variant === "white"
            ? "text-white"
            : "bg-gradient-to-r from-vanguard-500 to-vanguard-300 bg-clip-text text-transparent"
        } ${isHovered ? "tracking-widest" : ""}`}
      >
        VANGUARD-IA
      </span>
    </Link>
  )
}
