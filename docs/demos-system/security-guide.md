# 🔒 Guía de Seguridad - Sistema de Demos Interactivas

Mejores prácticas de seguridad para iframes embebidos y demos interactivas.

## 🎯 Principios de Seguridad

### 1. **Principio de Menor Privilegio**
- Otorgar solo los permisos necesarios
- Usar sandboxing restrictivo
- Validar todas las entradas

### 2. **Defense in Depth**
- Múltiples capas de seguridad
- Validación en cliente y servidor
- Monitoreo continuo

### 3. **Zero Trust**
- Verificar todo, confiar en nada
- Autenticación y autorización estrictas
- Logs detallados de todas las acciones

---

## 🛡️ Configuración de Seguridad Implementada

### Headers de Seguridad (Aplicación Principal)

```typescript
// next.config.mjs - Headers configurados
{
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': [
    "default-src 'self'",
    "frame-src 'self' https://*.vercel.app https://*.web.app",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

### Atributos de Iframe Seguro

```typescript
// components/dashboard/demo-modal.tsx
<iframe
  // Sandbox restrictivo pero funcional
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"

  // Control de referrer
  referrerPolicy="strict-origin-when-cross-origin"

  // Permisos específicos y limitados
  allow="clipboard-read; clipboard-write; camera; microphone; geolocation; autoplay; encrypted-media"

  // Lazy loading para performance
  loading="lazy"

  // Título accesible
  title={`Demo interactiva: ${demo.name}`}
/>
```

---

## 🔍 Análisis de Amenazas

### Amenazas Identificadas

#### 1. **Clickjacking**
- **Riesgo**: Ataques donde usuarios hacen clic en elementos invisibles
- **Mitigación**:
  - `X-Frame-Options: SAMEORIGIN`
  - `frame-ancestors 'self'` en CSP
  - Validación de origins permitidos

#### 2. **XSS vía Iframes**
- **Riesgo**: Inyección de scripts maliciosos a través de URLs
- **Mitigación**:
  - Validación estricta de URLs
  - CSP restrictivo
  - Sanitización de inputs
  - Sandboxing de iframes

#### 3. **Data Exfiltration**
- **Riesgo**: Robo de datos sensibles a través de iframes
- **Mitigación**:
  - `referrerPolicy="strict-origin-when-cross-origin"`
  - Control de permisos con `allow` attribute
  - Rate limiting en APIs

#### 4. **Denial of Service**
- **Riesgo**: Iframes que consumen recursos excesivos
- **Mitigación**:
  - Timeouts en carga de iframes
  - Límites de recursos por demo
  - Monitoreo de uso

---

## ⚙️ Configuraciones de Sandbox

### Niveles de Sandbox Recomendados

#### Para Demos de Solo Lectura
```typescript
sandbox="allow-same-origin allow-downloads"
// - Sin scripts
// - Solo contenido estático
// - Downloads permitidos
```

#### Para Demos Interactivas Básicas
```typescript
sandbox="allow-scripts allow-same-origin allow-forms"
// - Scripts permitidos
// - Formularios funcionales
// - Sin popups/modals externos
```

#### Para Demos Avanzadas (Nuestro Caso)
```typescript
sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation"
// - Funcionalidad completa
// - Popups y modals
// - Presentaciones
// - Downloads
```

### Permisos de `allow` Attribute

#### Permisos Esenciales
```typescript
allow="clipboard-read; clipboard-write"
// - Copiar/pegar necesario para UX
```

#### Permisos Opcionales (por Demo)
```typescript
allow="camera; microphone"
// - Solo para demos que requieren input multimedia

allow="geolocation"
// - Solo para demos con mapas/localización

allow="autoplay; encrypted-media"
// - Solo para demos con video/audio
```

---

## 🔐 Validaciones de Seguridad

### Validación de URLs

```typescript
// contexts/demo-context.tsx
const openDemo = useCallback(async (demo: Demo) => {
  // 1. Verificar que existe URL
  if (!demo.interactiveUrl) {
    setError("Esta demo no tiene una URL interactiva configurada")
    return
  }

  // 2. Validar formato de URL
  try {
    const url = new URL(demo.interactiveUrl)
    if (!url.protocol.startsWith('https')) {
      throw new Error('Solo se permiten URLs HTTPS')
    }
  } catch (err) {
    setError('URL de demo inválida')
    return
  }

  // 3. Validar dominio permitido
  const allowedDomains = [
    'vercel.app',
    'web.app',
    'firebase.app'
  ]

  const url = new URL(demo.interactiveUrl)
  const isAllowed = allowedDomains.some(domain =>
    url.hostname.endsWith(domain) || url.hostname === 'localhost'
  )

  if (!isAllowed) {
    setError('Dominio no autorizado para demos')
    return
  }

  // ... continuar con apertura
}, [])
```

### Rate Limiting

```typescript
// Implementar en API routes
import rateLimit from 'express-rate-limit'

const demoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por windowMs
  message: 'Demasiadas solicitudes de demo, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
})
```

---

## 📊 Monitoreo de Seguridad

### Logs de Seguridad

```typescript
// Tipos de eventos a loguear
type SecurityEvent =
  | 'demo_opened'
  | 'iframe_load_success'
  | 'iframe_load_error'
  | 'csp_violation'
  | 'invalid_url_attempted'
  | 'unauthorized_domain_attempted'
  | 'rate_limit_exceeded'

// Función de logging
function logSecurityEvent(event: SecurityEvent, details: Record<string, any>) {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    sessionId: getCurrentSessionId(),
    ...details
  })

  // Enviar a servicio de monitoreo
  // sendToMonitoringService(event, details)
}
```

### CSP Violation Reporting

```typescript
// Report URI para CSP violations
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "report-uri /api/security/csp-report"
  ].join('; ')
}

// API route para reports
// app/api/security/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json()

  // Log CSP violation
  console.error('CSP Violation:', report)

  // Alertar al equipo de seguridad
  // sendSecurityAlert(report)

  return Response.json({ received: true })
}
```

---

## 🚨 Respuesta a Incidentes

### Protocolo de Respuesta

#### 1. Detección
- Monitoreo continuo de logs
- Alertas automáticas para anomalías
- Dashboards de seguridad en tiempo real

#### 2. Contención
```bash
# Deshabilitar demo problemática inmediatamente
UPDATE demos SET status = 'maintenance' WHERE id = 'problematic-demo-id'

# Bloquear dominio sospechoso
# Agregar a lista negra en configuración
```

#### 3. Investigación
- Revisar logs detallados
- Analizar payloads maliciosos
- Identificar vector de ataque

#### 4. Recuperación
```typescript
// Rollback de cambios inseguros
git revert <commit-hash>
git push origin main

// Limpiar caches
redis.flushall()

// Notificar a usuarios afectados
sendUserNotification({
  type: 'security_maintenance',
  message: 'Estamos actualizando medidas de seguridad'
})
```

#### 5. Lecciones Aprendidas
- Documentar hallazgos
- Actualizar medidas preventivas
- Entrenar al equipo

---

## 🧪 Testing de Seguridad

### Tests Automatizados

#### XSS Prevention
```typescript
describe('XSS Prevention', () => {
  it('should sanitize malicious URLs', () => {
    const maliciousUrl = 'javascript:alert("xss")'
    expect(validateDemoUrl(maliciousUrl)).toBe(false)
  })

  it('should prevent script injection in demo names', () => {
    const maliciousName = '<script>alert("xss")</script>'
    expect(sanitizeDemoName(maliciousName)).toBe('[Script Removed]')
  })
})
```

#### CSP Validation
```typescript
describe('CSP Headers', () => {
  it('should include frame-src for allowed domains', () => {
    const headers = getSecurityHeaders()
    expect(headers['Content-Security-Policy']).toContain("frame-src 'self' https://*.vercel.app")
  })

  it('should deny object embedding', () => {
    const headers = getSecurityHeaders()
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'")
  })
})
```

#### Sandbox Testing
```typescript
describe('Iframe Sandbox', () => {
  it('should have restrictive sandbox attributes', () => {
    render(<DemoModal demo={mockDemo} open={true} onOpenChange={() => {}} />)

    const iframe = screen.getByTitle(/Demo interactiva/)
    expect(iframe).toHaveAttribute('sandbox')
    expect(iframe.getAttribute('sandbox')).toContain('allow-scripts')
    expect(iframe.getAttribute('sandbox')).not.toContain('allow-top-navigation')
  })
})
```

---

## 📋 Checklist de Seguridad

### Configuración Inicial ✅
- [x] X-Frame-Options configurado como SAMEORIGIN
- [x] CSP incluye frame-src y frame-ancestors
- [x] Permissions-Policy restrictivo
- [x] Referrer-Policy configurado

### Validación de URLs ✅
- [x] Validación de protocolo HTTPS
- [x] Lista blanca de dominios permitidos
- [x] Sanitización de inputs
- [x] Rate limiting implementado

### Sandboxing ✅
- [x] Atributos sandbox apropiados por tipo de demo
- [x] Permisos allow mínimos necesarios
- [x] Lazy loading para performance

### Monitoreo ✅
- [x] Logs de eventos de seguridad
- [x] CSP violation reporting
- [x] Alertas automáticas
- [x] Dashboards de monitoreo

### Tests de Seguridad ✅
- [x] Tests unitarios para validaciones
- [x] Tests de integración para headers
- [x] Penetration testing regular
- [x] Code reviews de seguridad

### Respuesta a Incidentes ✅
- [x] Protocolo documentado
- [x] Runbooks preparados
- [x] Contactos de seguridad definidos
- [x] Backup y recovery plan

---

## 🎯 Mejores Prácticas Adicionales

### 1. **Principio de Least Privilege**
- Revisar permisos cada trimestre
- Remover accesos innecesarios
- Usar roles granulares

### 2. **Security by Design**
- Incluir seguridad desde el diseño inicial
- Code reviews obligatorios
- Threat modeling para nuevas features

### 3. **Continuous Monitoring**
- Logs centralizados
- Alertas 24/7
- Métricas de seguridad en dashboards

### 4. **Education and Awareness**
- Entrenamiento regular del equipo
- Simulacros de incidentes
- Documentación actualizada

---

## 📞 Contactos de Seguridad

### Equipo Interno
- **Security Lead**: security@vanguard.com
- **DevOps**: devops@vanguard.com
- **Legal**: legal@vanguard.com

### Contactos Externos
- **CERT**: cert@domain.gov
- **Hosting Provider**: security@vercel.com
- **Security Researchers**: bugbounty@domain.com

### Protocolos de Escalada
1. **Nivel 1**: Desarrollador detecta issue
2. **Nivel 2**: Security Lead investiga
3. **Nivel 3**: Equipo completo responde
4. **Nivel 4**: Autoridades notificadas si aplica

---

**Última revisión**: Noviembre 2025
**Próxima revisión**: Febrero 2026
**Responsable**: Security Team

