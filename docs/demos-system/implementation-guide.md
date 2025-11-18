# 📚 Guía de Implementación - Sistema de Demos

Guía completa paso a paso para implementar y mantener el sistema de demos interactivas.

## 🎯 Objetivos de Implementación

- ✅ Sistema seguro de iframes embebidos
- ✅ Experiencia de usuario fluida
- ✅ Arquitectura modular y escalable
- ✅ Analytics y métricas integradas
- ✅ Deployment automatizado

---

## 📋 Checklist de Implementación Completo

### ✅ **FASE 1: Configuración de Seguridad**

#### 1.1 Modificar Headers de Seguridad
```typescript
// Archivo: next.config.mjs
// Estado: ✅ COMPLETADO

async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        // Cambiar DENY por SAMEORIGIN
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        // CSP para iframes seguros
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'self'",
            "frame-src 'self' https://*.vercel.app https://*.web.app",
            "object-src 'none'",
            "base-uri 'self'"
          ].join('; ')
        }
      ]
    }
  ]
}
```

#### 1.2 Verificación de Seguridad
```bash
# Comando para verificar headers
curl -I https://tu-app.vercel.app/

# Debe mostrar:
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: frame-src 'self' https://*.vercel.app...
```

---

### ✅ **FASE 2: DemoContext - Gestión de Estado**

#### 2.1 Crear DemoContext
```typescript
// Archivo: contexts/demo-context.tsx
// Estado: ✅ COMPLETADO

interface DemoContextType {
  activeDemo: Demo | null
  openDemo: (demo: Demo) => Promise<void>
  closeDemo: () => void
  demoHistory: Demo[]
  isLoading: boolean
  error: string | null
}
```

#### 2.2 Integrar en Layout Principal
```typescript
// Archivo: app/layout.tsx
// Estado: ✅ COMPLETADO

import { DemoProvider } from '@/contexts/demo-context'

export default function RootLayout({ children }: ReactNode) {
  return (
    <DemoProvider>
      {/* ... otros providers ... */}
      {children}
    </DemoProvider>
  )
}
```

#### 2.3 Hook de Uso Adicional
```typescript
// Archivo: contexts/demo-context.tsx
// Hook adicional para validaciones

export function useDemoAvailability(demo: Demo | null) {
  const { demoHistory } = useDemo()

  return {
    isAvailable: demo?.status === 'active' && !!demo?.interactiveUrl,
    isRecentlyOpened: demo ? demoHistory.some(d => d.id === demo.id) : false,
    hasValidUrl: !!demo?.interactiveUrl,
    canOpen: demo?.status === 'active' && !!demo?.interactiveUrl
  }
}
```

---

### ✅ **FASE 3: Actualización de Componentes**

#### 3.1 Actualizar DemoModal
```typescript
// Archivo: components/dashboard/demo-modal.tsx
// Estado: ✅ COMPLETADO

// ✅ Atributos de seguridad implementados
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
  referrerPolicy="strict-origin-when-cross-origin"
  allow="clipboard-read; clipboard-write; camera; microphone; geolocation; autoplay; encrypted-media"
  loading="lazy"
/>

// ✅ Estados de loading y error
const [iframeLoaded, setIframeLoaded] = useState(false)
const [iframeError, setIframeError] = useState(false)
```

#### 3.2 Actualizar DemoCard
```typescript
// Archivo: components/dashboard/demo-card.tsx
// Estado: ✅ COMPLETADO

// ✅ Integración con contexto
const { openDemo, isLoading, error } = useDemo()

// ✅ Estados visuales por tipo
const handleOpenDemo = async () => {
  if (demo.interactiveUrl) {
    await openDemo(demo)
    setShowDemoModal(true)
  }
}
```

---

### ✅ **FASE 4: Hosting y Deployment**

#### 4.1 Estructura de Aplicación de Demos
```
demos-app/
├── app/
│   ├── demos/
│   │   ├── copilot/page.tsx
│   │   ├── insights/page.tsx
│   │   └── dashboard/page.tsx
│   └── layout.tsx
├── next.config.mjs
└── package.json
```

#### 4.2 Configuración de Headers para Demos
```typescript
// Archivo: demos-app/next.config.mjs
// Estado: ✅ COMPLETADO

async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'ALLOW-FROM https://tu-main-app.vercel.app'
        },
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://tu-main-app.vercel.app"
        }
      ]
    }
  ]
}
```

#### 4.3 Páginas de Demo Implementadas
```typescript
// demos-app/app/demos/copilot/page.tsx ✅
// demos-app/app/demos/insights/page.tsx ✅
// demos-app/app/demos/dashboard/page.tsx ✅
```

---

### ✅ **FASE 5: Testing y Validación**

#### 5.1 Tests Unitarios Creados
```typescript
// ✅ DemoContext tests
__tests__/contexts/demo-context.test.tsx

// ✅ DemoModal tests
__tests__/components/demo-modal.test.tsx

// ✅ DemoCard tests
__tests__/components/demo-card.test.tsx
```

#### 5.2 Casos de Test Cubiertos
- ✅ Apertura y cierre de demos
- ✅ Estados de loading y error
- ✅ Validación de URLs
- ✅ Historial de demos
- ✅ Atributos de seguridad
- ✅ Estados visuales por tipo de demo

---

### ✅ **FASE 6: Documentación Completa**

#### 6.1 Documentos Creados
- ✅ **README.md**: Documentación principal del sistema
- ✅ **implementation-guide.md**: Esta guía detallada
- ✅ **security-guide.md**: Mejores prácticas de seguridad
- ✅ **deployment-guide.md**: Guía de deployment
- ✅ **troubleshooting.md**: Solución de problemas comunes

---

## 🚀 Guía de Deployment

### Preparación para Producción

#### 1. Variables de Entorno
```bash
# .env.local (main app)
NEXT_PUBLIC_DEMOS_BASE_URL=https://tu-demos-app.vercel.app

# .env.local (demos app)
NEXT_PUBLIC_MAIN_APP_URL=https://tu-main-app.vercel.app
```

#### 2. Build y Deploy
```bash
# Main App
npm run build
npm run start

# Demos App
cd demos-app
npm run build
npm run start

# O deploy a Vercel
vercel --prod
```

#### 3. Verificación Post-Deploy
```bash
# Verificar headers de seguridad
curl -I https://tu-main-app.vercel.app/

# Verificar que demos cargan
curl https://tu-demos-app.vercel.app/demos/copilot

# Probar iframe embedding
# Abrir demo desde dashboard principal
```

---

## 🔍 Verificación Final

### Checklist de Verificación

#### Seguridad ✅
- [x] X-Frame-Options configurado correctamente
- [x] CSP incluye frame-src apropiados
- [x] Iframes tienen atributos sandbox
- [x] Origins validados

#### Funcionalidad ✅
- [x] DemoContext funciona correctamente
- [x] Modales abren y cierran apropiadamente
- [x] Estados de loading mostrados
- [x] Errores manejados gracefully
- [x] Analytics integrados

#### Performance ✅
- [x] Lazy loading en iframes
- [x] Estados de loading optimizados
- [x] Historial limitado a 10 items
- [x] Bundle splitting apropiado

#### UX/UI ✅
- [x] Estados visuales claros por tipo de demo
- [x] Información de expiración visible
- [x] Feedback integrado
- [x] Responsive design

### Testing Manual

#### 1. Flujo Básico
1. ✅ Abrir dashboard principal
2. ✅ Hacer clic en "Abrir Demo" en una demo activa
3. ✅ Verificar que modal se abre con loading
4. ✅ Confirmar que iframe carga correctamente
5. ✅ Probar funcionalidades dentro de la demo
6. ✅ Cerrar modal y verificar limpieza de estado

#### 2. Estados de Error
1. ✅ Intentar abrir demo sin URL → Error mostrado
2. ✅ Simular error de carga → Mensaje apropiado
3. ✅ Verificar recuperación de errores

#### 3. Seguridad
1. ✅ Verificar que CSP bloquea scripts no autorizados
2. ✅ Confirmar sandboxing funciona
3. ✅ Validar que solo origins permitidos pueden embed

---

## 📊 Métricas de Éxito

### KPIs Principales
- **Tasa de Apertura**: > 70% de demos activas abiertas
- **Tiempo de Carga**: < 3 segundos promedio
- **Tasa de Error**: < 5% de errores al cargar
- **Satisfacción**: > 4.5/5 en feedback

### Monitoreo Continuo
- Logs de apertura de demos
- Errores de CSP violations
- Performance metrics de iframes
- Feedback y ratings de usuarios

---

## 🚨 Plan de Rollback

### En Caso de Problemas

#### 1. Rollback de Headers
```typescript
// Revertir X-Frame-Options
{
  key: 'X-Frame-Options',
  value: 'DENY'  // Valor original
}
```

#### 2. Rollback de Código
```bash
# Revertir a commit anterior
git revert HEAD~1
git push origin main
```

#### 3. Comunicación con Usuarios
- Notificar sobre mantenimiento temporal
- Proporcionar acceso alternativo a demos
- Estimar tiempo de resolución

---

## 🎉 Conclusión

El sistema de demos interactivas ha sido implementado completamente siguiendo las mejores prácticas de:

- **Seguridad**: Headers CSP, sandboxing, validación de origins
- **Experiencia**: Estados de loading, manejo de errores, feedback integrado
- **Arquitectura**: Context API, componentes modulares, aplicación separada
- **Mantenibilidad**: Tests unitarios, documentación completa, logging

El sistema está listo para producción y puede escalar para múltiples tipos de demos con diferentes niveles de complejidad.

---

**Implementado por**: V0 Vanguard Team
**Fecha**: Noviembre 2025
**Versión**: 1.0.0

