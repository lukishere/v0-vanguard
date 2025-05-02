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
      className={`flex items-center ${className} transition-all duration-300 hover:opacity-90`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Image
          src="/images/vanguard-logo.png"
          alt="VANGUARD-IA Logo"
          width={40}
          height={40}
          className={`object-contain transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
        />
      </div>
      <span
        className={`ml-2 text-2xl font-bold transition-all duration-300 ${
          variant === "white" ? "text-white" : "text-vanguard-blue"
        } ${isHovered ? "tracking-wider" : ""}`}
      >
        VANGUARD-IA
      </span>
    </Link>
  )
}
