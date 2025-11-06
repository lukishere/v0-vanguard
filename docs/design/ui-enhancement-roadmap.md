# UI & Visual Enhancement Roadmap

**Project:** VANGUARD-IA Front-End
**Date:** 2025-06-13
**Owner:** Front-End Guild

---

## 🎯 Objective
Deliver a **sleek, elegant and professional** visual experience across all pages while maximising performance and accessibility. Key focuses:
1. Particle background polish (speed, fade-out, density, colour harmony)
2. Consistent section theming & spacing
3. Layer (z-index) governance system
4. Subtle micro-interactions & motion guidelines
5. Responsive typography & readability
6. Design QA checklist & KPI metrics

---

## 🗺️ 10-Step Implementation Plan

| Step | Task | Key Files | Outcome |
|------|------|-----------|---------|
| 1 | **Audit Current UI** – capture full-page screenshots (desktop + mobile) and list visual inconsistencies | — | Baseline reference deck (Figma board) |
| 2 | **Particle Behaviour Tuning**<br/>• Decrease `move.speed` from **1 → 0.3**<br/>• Add `life` options to make dots fade / respawn (react-tsparticles supports `life` config)<br/>• Lower links opacity **0.25 → 0.15**<br/>| `components/react-particles-background.tsx` | Calm, elegant backdrop; no distraction |
| 3 | **Z-Index Matrix Definition** – single source of truth (MD table) | `docs/z-index-matrix.md` | Prevent future layering regressions |
| 4 | **Section Padding & Rhythm** – standardise vertical spacing `py-20 md:py-24` via `vanguard-section` class | `app/globals.css` | Cohesive flow between sections |
| 5 | **Colour & Contrast Pass** – validate WCAG AA for text/background combos; adjust shades where needed | `tailwind.config.ts`, CSS | Accessibility compliance |
| 6 | **Micro-interactions Library** – curate 6 reusable motion variants (fade-in-up, subtle-zoom, etc.) using `framer-motion` | `components/animations.tsx` | Consistent, performant animations |
| 7 | **Typography Scale Review** – adopt 8-point modular scale, ensure no font < 14 px | `app/globals.css`, content files | Readability across devices |
| 8 | **Iconography Alignment** – switch to `lucide-react` icons set; unify stroke width & colour | Component imports | Visual consistency |
| 9 | **Design QA Sprint** – Lighthouse, Axe, and manual visual QA on staging URL | — | ≥ 95 performance & accessibility score |
| 10 | **Documentation & Handoff** – update `docs/design-system.md`, record decisions, create changelog | docs/ | Sustainable design system |

---

## ⏳ Suggested Timeline
| Week | Focus |
|------|-------|
| 1 | Steps 1-3 (audit, particles tuning, z-index matrix) |
| 2 | Steps 4-6 (spacing, colours, micro-interactions library) |
| 3 | Steps 7-9 (typography, icons, QA sprint) |
| 4 | Step 10 – documentation & final polish |

---

## 🔖 Particle Tuning Snippet (Reference)
```ts
// react-particles-background.tsx (planned changes)
particles: {
  move: { enable: true, speed: 0.3, direction: "none" },
  life: { duration: { sync: false, value: 6 },
          count: 0,
          delay: { sync: false, value: 2 } },
  links: { opacity: 0.15 },
}
```

---

## 📐 Z-Index Matrix (draft)
| Layer | z-index | Element |
|-------|---------|---------|
| Global Modals / Toasts | 100 | Modal portals |
| Chatbot | 60 | `LiveChat` |
| Header & Mobile Nav | 30 | Sticky nav bar |
| **Particles Canvas** | 20 | `react-tsparticles` |
| Section Content | auto/10 | page sections |
| CircuitPattern SVG | 0 | decorative bg |

---

## ✅ Success Metrics
* Lighthouse performance ≥ **95**
* Accessibility violations = **0 critical**
* CLS < **0.02**
* FCP ≤ **1.5 s** on 3G simulated
* Visual regression tests pass (Chromatic diff)

---

## 📢 Next Actions
1. Confirm plan with design lead & product owner.
2. Book sprint tickets for Week 1 tasks.
3. Begin implementation with a protected `ui-enhancement` Git branch. 