"use client"

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextHeaderProps {
  phrases: string[];
  className?: string;
}

export default function AnimatedTextHeader({ phrases, className = "" }: AnimatedTextHeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure hydration compatibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      console.log('AnimatedTextHeader mounted with phrases:', phrases);
    }, 100); // Small delay to ensure proper hydration
    
    return () => clearTimeout(timer);
  }, [phrases]);

  useEffect(() => {
    if (!mounted || phrases.length === 0) return;
    
    console.log('Setting up animation interval');
    const interval = setInterval(() => {
      console.log('Animation cycle - hiding current text');
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % phrases.length;
          console.log('Switching to phrase index:', newIndex, phrases[newIndex]);
          return newIndex;
        });
        setIsVisible(true);
      }, 400);
    }, 5000);
    return () => {
      console.log('Cleaning up animation interval');
      clearInterval(interval);
    };
  }, [phrases.length, mounted, phrases]);

  // Show static fallback during SSR to avoid hydration mismatches
  const containerHeightClass = useMemo(() => {
    if (phrases.some((phrase) => phrase.length > 90)) {
      return "min-h-[6.5rem]";
    }
    if (phrases.some((phrase) => phrase.length > 60)) {
      return "min-h-[6rem]";
    }
    return "min-h-[5rem]";
  }, [phrases]);

  const sizeAdjustmentClass = useMemo(() => {
    if (phrases.some((phrase) => phrase.length > 90)) {
      return "text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3rem]";
    }
    if (phrases.some((phrase) => phrase.length > 60)) {
      return "text-[2.5rem] sm:text-4xl md:text-[2.9rem] lg:text-[3.25rem]";
    }
    return "";
  }, [phrases]);

  if (!mounted) {
    return (
      <div
        className={`w-full flex items-center overflow-hidden ${containerHeightClass}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          className={`${className} ${sizeAdjustmentClass} w-full block leading-tight`}
          style={{ lineHeight: 1.2, textWrap: "balance" as any }}
        >
          {phrases[0] || "Loading..."}
        </span>
      </div>
    );
  }

  const currentPhrase = phrases[currentIndex] || phrases[0] || "Default Text";
  console.log('AnimatedTextHeader: Rendering with phrase:', currentPhrase);

  return (
    <div
      className={`w-full flex items-center overflow-hidden ${containerHeightClass}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`${className} ${sizeAdjustmentClass} w-full block leading-tight`}
            style={{
              background: 'linear-gradient(45deg, #0047AB, #1E90FF, #4169E1)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s ease infinite',
              textAlign: 'left',
              lineHeight: 1.2,
              maxWidth: '100%',
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {currentPhrase}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
} 