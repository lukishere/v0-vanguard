"use client"

import Particles from "react-tsparticles"
import { loadLinksPreset } from "tsparticles-preset-links"
import type { Engine } from "tsparticles-engine"
import { useCallback } from "react"
import { usePathname } from "next/navigation"

export default function ReactParticlesBackground() {
  const pathname = usePathname()
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadLinksPreset(engine)
  }, [])

  // Deshabilitar partículas en página de contacto
  const isDisabled = pathname === "/contact"

  if (isDisabled) {
    return null
  }

  return (
    <Particles
      id="react-tsparticles"
      init={particlesInit}
      options={{
        preset: "links",
        fullScreen: { enable: true, zIndex: 20 },
        background: { color: { value: "transparent" } },
        particles: {
          color: { value: "#0047AB" },
          links: {
            color: "#0047AB",
            distance: 150,
            enable: true,
            opacity: 0.12,
            width: 1.2,
          },
          move: { enable: true, speed: 0.25, direction: "none" },
          life: {
            duration: { sync: false, value: 6 },
            delay: { sync: false, value: 2 },
            count: 0
          },
          number: { value: 45, density: { enable: true, area: 800 } },
          opacity: { value: 0.15 },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
        pauseOnBlur: true,
      }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    />
  )
} 