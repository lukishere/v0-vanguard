# Global Z-Index Matrix

This file defines a single source of truth for stacking context across the VANGUARD-IA front-end. Always reference this table before introducing new fixed/absolute layers.

| Layer | `z-index` | Responsible Component / Selector |
|-------|-----------|----------------------------------|
| System Alerts / Modals | 100 | Modal portals, toast provider |
| Chatbot Bubble | 60 | `LiveChat` floating widget |
| Mobile Nav Overlay | 50 | Mobile nav drawer |
| Sticky Header | 30 | `<Header />` + drop shadow |
| **Particles Canvas** | 20 | `react-particles-background` full-screen canvas |
| Section Content | auto / 10 | Normal page content blocks |
| Decorative SVGs | 0 | `CircuitPattern`, other bg visuals |

> **Rule:** Anything interactive must sit **above** `Particles Canvas` (≥30) and anything purely decorative must sit **below** content (≤0) unless otherwise justified. 