'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode
} from "react"
import { gsap } from "gsap"
import { CheckCircle } from "lucide-react"

export interface MagicBentoCard {
  color?: string
  title: string
  description: string
  label?: string
  icon?: ComponentType<{ className?: string }>
  features?: string[]
}

export interface MagicBentoProps {
  cards?: MagicBentoCard[]
  textAutoHide?: boolean
  enableStars?: boolean
  enableSpotlight?: boolean
  enableBorderGlow?: boolean
  disableAnimations?: boolean
  spotlightRadius?: number
  particleCount?: number
  enableTilt?: boolean
  glowColor?: string
  clickEffect?: boolean
  enableMagnetism?: boolean
  className?: string
}

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = "132, 0, 255"
const MOBILE_BREAKPOINT = 768

const fallbackCards: MagicBentoCard[] = [
  {
    color: "#060010",
    title: "Analytics",
    description: "Track user behavior",
    label: "Insights",
    features: ["Understand trends", "Spot opportunities"]
  },
  {
    color: "#060010",
    title: "Dashboard",
    description: "Centralized data view",
    label: "Overview",
    features: ["Unified metrics", "Real-time updates"]
  },
  {
    color: "#060010",
    title: "Collaboration",
    description: "Work together seamlessly",
    label: "Teamwork",
    features: ["Shared context", "Integrated workflows"]
  },
  {
    color: "#060010",
    title: "Automation",
    description: "Streamline workflows",
    label: "Efficiency",
    features: ["Reduce manual work", "Accelerate delivery"]
  },
  {
    color: "#060010",
    title: "Integration",
    description: "Connect favorite tools",
    label: "Connectivity",
    features: ["Robust APIs", "Secure sync"]
  },
  {
    color: "#060010",
    title: "Security",
    description: "Enterprise-grade protection",
    label: "Protection",
    features: ["Defense in depth", "Continuous monitoring"]
  }
]

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement("div")
  el.className = "particle"
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return el
}

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
})

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty("--glow-x", `${relativeX}%`)
  card.style.setProperty("--glow-y", `${relativeY}%`)
  card.style.setProperty("--glow-intensity", glow.toString())
  card.style.setProperty("--glow-radius", `${radius}px`)
}

const ParticleCard = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}: {
  children: ReactNode
  className?: string
  disableAnimations?: boolean
  style?: CSSProperties
  particleCount?: number
  glowColor?: string
  enableTilt?: boolean
  clickEffect?: boolean
  enableMagnetism?: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const isHoveredRef = useRef(false)
  const memoizedParticles = useRef<HTMLDivElement[]>([])
  const particlesInitialized = useRef(false)
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null)

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return

    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    )
    particlesInitialized.current = true
  }, [particleCount, glowColor])

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    magnetismAnimationRef.current?.kill()

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle)
        }
      })
    })
    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return

    if (!particlesInitialized.current) {
      initializeParticles()
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return

        const clone = particle.cloneNode(true) as HTMLDivElement
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" })

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true
        })

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        })
      }, index * 100)

      timeoutsRef.current.push(timeoutId)
    })
  }, [initializeParticles])

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return

    const element = cardRef.current

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      animateParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000
        })
      }
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      clearAllParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000
        })
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05
        const magnetY = (y - centerY) * 0.05

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!clickEffect) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      )

      const ripple = document.createElement("div")
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `

      element.appendChild(ripple)

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        }
      )
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("click", handleClick)

    return () => {
      isHoveredRef.current = false
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("click", handleClick)
      clearAllParticles()
    }
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor])

  return (
    <div
      ref={cardRef}
      className={`${className ?? ""} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  )
}

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}: {
  gridRef: React.RefObject<HTMLDivElement | null>
  disableAnimations?: boolean
  enabled?: boolean
  spotlightRadius?: number
  glowColor?: string
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null)
  const isInsideSection = useRef(false)

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return

    const spotlight = document.createElement("div")
    spotlight.className = "global-spotlight"
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return

      const section = gridRef.current.closest(".bento-section")
      const rect = section?.getBoundingClientRect()
      const mouseInside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      isInsideSection.current = mouseInside || false
      const cards = gridRef.current.querySelectorAll(".card")

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        })
        cards.forEach(card => {
          ;(card as HTMLElement).style.setProperty("--glow-intensity", "0")
        })
        return
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius)
      let minDistance = Infinity

      cards.forEach(card => {
        const cardElement = card as HTMLElement
        const cardRect = cardElement.getBoundingClientRect()
        const centerX = cardRect.left + cardRect.width / 2
        const centerY = cardRect.top + cardRect.height / 2
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2
        const effectiveDistance = Math.max(0, distance)

        minDistance = Math.min(minDistance, effectiveDistance)

        let glowIntensity = 0
        if (effectiveDistance <= proximity) {
          glowIntensity = 1
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
        }

        updateCardGlowProperties(cardElement, event.clientX, event.clientY, glowIntensity, spotlightRadius)
      })

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.1,
        ease: "power2.out"
      })

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = () => {
      isInsideSection.current = false
      gridRef.current?.querySelectorAll(".card").forEach(card => {
        ;(card as HTMLElement).style.setProperty("--glow-intensity", "0")
      })
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current)
    }
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor])

  return null
}

const BentoCardGrid = ({
  children,
  gridRef
}: {
  children: ReactNode
  gridRef?: React.RefObject<HTMLDivElement | null>
}) => (
  <div
    className="bento-section relative mx-auto grid w-full max-w-[54rem] select-none gap-2 p-3"
    style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}
    ref={gridRef}
  >
    {children}
  </div>
)

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export const MagicBento = ({
  cards,
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = false,
  enableMagnetism = true,
  className = ""
}: MagicBentoProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobileDetection()
  const shouldDisableAnimations = disableAnimations || isMobile

  const data = useMemo(() => {
    if (cards?.length) {
      return cards
    }
    return fallbackCards
  }, [cards])

  return (
    <div className={className}>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }

          .card-responsive {
            display: grid;
            gap: 1.5rem;
            padding: 0.75rem;
            width: 100%;
            margin: 0 auto;
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: 1200px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
              max-width: 1100px;
            }
          }

          @media (max-width: 768px) {
            .card-responsive {
              grid-template-columns: 1fr;
            }
          }

          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }

          .card--border-glow:hover::after {
            opacity: 1;
          }

          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }

          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }

          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }

          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .card-responsive .card {
            min-height: 300px;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {data.map((card, index) => {
            const baseClassName = `card group flex flex-col gap-6 justify-between relative w-full h-full max-w-full p-6 rounded-[22px] border border-solid overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] ${
              enableBorderGlow ? "card--border-glow" : ""
            }`

            const cardStyle = {
              backgroundColor: card.color || "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "var(--white)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px"
            } as CSSProperties

            const CardIcon = card.icon
            const hasLabel = Boolean(card.label)

            const content = (
              <>
                <div className="card__header flex items-center gap-3 text-white">
                  {CardIcon ? <CardIcon className="h-8 w-8 text-vanguard-blue" /> : null}
                  {hasLabel ? (
                    <span className="card__label text-xs font-medium uppercase tracking-[0.35em] text-slate-300">
                      {card.label}
                    </span>
                  ) : null}
                </div>
                <div className="card__content flex flex-1 flex-col gap-4 text-left text-white">
                  <div className="space-y-3">
                    <h3 className={`card__title font-semibold text-xl leading-tight ${textAutoHide ? "text-clamp-1" : ""}`}>
                      {card.title}
                    </h3>
                    <p
                      className={`card__description text-sm leading-6 text-slate-200 ${textAutoHide ? "text-clamp-2" : ""}`}
                    >
                      {card.description}
                    </p>
                  </div>
                  {card.features?.length ? (
                    <ul className="card__features mt-1 space-y-2.5 text-sm text-slate-200">
                      {card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 leading-snug">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-vanguard-blue flex-shrink-0" />
                          <span className="block">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </>
            )

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {content}
                </ParticleCard>
              )
            }

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                ref={element => {
                  if (!element) return

                  const handleMouseMove = (event: MouseEvent) => {
                    if (shouldDisableAnimations) return

                    const rect = element.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top
                    const centerX = rect.width / 2
                    const centerY = rect.height / 2

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10
                      const rotateY = ((x - centerX) / centerX) * 10

                      gsap.to(element, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: "power2.out",
                        transformPerspective: 1000
                      })
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05
                      const magnetY = (y - centerY) * 0.05

                      gsap.to(element, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: "power2.out"
                      })
                    }
                  }

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return

                    if (enableTilt) {
                      gsap.to(element, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: "power2.out"
                      })
                    }

                    if (enableMagnetism) {
                      gsap.to(element, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                      })
                    }
                  }

                  const handleClick = (event: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return

                    const rect = element.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height)
                    )

                    const ripple = document.createElement("div")
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `

                    element.appendChild(ripple)

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove()
                      }
                    )
                  }

                  element.addEventListener("mousemove", handleMouseMove)
                  element.addEventListener("mouseleave", handleMouseLeave)
                  element.addEventListener("click", handleClick)
                }}
              >
                {content}
              </div>
            )
          })}
        </div>
      </BentoCardGrid>
    </div>
  )
}
