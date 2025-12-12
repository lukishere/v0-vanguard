'use client'

import type { ElementType } from 'react'

import TextType from '@/components/TextType'
import { cn } from '@/lib/utils'

type SectionTitleProps = {
  text: string | string[]
  as?: ElementType
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  initialDelay?: number
  startOnVisible?: boolean
  variableSpeed?: { min: number; max: number }
  onSentenceComplete?: (sentence: string, index: number) => void
} & Record<string, unknown>

export function SectionTitle({
  text,
  as = 'h2',
  className,
  typingSpeed = 90,
  deletingSpeed = 60,
  pauseDuration = 2400,
  initialDelay = 160,
  startOnVisible = true,
  ...props
}: SectionTitleProps) {
  const shouldLoop = Array.isArray(text) && text.length > 1

  return (
    <TextType
      text={text}
      as={as}
      className={cn('font-bold', className)}
      typingSpeed={typingSpeed}
      deletingSpeed={deletingSpeed}
      pauseDuration={pauseDuration}
      initialDelay={initialDelay}
      loop={shouldLoop}
      showCursor={false}
      hideCursorWhileTyping
      startOnVisible={startOnVisible}
      {...props}
    />
  )
}
