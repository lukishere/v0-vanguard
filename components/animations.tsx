"use client"

import { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export const subtleZoom: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
}

export const fadeInDelay = (delay = 0.2): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay } }
}) 