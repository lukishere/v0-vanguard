# VANGUARD-IA Quick Fix Guide

## 🚨 Emergency Fixes

### CSS Not Loading (Raw HTML)
```bash
# 1. Check CSP headers in next.config.mjs
# 2. Remove Content-Security-Policy temporarily
# 3. Hard refresh browser (Ctrl+F5)
npm run build && npm start
```

### Client-Side Exception Error
```bash
# 1. Add hydration safety to components
if (typeof window === 'undefined') return;
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <div>Loading...</div>;
```

### Language Switcher Not Working
```bash
# 1. Check for CSP 'strict-dynamic' blocking
# 2. Simplify onClick handlers
# 3. Add console.log to debug
```

### Particle Background Missing
```bash
# 1. Check z-index conflicts
# 2. Remove duplicate particle systems
# 3. Verify canvas initialization
```

### Animated Titles Not Working
```bash
# 1. Check browser console for AnimatedTextHeader logs
# 2. Verify component mounting and phrase switching
# 3. Check for hydration mismatches
# 4. Add SSR fallback to prevent hydration errors
# 5. Use setTimeout for proper client-side mounting
```

### Hydration Mismatch Fix
```jsx
// components/animated-text-header.tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setMounted(true);
  }, 100); // Small delay for proper hydration
  return () => clearTimeout(timer);
}, []);

// Show static fallback during SSR
if (!mounted) {
  return <h1 className="...">{phrases[0]}</h1>;
}
```

### Debug Console Commands
```javascript
// Check if AnimatedTextHeader is mounted
console.log('AnimatedTextHeader mounted with phrases:', phrases);

// Check particle initialization
console.log('ParticleBackground: Initialized', particleCount, 'particles');

// Check canvas dimensions
console.log('ParticleBackground: Canvas initialized', canvas.width, canvas.height);
```

### Background Consistency Issues
```bash
# 1. Compare home vs about page background effects
# 2. Add missing CircuitPattern components
# 3. Match opacity and color settings
# 4. Ensure proper z-index layering
```

### Title Layout Shifts
```bash
# 1. Reduce font sizes from text-6xl to text-5xl max
# 2. Use fixed-height containers (min-h-[8rem])
# 3. Add proper line-height and word-wrap
# 4. Increase animation timing for readability
```

### CircuitPattern Integration
```jsx
// Add to sections for consistent background
<section className="vanguard-section bg-white relative">
  <CircuitPattern opacity={0.02} />
  <div className="vanguard-container relative z-10">
    {/* content */}
  </div>
</section>
```

### Layout Shift Prevention
```jsx
// Fixed container sizing
<div className="w-full min-h-[8rem] sm:min-h-[9rem] lg:min-h-[10rem] flex items-center justify-start">
  <AnimatedTextHeader 
    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-vanguard-blue leading-tight" 
  />
</div>
```

---

## 🔧 Safe Component Patterns

### SSR-Safe framer-motion Component
```jsx
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafeAnimatedComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="fallback">Loading...</div>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        Content
      </motion.div>
    </AnimatePresence>
  );
}
```

### Safe Canvas Component
```jsx
"use client"
import { useEffect, useRef } from 'react';

export function SafeCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Canvas logic here
    
    return () => {
      // Cleanup
    };
  }, []);
  
  return <canvas ref={canvasRef} />;
}
```

---

## 🛡️ Security Headers (Safe Config)

```javascript
// next.config.mjs - Working configuration
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        }
        // NOTE: CSP removed for Next.js 15+ compatibility
      ]
    }
  ]
}
```

---

## 📱 Testing Checklist

- [ ] Hard refresh (Ctrl+F5)
- [ ] Check browser console for errors
- [ ] Test on different browsers
- [ ] Verify responsive design
- [ ] Test language switching
- [ ] Check particle animations
- [ ] Verify all navigation links
- [ ] Test contact forms

---

*Quick Fix Guide - Last Updated: 2024-12-19* 