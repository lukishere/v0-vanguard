# 🚀 Guía de Deployment - Sistema de Demos

Guía completa para desplegar y mantener el sistema de demos interactivas en producción.

## 🏗️ Arquitectura de Deployment

```
┌─────────────────┐    ┌─────────────────┐
│   Main App      │    │   Demos App     │
│   (Next.js)     │    │   (Next.js)     │
│                 │    │                 │
│ - Dashboard     │    │ - Copilot Demo  │
│ - User Mgmt     │    │ - Insights Demo │
│ - Analytics     │    │ - Dashboard Demo│
└─────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Vercel        │
│   (Production)  │    │   (Production)  │
└─────────────────┘    └─────────────────┘
```

---

## 📋 Pre-requisitos

### Requisitos Técnicos
- ✅ Node.js 18+ instalado
- ✅ Cuenta de Vercel configurada
- ✅ Git repository configurado
- ✅ Variables de entorno preparadas

### Requisitos de Seguridad
- ✅ Certificados SSL válidos
- ✅ Headers de seguridad configurados
- ✅ Variables sensibles en producción
- ✅ Access controls implementados

---

## 🚀 Proceso de Deployment

### Paso 1: Preparación del Entorno

#### Variables de Entorno - Main App
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database
DATABASE_URL=postgresql://...

# Firebase (si aplica)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# URLs de Demos
NEXT_PUBLIC_DEMOS_BASE_URL=https://vanguard-demos.vercel.app
```

#### Variables de Entorno - Demos App
```bash
# .env.local
NEXT_PUBLIC_MAIN_APP_URL=https://vanguard-main.vercel.app

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Paso 2: Build y Testing Local

#### Build de Main App
```bash
# En directorio raíz
npm run build

# Verificar build exitoso
npm run start

# Test en localhost:3000
```

#### Build de Demos App
```bash
# En directorio demos-app
cd demos-app
npm run build

# Verificar build exitoso
npm run start

# Test en localhost:3001
```

#### Tests de Integración
```bash
# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Paso 3: Deployment a Vercel

#### Configuración de Proyectos

##### Proyecto 1: Main App
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy main app
vercel --prod

# Configurar dominio
vercel domains add vanguard-main.vercel.app
```

##### Proyecto 2: Demos App
```bash
# Desde directorio demos-app
cd demos-app

# Inicializar proyecto separado
vercel --prod

# Configurar dominio
vercel domains add vanguard-demos.vercel.app
```

### Paso 4: Configuración Post-Deployment

#### Actualizar URLs en Catálogo
```typescript
// lib/demos/catalog.ts
export const DEMO_CATALOG: Demo[] = [
  {
    id: "vanguard-copilot",
    interactiveUrl: "https://vanguard-demos.vercel.app/demos/copilot",
    // ... otros campos
  },
  {
    id: "insights360",
    interactiveUrl: "https://vanguard-demos.vercel.app/demos/insights",
    // ... otros campos
  }
]
```

#### Configurar CSP con Dominios Reales
```typescript
// next.config.mjs (main app)
{
  key: 'Content-Security-Policy',
  value: [
    "frame-src 'self' https://vanguard-demos.vercel.app",
    "frame-ancestors 'self'"
  ].join('; ')
}
```

#### Configurar Headers en Demos App
```typescript
// demos-app/next.config.mjs
{
  key: 'X-Frame-Options',
  value: 'ALLOW-FROM https://vanguard-main.vercel.app'
},
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors 'self' https://vanguard-main.vercel.app"
}
```

---

## 🔍 Verificación Post-Deployment

### Checklist de Verificación

#### ✅ Funcionalidad Básica
```bash
# Verificar que apps responden
curl -I https://vanguard-main.vercel.app/
curl -I https://vanguard-demos.vercel.app/

# Status esperado: 200 OK
```

#### ✅ Seguridad Implementada
```bash
# Verificar headers de seguridad
curl -I https://vanguard-main.vercel.app/ | grep -E "(X-Frame-Options|Content-Security-Policy)"

# Debe mostrar:
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: frame-src 'self' https://vanguard-demos.vercel.app
```

#### ✅ Iframes Funcionando
```bash
# Verificar que demos cargan
curl https://vanguard-demos.vercel.app/demos/copilot

# Status esperado: 200 OK con HTML válido
```

#### ✅ Integración Completa
1. ✅ Abrir dashboard principal
2. ✅ Hacer clic en "Abrir Demo"
3. ✅ Verificar que modal se abre
4. ✅ Confirmar que iframe carga la demo
5. ✅ Probar interactividad en la demo
6. ✅ Cerrar modal correctamente

---

## 📊 Monitoreo y Analytics

### Métricas a Monitorear

#### Performance
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 4s

#### Funcionalidad
- **Tasa de éxito de carga**: > 95%
- **Tasa de error de iframes**: < 5%
- **Tiempo promedio de sesión**: > 2 min

#### Seguridad
- **CSP violations**: = 0
- **Failed iframe loads**: < 1%
- **Rate limit hits**: < 0.1%

### Herramientas de Monitoreo

#### Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Custom Event Tracking
```typescript
// contexts/demo-context.tsx
const trackDemoEvent = (event: string, data: any) => {
  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: event,
      properties: data
    })
  }

  // Custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event, data })
  })
}
```

---

## 🚨 Troubleshooting

### Problemas Comunes y Soluciones

#### ❌ "Failed to load iframe"
```bash
# Verificar URL de demo
curl https://vanguard-demos.vercel.app/demos/copilot

# Verificar CORS headers
curl -I https://vanguard-demos.vercel.app/demos/copilot | grep -i "access-control"

# Solución: Actualizar CSP en demos-app
```

#### ❌ "CSP violation"
```bash
# Revisar console del navegador
# Buscar: "Content Security Policy violation"

# Solución: Agregar dominio a frame-src
# next.config.mjs
{
  key: 'Content-Security-Policy',
  value: "frame-src 'self' https://vanguard-demos.vercel.app"
}
```

#### ❌ "X-Frame-Options deny"
```bash
# Verificar headers actuales
curl -I https://vanguard-demos.vercel.app/ | grep "X-Frame-Options"

# Solución: Cambiar a ALLOW-FROM
{
  key: 'X-Frame-Options',
  value: 'ALLOW-FROM https://vanguard-main.vercel.app'
}
```

#### ❌ Demo no se abre
```bash
# Verificar DemoContext
console.log('DemoContext:', useDemo())

# Verificar estado de demo
console.log('Demo status:', demo.status)

# Solución: Verificar configuración en catálogo
```

---

## 🔄 Actualizaciones y Rollbacks

### Proceso de Actualización

#### 1. Preparación
```bash
# Crear branch de actualización
git checkout -b feature/demo-updates

# Hacer cambios
# ... modificar código ...

# Tests locales
npm test
npm run build
```

#### 2. Deploy de Prueba
```bash
# Deploy a preview
vercel --prod=false

# Verificar en URL de preview
# https://vanguard-main-git-feature-demo-updates.vercel.app
```

#### 3. Deploy a Producción
```bash
# Merge a main
git checkout main
git merge feature/demo-updates

# Deploy production
vercel --prod

# Verificar funcionamiento
```

### Rollback Plan

#### Rollback Inmediato
```bash
# Revertir último commit
git revert HEAD --no-edit
git push origin main

# Redeploy
vercel --prod
```

#### Rollback a Versión Específica
```bash
# Ver commits recientes
git log --oneline -10

# Revertir a commit específico
git revert <commit-hash>
git push origin main

# Redeploy
vercel --prod
```

#### Rollback de Variables
```bash
# En Vercel dashboard
# Project Settings > Environment Variables
# Revertir valores problemáticos
```

---

## 📈 Optimización de Performance

### Optimizaciones Implementadas

#### 1. Lazy Loading
```typescript
// Iframes con lazy loading
<iframe
  loading="lazy"
  // ... otros atributos
/>
```

#### 2. Code Splitting
```typescript
// Dynamic imports para componentes pesados
const DemoModal = dynamic(() => import('@/components/dashboard/demo-modal'), {
  loading: () => <div>Loading demo...</div>
})
```

#### 3. Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image'

<Image
  src="/demo-screenshot.jpg"
  alt="Demo preview"
  width={800}
  height={600}
  loading="lazy"
/>
```

#### 4. Caching Strategy
```typescript
// API routes con cache
export const revalidate = 3600 // 1 hora

export async function GET() {
  // Datos cacheados por 1 hora
}
```

### Métricas de Performance

#### Lighthouse Scores Target
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

#### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 🔧 Mantenimiento

### Tareas de Mantenimiento Semanal

#### ✅ Revisión de Logs
```bash
# Verificar errores en Vercel dashboard
# Logs > Functions/Edge Functions

# Buscar patrones de error
grep "ERROR" logs.txt
grep "CSP" logs.txt
```

#### ✅ Actualización de Dependencias
```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Rebuild y redeploy si es necesario
```

#### ✅ Monitoreo de Performance
```bash
# Vercel Analytics
# Core Web Vitals trends

# Custom metrics
# Demo load times
# Error rates
```

### Tareas de Mantenimiento Mensual

#### ✅ Security Audit
```bash
# Ejecutar security audit
npm run security:audit

# Revisar headers de seguridad
curl -I https://vanguard-main.vercel.app/

# Verificar configuraciones CSP
```

#### ✅ Backup Verification
```bash
# Verificar que datos críticos están respaldados
# Database backups
# Configuration backups
# Code repository integrity
```

#### ✅ Performance Review
```bash
# Analizar métricas del mes
# Core Web Vitals
# User engagement metrics
# Error rates

# Implementar optimizaciones si es necesario
```

---

## 📞 Contactos y Soporte

### Equipo de Desarrollo
- **Lead Developer**: dev@vanguard.com
- **DevOps**: ops@vanguard.com
- **QA**: qa@vanguard.com

### Soporte de Vercel
- **Dashboard**: vercel.com/dashboard
- **Docs**: vercel.com/docs
- **Support**: vercel.com/support

### Monitoreo 24/7
- **Alerts**: Configurados para errores críticos
- **On-call**: Rotación semanal del equipo
- **Escalation**: Automática para P0 issues

---

## 📋 Checklist Final de Deployment

### Pre-Deployment ✅
- [x] Código probado localmente
- [x] Tests pasando
- [x] Build exitoso
- [x] Variables de entorno configuradas
- [x] Headers de seguridad verificados

### Deployment ✅
- [x] Main app desplegada en Vercel
- [x] Demos app desplegada en Vercel
- [x] Dominios configurados
- [x] URLs actualizadas en catálogo
- [x] CSP actualizado con dominios reales

### Post-Deployment ✅
- [x] Funcionalidad básica verificada
- [x] Seguridad implementada confirmada
- [x] Iframes funcionando correctamente
- [x] Performance metrics recolectando
- [x] Monitoreo configurado

### Go-Live ✅
- [x] Usuarios notificados (si aplica)
- [x] Runbooks actualizados
- [x] Equipo preparado para soporte
- [x] Rollback plan documentado

---

**Deployment completado**: ✅
**Fecha**: Noviembre 2025
**Versión desplegada**: 1.0.0
**Responsable**: DevOps Team

