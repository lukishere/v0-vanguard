# 🚀 Sistema de Demos Interactivas

Sistema completo para gestionar y desplegar demos interactivas en iframe con seguridad avanzada y experiencia de usuario optimizada.

## 📋 Resumen Ejecutivo

Este sistema permite a los clientes interactuar con demos de productos de manera segura a través de iframes embebidos, con:

- ✅ **Seguridad avanzada**: Headers CSP, sandboxing y validación de orígenes
- ✅ **Experiencia fluida**: Context API para gestión de estado, loading states y manejo de errores
- ✅ **Arquitectura modular**: Aplicación separada para demos con deployment independiente
- ✅ **Analytics integrado**: Tracking de uso y engagement de demos
- ✅ **Multi-tenancy**: Soporte para múltiples demos con contextos aislados

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   DemoContext   │    │   DemoModal     │
│   Principal     │◄──►│   Provider      │◄──►│   (Iframe)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DemoCard      │    │   Activity      │    │   Demo App      │
│   Component     │    │   Logging       │    │   Separada      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes Principales

#### 1. **DemoContext** (`contexts/demo-context.tsx`)
- Gestión centralizada del estado de demos
- Historial de demos abiertas (máx. 10)
- Integración con analytics (gtag)
- Manejo de errores y loading states
- Validación de URLs interactivas

#### 2. **DemoModal** (`components/dashboard/demo-modal.tsx`)
- Modal responsivo con iframe embebido
- Atributos de seguridad avanzados:
  - `sandbox`: Control granular de permisos
  - `referrerPolicy`: Control de referrer
  - `allow`: Permisos específicos (camera, clipboard, etc.)
- Estados de loading y error
- Feedback integrado

#### 3. **DemoCard** (`components/dashboard/demo-card.tsx`)
- Estados visuales por tipo de demo (activa, expirada, en desarrollo)
- Información de expiración y uso
- Botones contextuales según estado
- Integración con contexto para apertura

#### 4. **Aplicación de Demos** (`demos-app/`)
- Aplicación Next.js separada
- Páginas individuales por demo
- Headers de seguridad para iframes
- Optimizada para embedding

## 🔒 Seguridad Implementada

### Headers de Seguridad (Main App)

```typescript
// next.config.mjs
{
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': [
    "default-src 'self'",
    "frame-src 'self' https://*.vercel.app https://*.web.app",
    "frame-ancestors 'self'",
    // ... más directivas
  ].join('; ')
}
```

### Atributos de Iframe Seguro

```typescript
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
  referrerPolicy="strict-origin-when-cross-origin"
  allow="clipboard-read; clipboard-write; camera; microphone; geolocation; autoplay; encrypted-media"
  loading="lazy"
/>
```

### Validaciones de Seguridad

- ✅ URLs validadas antes de renderizar
- ✅ Origins permitidos configurables
- ✅ CSP restrictivo para iframes
- ✅ Sandboxing granular
- ✅ Rate limiting en APIs

## 🚀 Guía de Inicio Rápido

### 1. Configuración Inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Ejecutar en desarrollo
npm run dev
```

### 2. Crear una Nueva Demo

```typescript
// 1. Agregar al catálogo (lib/demos/catalog.ts)
{
  id: "mi-nueva-demo",
  name: "Mi Nueva Demo",
  summary: "Descripción breve",
  description: "Descripción detallada",
  status: "available",
  tags: ["categoria"],
  interactiveUrl: "https://mi-app-demos.vercel.app/mi-demo",
  demoType: "dashboard"
}

// 2. Crear página en demos-app
// app/demos/mi-demo/page.tsx
export default function MiDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Contenido de la demo */}
    </div>
  )
}
```

### 3. Deploy de Demos

```bash
# Deploy de aplicación de demos
cd demos-app
npm run build
npm run start

# O deploy a Vercel
vercel --prod
```

## 📊 Métricas y Analytics

### Eventos Tracked

- `demo_opened`: Demo abierta por usuario
- `demo_closed`: Demo cerrada
- `demo_error`: Error al cargar demo
- `demo_feedback`: Feedback enviado

### Dashboard de Métricas

- Tasa de apertura de demos
- Tiempo promedio de interacción
- Conversión por tipo de demo
- Feedback y satisfacción

## 🔧 API Reference

### DemoContext

```typescript
interface DemoContextType {
  activeDemo: Demo | null
  openDemo: (demo: Demo) => Promise<void>
  closeDemo: () => void
  demoHistory: Demo[]
  isLoading: boolean
  error: string | null
}

const { activeDemo, openDemo, closeDemo, demoHistory, isLoading, error } = useDemo()
```

### Props de Componentes

```typescript
interface DemoModalProps {
  demo: Demo
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DemoCardProps {
  demo: Demo
}
```

## 🚨 Troubleshooting

### Problemas Comunes

#### ❌ "X-Frame-Options: DENY"
**Solución**: Verificar configuración en `next.config.mjs`

#### ❌ "CSP violation"
**Solución**: Agregar dominio a `frame-src` en CSP

#### ❌ Demo no carga
**Solución**: Verificar URL interactiva y CORS

#### ❌ Context error
**Solución**: Asegurar `DemoProvider` envuelve la app

### Logs Útiles

```bash
# Ver logs de demo openings
grep "demo_opened" logs/application.log

# Ver errores de CSP
grep "Content-Security-Policy" logs/security.log
```

## 📈 Mejores Prácticas

### Desarrollo

1. **Validar URLs** antes de agregar al catálogo
2. **Probar en múltiples navegadores** (Chrome, Firefox, Safari)
3. **Implementar loading states** para mejor UX
4. **Usar TypeScript** para type safety

### Seguridad

1. **Configurar CSP restrictivo** para iframes
2. **Usar sandbox attributes** apropiados
3. **Validar origins** en producción
4. **Monitorear logs** de seguridad

### Performance

1. **Lazy loading** para iframes
2. **Optimizar assets** de demos
3. **Usar CDN** para recursos estáticos
4. **Implementar caching** estratégico

### Deployment

1. **Aplicación separada** para demos
2. **Variables de entorno** para URLs
3. **Health checks** post-deployment
4. **Rollback plan** preparado

## 🤝 Contribución

### Flujo de Desarrollo

1. Crear branch feature
2. Implementar cambios
3. Agregar tests
4. Crear PR con descripción detallada
5. Code review y merge

### Estándares de Código

- TypeScript obligatorio
- ESLint configurado
- Tests unitarios requeridos
- Documentación actualizada

## 📞 Soporte

Para soporte técnico:
- 📧 Email: soporte@vanguard.com
- 💬 Slack: #demos-system
- 📋 Issues: GitHub Issues

## 📋 Checklist de Implementación

- [x] Configuración de seguridad (CSP, headers)
- [x] DemoContext con React Context
- [x] Componentes actualizados (DemoModal, DemoCard)
- [x] Aplicación separada para demos
- [x] Tests unitarios
- [x] Documentación completa
- [x] Deployment pipeline
- [x] Monitoreo y analytics

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
**Mantenedor**: V0 Vanguard Team

