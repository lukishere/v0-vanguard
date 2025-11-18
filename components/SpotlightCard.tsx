import type { ReactNode, MouseEvent } from "react"
import { useRef } from "react"
import styles from "./SpotlightCard.module.css"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(148, 163, 184, 0.25)"
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = divRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    node.style.setProperty("--mouse-x", `${x}px`)
    node.style.setProperty("--mouse-y", `${y}px`)
    node.style.setProperty("--spotlight-color", spotlightColor)
  }

  const handleMouseLeave = () => {
    const node = divRef.current
    if (!node) return

    node.style.removeProperty("--mouse-x")
    node.style.removeProperty("--mouse-y")
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${styles.cardSpotlight} ${className}`}
    >
      {children}
    </div>
  )
}

export default SpotlightCard
