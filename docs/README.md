# Documentation

This directory contains all project documentation, grouped by audience and intent.

## 📂 Top-Level Folders

| Folder | Purpose | Typical audience |
|--------|---------|------------------|
| `architecture/` | Codebase & infrastructure overview | Core developers, DevOps |
| `design/` | UI guidelines, visual system & motion rules | Designers, Front-end devs |
| `operations/` | Run-books, quick-fix guides & on-call playbooks | Support, SRE, Engineers |
| `planning/` | Road-maps, migration plans & high-level vision | Product, Leads |
| `security/` | Policies, best-practices & monitoring strategy | Security team, Leads |

## 🔗 Quick links

• Architecture docs → [`architecture/`](./architecture)
• Design system → [`design/`](./design)
• Operational run-books → [`operations/`](./operations)
• Road-maps & plans → [`planning/`](./planning)
• Security guidelines → [`security/`](./security)
• **Clerk Authentication** → [`clerk/`](./clerk) | [`operations/clerk-*.md`](./operations)

---

## 📚 Document Index

### 🏗️ Architecture
- [`architecture/overview.md`](./architecture/overview.md) - Visión general de la arquitectura del proyecto

### 🎨 Design
- [`design/ui-enhancement-roadmap.md`](./design/ui-enhancement-roadmap.md) - Roadmap de mejoras de UI
- [`design/z-index-matrix.md`](./design/z-index-matrix.md) - Matriz de z-index para componentes

### 🔧 Operations

#### User Management & Authentication
- [`operations/user-management-guide.md`](./operations/user-management-guide.md) - Guía completa de gestión de usuarios
- [`operations/admin-access-troubleshooting.md`](./operations/admin-access-troubleshooting.md) - Troubleshooting de acceso admin
- [`operations/clerk-session-token-config.md`](./operations/clerk-session-token-config.md) - Configuración de Session Token en Clerk
- [`operations/solucion-inmediata-admin.md`](./operations/solucion-inmediata-admin.md) - Solución inmediata para acceso admin
- [`operations/instrucciones-migracion-clerk.md`](./operations/instrucciones-migracion-clerk.md) - Instrucciones de migración a Clerk
- [`operations/client-role-policy.md`](./operations/client-role-policy.md) - Política de roles de clientes
- [`operations/role-based-redirect-guide.md`](./operations/role-based-redirect-guide.md) - Guía de redirección basada en roles

#### System Features
- [`operations/messages-system.md`](./operations/messages-system.md) - Sistema de mensajes
- [`operations/demo-persistence.md`](./operations/demo-persistence.md) - Persistencia de demos
- [`operations/automatic-news-update.md`](./operations/automatic-news-update.md) - Actualización automática de noticias

#### Chatbot & AI
- [`operations/guardbot.md`](./operations/guardbot.md) - Documentación del GuardBot
- [`operations/guardbot2.md`](./operations/guardbot2.md) - Documentación extendida del GuardBot
- [`operations/copilotkit-testing.md`](./operations/copilotkit-testing.md) - Testing de CopilotKit
- [`operations/copilotkit-network-error-resolution.md`](./operations/copilotkit-network-error-resolution.md) - Resolución de errores de red en CopilotKit
- [`operations/gemini-setup.md`](./operations/gemini-setup.md) - Configuración de Gemini
- [`operations/chatbot-welcome-automation.md`](./operations/chatbot-welcome-automation.md) - **NUEVO** Automatización de bienvenida del chatbot PORTAL

#### Troubleshooting
- [`operations/troubleshooting.md`](./operations/troubleshooting.md) - Guía general de troubleshooting
- [`operations/troubleshooting-server-actions.md`](./operations/troubleshooting-server-actions.md) - Troubleshooting de Server Actions
- [`operations/quick-fix-guide.md`](./operations/quick-fix-guide.md) - Guía de fixes rápidos

#### Research & Integration
- [`operations/linkedin-integration-research.md`](./operations/linkedin-integration-research.md) - Investigación de integración con LinkedIn

### 📋 Planning

#### Migration Plans
- [`planning/MIGRATION_PLAN.md`](./planning/MIGRATION_PLAN.md) - Plan de migración general
- [`planning/ACTIVITIES_MIGRATION_PLAN.md`](./planning/ACTIVITIES_MIGRATION_PLAN.md) - **NUEVO** Plan de migración del sistema de actividades
- [`planning/copilotkit-action-plan.md`](./planning/copilotkit-action-plan.md) - Plan de acción de CopilotKit

#### Research
- [`planning/local-chatbot-research.md`](./planning/local-chatbot-research.md) - Investigación de chatbot local

### 🔐 Security
- [`security/SECURITY.md`](./security/SECURITY.md) - Documentación de seguridad principal
- [`security/production-monitoring-strategy.md`](./security/production-monitoring-strategy.md) - Estrategia de monitoreo en producción
- [`security/maintenance-schedule.md`](./security/maintenance-schedule.md) - Calendario de mantenimiento
- [`security/target-level-achieved.md`](./security/target-level-achieved.md) - Nivel objetivo alcanzado
- [`security/implementation-summary.md`](./security/implementation-summary.md) - Resumen de implementación
- [`security/best-practices-comparison.md`](./security/best-practices-comparison.md) - Comparación de mejores prácticas

### 📄 General Documentation
- [`README.md`](./README.md) - Este archivo (índice de documentación)
- [`QUICK_START.md`](./QUICK_START.md) - Guía de inicio rápido
- [`VERIFICATION_CHECKLIST.md`](./VERIFICATION_CHECKLIST.md) - Checklist de verificación
- [`MIGRATION_CLERK_SUMMARY.md`](./MIGRATION_CLERK_SUMMARY.md) - Resumen de migración a Clerk
- [`ESTADO_PROYECTO.md`](./ESTADO_PROYECTO.md) - Estado actual del proyecto
- [`DEMO_LIKES_SYSTEM.md`](./DEMO_LIKES_SYSTEM.md) - Sistema de likes de demos

---

## 🆕 Documentos Recientes

### Noviembre 2025
- **`planning/ACTIVITIES_MIGRATION_PLAN.md`** - Plan completo de migración del sistema de actividades de archivo JSON a base de datos (Firestore/PostgreSQL)

---

## ✍️ Contributing new docs

1. Pick the folder above that matches your topic (create one if genuinely new).
2. Name files in **lowercase-kebab-case** (`my-new-guide.md`).
3. Start with a one-line summary; keep language concise & actionable.
4. Update this README table if you add a brand-new folder.
5. Remember our mantra: concise, clear and useful.
