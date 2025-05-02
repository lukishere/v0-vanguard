"use client"

import { useEffect, useState } from "react"

export function CursorTrail() {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  useEffect(() => {
    if (mousePosition.x === 0 && mousePosition.y === 0) return

    const newTrail = { x: mousePosition.x, y: mousePosition.y, id: Date.now() }
    setTrail((prev) => [...prev, newTrail].slice(-5)) // Keep only the last 5 positions

    const timer = setTimeout(() => {
      setTrail((prev) => prev.filter((dot) => dot.id !== newTrail.id))
    }, 500) // Remove after 500ms

    return () => {
      clearTimeout(timer)
    }
  }, [mousePosition])

  return (
    <>
      {trail.map((dot) => (
        <div
          key={dot.id}
          className="fixed pointer-events-none z-50 w-4 h-4 rounded-full bg-vanguard-blue/20 mix-blend-screen"
          style={{
            left: `${dot.x - 8}px`,
            top: `${dot.y - 8}px`,
            animation: "cursor-trail 0.5s forwards",
          }}
        />
      ))}
    </>
  )
}
