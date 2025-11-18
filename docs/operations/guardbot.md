# GuardBot Operations Guide

## Overview
- **Purpose:** GuardBot delivers concise, bilingual support about VANGUARD services using local knowledge base content plus a Gemini safety net.
- **Entry points:** Web widget (`components/chatbot.tsx`) backed by the knowledge base context, and the callable Genkit flow deployed as a Firebase Function (`functions/lib/index.js`).
- **Key improvements (Nov 2025):** Shorter intent-driven answers, visual cues (intentos con iconos), hardened prompt guardrails, structured logging, y cobertura automatizada.

## Architecture
- **UI & Retrieval:** `components/chatbot.tsx` routes user messages through `useKnowledgeBase()`, retrieving semantic matches via `lib/knowledge-base/index.ts` and composing replies with `ResponseGenerator`.
- **Response generation:** `lib/knowledge-base/response-generator.ts` now:
  - Detects 10 guard-railled intents (services, AI optimisation, infrastructure, security, pricing, branding, integration, post-support, differentiators, getting-started) plus contact/about/FAQ fallbacks.
  - Injects role-specific messaging (consultor, arquitecto, especialista) with diagnostic questions, social proof (TechNova, Global Financial Group, HealthPlus), and clear CTAs as defined in `docs/operations/guardbot2.md`.
  - Añade iconos temáticos opcionales al inicio de la respuesta para reforzar el contexto sin saturar al cliente.
  - Entrega mensajes listos para cliente (sin etiquetas visibles de fuentes) manteniendo bullets concisos y datos verificables.
  - Supplies bilingual fallbacks referencing `contacto@vanguard-ia.tech`.
- **Cloud function:** `functions/src/genkit.ts` defines the `chat` flow with:
  - Zod validation (`message` 1–2000 chars, max 12 context turns, locale `en|es`).
  - Context trimming to the latest eight exchanges and whitespace sanitisation.
  - Guarded prompt describing tone, role adoption, required diagnostics, social proof references, and escalation rules.
  - Post-processing polish pass using Gemini para refinar el mensaje (tono consultivo, CTA clara) sin alterar hechos ni datos sensibles.
  - Structured debug/error logs via `firebase-functions/logger`.
  - Resilient fallbacks when Gemini errors or returns empty text.

## Operational Safeguards
- **Secrets:** Requires `GEMINI_API_KEY` (Firebase Secret Manager).
- **Access:** Callable function enforces App Check and verified email claim.
- **Error handling:** Any generation failure returns a branded, bilingual apology plus escalation contact; logs capture locale, message length, and stack traces.
- **Content limits:** Response generator clips features, enforces professional tone, and never fabricates pricing/contacts per system prompt.

## Testing & Maintenance
- **Unit tests:** Run `pnpm test -- --run` from the project root to execute `lib/knowledge-base/__tests__/response-generator.test.ts`, covering services, pricing, AI optimisation, infrastructure, differentiators, and fallback behaviour.
- **Functions build:** Compile Firebase functions with `pnpm exec tsc --project functions/tsconfig.json`; deploy artifacts live under `functions/lib`.
- **Monitoring:** Review Cloud Functions logs for `GuardBot request received` and `GuardBot generation failed` entries to spot anomalies quickly.
- **Content refresh:** When updating knowledge base files in `lib/content`, re-run the tests to ensure the summariser remains concise and sources stay accurate.

