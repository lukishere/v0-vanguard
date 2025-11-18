# Estado Actual del Proyecto - V0 Vanguard

**Fecha de Captura:** 12 de Diciembre, 2025  
**Rama Actual:** `changes-12-11-25`  
**Último Commit:** `8362088 - chore: save current work`

---

## 📊 Estado de Git

### Rama Actual
- **Rama:** `changes-12-11-25` (activa)
- **Commits Recientes:**
  - `8362088` - chore: save current work
  - `5366c85` - Merge pull request #2 from lukishere/changes04052025
  - `7e126ae` - Production deployment checkpoint - Website live and deployed
  - `01ab24d` - Merge pull request #1 from lukishere/changes02052025

### Cambios Pendientes

#### Archivos Modificados (No staged)
- `.gitignore`
- `app/about/page.tsx`
- `app/api/contact/route.ts`
- `app/contact/page.tsx`
- `app/events/page.tsx`
- `app/faq/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/news/page.tsx`
- `app/page.tsx`
- `app/privacy/page.tsx`
- `app/services/page.tsx`
- `app/terms/page.tsx`
- `components/animated-text-header.tsx`
- `components/blog-card.tsx`
- `components/chatbot.tsx`
- `components/client-review.tsx`
- `components/cta-button.tsx`
- `components/footer.tsx`
- `components/header.tsx`
- `components/service-card.tsx`
- `components/ui/chart.tsx`
- `contexts/knowledge-base-context.tsx`
- `contexts/language-context.tsx`
- `docs/security/SECURITY.md`
- `env.example`
- `functions/lib/index.js`
- `lib/knowledge-base/index.ts`
- `lib/validation.ts`
- `middleware.ts`
- `next.config.mjs`
- `package.json`
- `pnpm-lock.yaml`

#### Archivos Eliminados
- `functions/lib/functions/src/index.js`
- `functions/lib/functions/src/index.js.map`
- `functions/lib/functions/src/test-chat.js`
- `functions/lib/functions/src/test-chat.js.map`
- `functions/lib/lib/genkit.js`
- `functions/lib/lib/genkit.js.map`

#### Archivos Nuevos (Untracked)
- `app/api/events/`
- `app/clientes/`
- `app/dashboard/`
- `app/events/admin/`
- `components/CardSwap.css`
- `components/CardSwap.jsx`
- `components/ScrollStack.css`
- `components/ScrollStack.jsx`
- `components/Shuffle.css`
- `components/Shuffle.jsx`
- `components/SpotlightCard.module.css`
- `components/SpotlightCard.tsx`
- `components/TextType.css`
- `components/TextType.jsx`
- `components/admin/`
- `components/cta-arrow.tsx`
- `components/dashboard-logout-button.tsx`
- `components/dashboard/`
- `components/flowing-menu.tsx`
- `components/magic-bento.tsx`
- `components/section-title.tsx`
- `data/`
- `docs/operations/guardbot.md`
- `docs/operations/guardbot2.md`
- `functions/lib/genkit.js`
- `functions/src/`
- `functions/tsconfig.json`
- `lib/content/`
- `lib/demos/`
- `lib/events/`
- `lib/knowledge-base/__tests__/`
- `lib/knowledge-base/data-loader.ts`
- `lib/knowledge-base/response-generator.ts`
- `vitest.config.ts`

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

#### Frontend
- **Framework:** Next.js 15.3.1 (App Router)
- **React:** 19.x
- **TypeScript:** 5.x
- **Estilos:** Tailwind CSS 3.4.17
- **Animaciones:** Framer Motion, GSAP, Lenis
- **UI Components:** Radix UI (50+ componentes)
- **Autenticación:** Clerk (@clerk/nextjs 6.34.4)

#### Backend & Servicios
- **Firebase:** 
  - Firebase Functions
  - Firebase Data Connect
  - Firestore
- **AI/ML:**
  - CopilotKit (@copilotkit/react-core 1.9.0)
  - Google Generative AI (@google/generative-ai 0.24.1)
  - LangChain (0.2.20)
  - Xenova Transformers (@xenova/transformers 2.15.0) - para embeddings locales

#### Otras Dependencias Clave
- **Validación:** Zod 3.24.1
- **Formularios:** React Hook Form 7.54.1
- **Gráficos:** Recharts 2.15.0
- **Partículas:** React TSParticles 2.12.2
- **Email:** Nodemailer 6.10.1
- **Seguridad:** DOMPurify 3.2.6, Validator 13.15.15

### Estructura de Directorios

```
v0-vanguard/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── contact/       # Contact form API
│   │   ├── copilotkit/    # CopilotKit integration
│   │   ├── events/        # Events API
│   │   └── mission-control/
│   ├── about/             # About page
│   ├── clientes/          # Clients section
│   ├── contact/           # Contact page
│   ├── copilot-simple/    # CopilotKit test page
│   ├── copilot-test/      # CopilotKit advanced test
│   ├── dashboard/         # Dashboard page
│   ├── events/            # Events pages
│   │   └── admin/         # Events admin
│   ├── faq/               # FAQ page
│   ├── news/              # News/Blog section
│   ├── privacy/           # Privacy policy
│   ├── services/          # Services pages
│   ├── sign-in/           # Clerk sign-in
│   ├── sign-up/           # Clerk sign-up
│   ├── terms/             # Terms of service
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/            # React Components
│   ├── ui/               # UI primitives (50+ components)
│   ├── dashboard/        # Dashboard components
│   ├── admin/            # Admin components
│   ├── chatbot.tsx       # Chatbot component
│   ├── header.tsx        # Header component
│   ├── footer.tsx        # Footer component
│   └── ... (otros componentes)
│
├── contexts/             # React Contexts
│   ├── language-context.tsx      # Multi-language support
│   └── knowledge-base-context.tsx # Knowledge base context
│
├── lib/                  # Utilities & Helpers
│   ├── content/          # Content management
│   ├── demos/            # Demo data
│   ├── events/           # Events utilities
│   ├── knowledge-base/   # Knowledge base system
│   │   ├── data-loader.ts
│   │   ├── response-generator.ts
│   │   └── __tests__/
│   ├── firebase.ts       # Firebase config
│   ├── validation.ts    # Validation utilities
│   └── utils.ts          # General utilities
│
├── functions/            # Firebase Functions
│   ├── src/              # Source code
│   │   ├── genkit.ts     # Genkit flow
│   │   └── index.ts      # Main entry
│   └── lib/              # Compiled output
│
├── dataconnect/          # Firebase Data Connect
│   ├── connector/        # Connector config
│   └── schema/           # GraphQL schema
│
├── docs/                 # Documentation
│   ├── architecture/     # Architecture docs
│   ├── design/           # Design system
│   ├── operations/       # Operations guides
│   ├── planning/         # Planning docs
│   └── security/         # Security docs
│
├── data/                 # Data files
│   └── events.json       # Events data
│
├── public/               # Static assets
│   ├── images/           # Images
│   └── videos/           # Videos
│
└── hooks/                # Custom React hooks
```

---

## 🔧 Configuración

### Next.js (`next.config.mjs`)
- **Output:** API routes habilitadas (no static export)
- **Trailing Slash:** Habilitado
- **Images:** Unoptimized
- **Security Headers:** Configurados (X-Frame-Options, CSP, HSTS, etc.)
- **ESLint/TypeScript:** Ignorados durante builds

### TypeScript (`tsconfig.json`)
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** Preserve
- **Strict Mode:** Habilitado
- **Path Aliases:** `@/*` → `./*`

### Scripts Disponibles (`package.json`)
- `dev` - Desarrollo local
- `build` - Build de producción
- `start` - Iniciar servidor de producción
- `lint` - Linter
- `lint:security` - Linter de seguridad
- `security:audit` - Auditoría de seguridad
- `export` - Export estático
- `test` - Tests con Vitest

---

## 🎯 Características Principales

### 1. Sistema Multi-idioma
- Soporte para inglés y español
- Contexto de lenguaje (`language-context.tsx`)
- Traducciones en todos los componentes

### 2. Chatbot Inteligente
- **GuardBot:** Chatbot con base de conocimiento local
- Integración con CopilotKit
- Búsqueda semántica con embeddings locales (Xenova)
- Generación de respuestas con templates y reglas
- Integración con Gemini como fallback

### 3. Autenticación
- Clerk para autenticación de usuarios
- Páginas de sign-in y sign-up
- Dashboard protegido

### 4. Gestión de Eventos
- Sistema de eventos con admin panel
- API de eventos
- Página pública de eventos

### 5. Dashboard
- Panel de control para usuarios
- Componentes de dashboard personalizados
- Integración con Firebase

### 6. Base de Conocimiento
- Sistema de knowledge base con embeddings locales
- Búsqueda semántica
- Generación de respuestas estructuradas
- Soporte multi-idioma

### 7. Seguridad
- Headers de seguridad configurados
- Validación de inputs con Zod
- Sanitización con DOMPurify
- Documentación de seguridad en `docs/security/`

---

## 📝 Documentación Disponible

### Operaciones
- `docs/operations/guardbot.md` - Guía de operaciones del GuardBot
- `docs/operations/guardbot2.md` - Documentación extendida del GuardBot
- `docs/operations/automatic-news-update.md`
- `docs/operations/troubleshooting.md`
- `docs/operations/quick-fix-guide.md`
- `docs/operations/linkedin-integration-research.md`

### Arquitectura
- `docs/architecture/overview.md` - Visión general de la arquitectura

### Diseño
- `docs/design/ui-enhancement-roadmap.md`
- `docs/design/z-index-matrix.md`

### Planificación
- `docs/planning/MIGRATION_PLAN.md`
- `docs/planning/local-chatbot-research.md`

### Seguridad
- `docs/security/SECURITY.md`
- `docs/security/production-monitoring-strategy.md`
- `docs/security/maintenance-schedule.md`
- `docs/security/target-level-achieved.md`
- `docs/security/implementation-summary.md`
- `docs/security/best-practices-comparison.md`

### Otros
- `COPILOTKIT_TESTING.md` - Guía de testing de CopilotKit
- `COPILOTKIT_ACTION_PLAN.md` - Plan de acción de CopilotKit
- `COPILOTKIT_NETWORK_ERROR_RESOLUTION.md` - Resolución de errores
- `GEMINI_SETUP.md` - Configuración de Gemini

---

## 🔐 Variables de Entorno

Archivo de ejemplo: `env.example`

Variables requeridas (verificar en `env.example`):
- Variables de Clerk
- Variables de Firebase
- API keys de servicios externos
- Configuración de Gemini/OpenAI

---

## 🚀 Estado de Desarrollo

### Funcionalidades Completadas ✅
- Sistema multi-idioma
- Chatbot con base de conocimiento local
- Integración con CopilotKit
- Autenticación con Clerk
- Dashboard básico
- Sistema de eventos
- Páginas principales (Home, About, Services, Contact, FAQ, etc.)
- Sistema de seguridad con headers
- Validación de formularios

### En Desarrollo 🚧
- Mejoras en el sistema de eventos
- Optimizaciones del chatbot
- Nuevos componentes de UI
- Mejoras en el dashboard

### Pendientes 📋
- Tests automatizados completos
- Optimización de rendimiento
- Documentación de API
- Mejoras de accesibilidad

---

## 📦 Dependencias Principales

### Core
- `next`: 15.3.1
- `react`: ^19
- `react-dom`: ^19
- `typescript`: ^5

### UI & Estilos
- `tailwindcss`: ^3.4.17
- `framer-motion`: ^12.9.4
- `gsap`: ^3.13.0
- `@radix-ui/*`: Múltiples componentes UI

### Backend & Servicios
- `firebase`: ^11.6.1
- `@clerk/nextjs`: ^6.34.4
- `nodemailer`: ^6.10.1

### AI & ML
- `@copilotkit/react-core`: ^1.9.0
- `@google/generative-ai`: ^0.24.1
- `langchain`: ^0.2.20
- `@xenova/transformers`: ^2.15.0

### Utilidades
- `zod`: ^3.24.1
- `react-hook-form`: ^7.54.1
- `date-fns`: 4.1.0
- `dompurify`: ^3.2.6

---

## 🎨 Componentes UI Principales

- **Header** - Navegación principal con multi-idioma
- **Footer** - Pie de página con enlaces
- **Chatbot** - Widget de chat interactivo
- **ServiceCard** - Tarjetas de servicios
- **BlogCard** - Tarjetas de blog/noticias
- **ClientReview** - Reseñas de clientes
- **CTAButton** - Botones de llamada a la acción
- **Dashboard Components** - Componentes del dashboard
- **Admin Components** - Componentes de administración

---

## 🔄 Próximos Pasos Recomendados

1. **Revisar cambios pendientes** y decidir qué commitear
2. **Ejecutar tests** para verificar que todo funciona
3. **Revisar documentación** y actualizar si es necesario
4. **Verificar variables de entorno** en producción
5. **Optimizar rendimiento** del chatbot y componentes pesados

---

## 📌 Notas Importantes

- El proyecto está en la rama `changes-12-11-25`
- Hay muchos cambios sin commitear (modificados y nuevos archivos)
- El sistema de chatbot está funcionando con embeddings locales
- La integración con CopilotKit está operativa pero con limitaciones
- Firebase Functions están configuradas con Genkit
- El proyecto usa pnpm como gestor de paquetes

---

**Última actualización:** 12 de Diciembre, 2025  
**Mantenido por:** Equipo de desarrollo VANGUARD-IA


