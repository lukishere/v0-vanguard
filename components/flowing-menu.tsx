'use client'

import { useCallback, useMemo, useRef } from "react"
import { gsap } from "gsap"

export type FlowingMenuItem = {
  link: string
  text: string
  image: string
}

export type FlowingMenuProps = {
  items: FlowingMenuItem[]
  className?: string
}

type Edge = "top" | "bottom"

const animationDefaults = { duration: 0.55, ease: "expo.out" as const }

const resolveBackgroundImage = (image: string) => {
  if (image.startsWith("linear-gradient") || image.startsWith("radial-gradient")) {
    return image
  }
  if (image.startsWith("url(")) {
    return image
  }
  return `url(${image})`
}

// Always animate from top to bottom
const getClosestEdge = (): Edge => {
  return "top"
}

const FlowingMenuEntry = ({ link, text, image }: FlowingMenuItem) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const repeatedContent = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => (
        <div key={`${text}-${index}`} className="flex items-center gap-6 px-6 py-4">
          <span className="whitespace-nowrap text-lg uppercase tracking-[0.35em] text-[#060010] md:text-xl">
            {text}
          </span>
          <div
            className="h-14 w-32 rounded-full bg-cover bg-center shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition duration-500"
            style={{ backgroundImage: resolveBackgroundImage(image) }}
          />
        </div>
      )),
    [image, text]
  )

  const animate = useCallback(
    (edge: Edge, direction: "enter" | "leave") => {
      if (!marqueeRef.current || !marqueeInnerRef.current) return

      activeTimelineRef.current?.kill()

      const timeline = gsap.timeline({
        defaults: animationDefaults,
        onComplete: () => {
          activeTimelineRef.current = null
        }
      })

      if (direction === "enter") {
        timeline
          .set(marqueeRef.current, { yPercent: edge === "top" ? -101 : 101 })
          .set(marqueeInnerRef.current, { yPercent: edge === "top" ? 101 : -101 })
          .to(marqueeRef.current, { yPercent: 0 }, 0)
          .to(marqueeInnerRef.current, { yPercent: 0 }, 0)
      } else {
        timeline
          .to(marqueeRef.current, { yPercent: edge === "top" ? -101 : 101 }, 0)
          .to(marqueeInnerRef.current, { yPercent: edge === "top" ? 101 : -101 }, 0)
      }

      activeTimelineRef.current = timeline
    },
    []
  )

  const handlePointerEnter = useCallback(
    () => {
      const edge = getClosestEdge()
      animate(edge, "enter")
    },
    [animate]
  )

  const handlePointerLeave = useCallback(
    () => {
      const edge = getClosestEdge()
      animate(edge, "leave")
    },
    [animate]
  )

  return (
    <div
      ref={wrapperRef}
      className="relative h-[180px] overflow-hidden border-t border-white/10 first:rounded-t-[32px] last:rounded-b-[32px] last:border-b"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-full items-center justify-center px-12 text-center text-2xl font-semibold uppercase tracking-[0.45em] text-white transition hover:text-[#060010] focus-visible:text-[#060010] md:text-4xl"
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
      >
        {text}
      </a>
      <div
        ref={marqueeRef}
        className="pointer-events-none absolute inset-0 translate-y-full overflow-hidden bg-white text-[#060010] shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
      >
        <div
          ref={marqueeInnerRef}
          className="flex h-full w-[220%] items-center animate-flowing-menu will-change-transform"
        >
          {repeatedContent}
        </div>
      </div>
    </div>
  )
}

export const FlowingMenu = ({ items, className }: FlowingMenuProps) => {
  return (
    <>
      <style>
        {`
          @keyframes flowing-menu {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-flowing-menu {
            animation: flowing-menu 18s linear infinite;
          }
        `}
      </style>
      <div className={`overflow-hidden ${className ?? ""}`}>
        <nav className="flex w-full flex-col">
          {items.map((item) => (
            <FlowingMenuEntry key={`${item.link}-${item.text}`} {...item} />
          ))}
        </nav>
      </div>
    </>
  )
}

export default FlowingMenu
