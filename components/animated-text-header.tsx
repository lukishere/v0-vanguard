import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextHeaderProps {
  phrases: string[];
  className?: string;
}

export default function AnimatedTextHeader({ phrases, className = "" }: AnimatedTextHeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  // Animation variants (more subtle)
  const phraseVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06, // slightly slower
        duration: 0.32 // slightly slower
      }
    })
  };

  const currentPhrase = phrases[currentIndex];
  const words = currentPhrase.split(/(\s+)/); // split by spaces, keep spaces

  // Always use brand blue for text
  // text-vanguard-blue is the Tailwind class for your brand blue
  return (
    <div
      className={`inline-block ${className} text-vanguard-blue text-2xl md:text-3xl font-bold`}
      style={{ whiteSpace: 'pre-line', wordBreak: 'keep-all' }}
    >
      <motion.div
        key={currentIndex}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={phraseVariants}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {words.map((word, wIdx) =>
          word.trim() === '' ? (
            <span key={wIdx}>{word}</span>
          ) : (
            <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word.split("").map((letter: string, index: number) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                  style={{ textShadow: "0 0 2px rgba(30, 64, 175, 0.15)" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          )
        )}
      </motion.div>
    </div>
  );
} 