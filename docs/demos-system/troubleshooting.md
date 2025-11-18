# 🔧 Troubleshooting - Sistema de Demos Interactivas

Guía completa para diagnosticar y resolver problemas comunes en el sistema de demos.

## 🚨 Problemas Críticos

### 1. Demos No Cargan (P0)

#### Síntomas
- Modal se abre pero iframe queda en blanco
- Error "Failed to load resource" en consola
- Loading spinner infinito

#### Diagnóstico Rápido
```bash
# Verificar conectividad a demos app
curl -I https://vanguard-demos.vercel.app/

# Verificar demo específica
curl https://vanguard-demos.vercel.app/demos/copilot

# Verificar headers de main app
curl -I https://vanguard-main.vercel.app/ | grep -E "(X-Frame-Options|Content-Security-Policy)"
```

#### Causas Comunes y Soluciones

##### ❌ CSP Bloqueando Iframes
```bash
# Verificar CSP en logs del navegador
# Console: "Content Security Policy violation"

# Solución: Agregar dominio a frame-src
# next.config.mjs (main app)
{
  key: 'Content-Security-Policy',
  value: "frame-src 'self' https://vanguard-demos.vercel.app"
}
```

##### ❌ X-Frame-Options Denegando Embedding
```bash
# Verificar header actual
curl -I https://vanguard-demos.vercel.app/ | grep "X-Frame-Options"

# Debe ser: ALLOW-FROM https://vanguard-main.vercel.app
# O SAMEORIGIN si está en el mismo dominio

# Solución: Actualizar header
{
  key: 'X-Frame-Options',
  value: 'ALLOW-FROM https://vanguard-main.vercel.app'
}
```

##### ❌ URL de Demo Incorrecta
```typescript
// Verificar en lib/demos/catalog.ts
{
  id: "vanguard-copilot",
  interactiveUrl: "https://vanguard-demos.vercel.app/demos/copilot", // ✅ Correcto
  // NO: "https://vanguard-demos.vercel.app/demos/copilot/" ❌
}
```

##### ❌ Demo App Caída
```bash
# Verificar status de Vercel
curl -s https://vercel-status.com/api/v2/status.json | jq .status

# Verificar deployment
# Vercel Dashboard > vanguard-demos > Deployments

# Solución: Redeploy si es necesario
vercel --prod
```

### 2. Errores de Seguridad (P1)

#### Síntomas
- Console muestra CSP violations
- Iframes no se cargan
- Errores de "unsafe" en logs

#### Diagnóstico
```bash
# Verificar CSP violations en navegador
# Network tab > CSP violation reports

# Revisar headers actuales
curl -I https://vanguard-main.vercel.app/ | grep "Content-Security-Policy"
```

#### Soluciones

##### CSP Violation: frame-src
```typescript
// Agregar dominio faltante
{
  key: 'Content-Security-Policy',
  value: "frame-src 'self' https://vanguard-demos.vercel.app https://*.vercel-preview.app"
}
```

##### CSP Violation: script-src
```typescript
// Para demos que requieren scripts externos
{
  key: 'Content-Security-Policy',
  value: "script-src 'self' 'unsafe-inline' https://cdn.example.com"
}
```

### 3. Problemas de Performance (P2)

#### Síntomas
- Demos cargan muy lento (>5s)
- Alto uso de CPU/memoria
- Freezing intermitente

#### Diagnóstico
```bash
# Medir tiempos de carga
# Chrome DevTools > Network > Resource timing

# Verificar tamaño de bundles
npm run build --dry-run

# Lighthouse audit
# Chrome DevTools > Lighthouse > Performance
```

#### Optimizaciones

##### Lazy Loading No Funciona
```typescript
// Verificar atributo loading
<iframe
  loading="lazy"  // ✅ Correcto
  // loading="eager" ❌ Incorrecto
/>

// Verificar que iframe está fuera del viewport inicial
// Usar Intersection Observer si es necesario
```

##### Bundle Size Excesivo
```typescript
// Code splitting
const DemoModal = dynamic(() => import('@/components/dashboard/demo-modal'), {
  loading: () => <div>Loading...</div>
})

// Tree shaking
// Verificar imports no utilizados
npm run build && npx @next/bundle-analyzer
```

## 🔍 Problemas Específicos por Componente

### DemoContext Issues

#### Context No Disponible
```typescript
// Error: useDemo must be used within a DemoProvider

// Solución: Verificar jerarquía de providers
// app/layout.tsx debe incluir <DemoProvider>
```

#### Estado No Se Actualiza
```typescript
// Síntoma: demo abierta pero estado no refleja

// Debug: Verificar que openDemo está siendo llamado
console.log('openDemo called with:', demo)

// Solución: Verificar que el componente está suscrito al contexto
const { openDemo } = useDemo() // ✅ Correcto
// const openDemo = useDemo().openDemo ❌ Incorrecto
```

### DemoModal Issues

#### Modal No Se Abre
```typescript
// Verificar estado local
const [showDemoModal, setShowDemoModal] = useState(false)

// En onClick:
const handleOpenDemo = async () => {
  await openDemo(demo)  // ✅ Primero abrir en contexto
  setShowDemoModal(true) // ✅ Luego mostrar modal
}
```

#### Iframe No Carga Contenido
```typescript
// Verificar atributos del iframe
console.log('Iframe src:', iframe.src)
console.log('Iframe sandbox:', iframe.sandbox)

// Solución: Verificar sandbox attributes
sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
```

### DemoCard Issues

#### Botón Deshabilitado Incorrectamente
```typescript
// Verificar lógica de disabled
disabled={!demo.interactiveUrl || isLoading}

// Debug values:
console.log('interactiveUrl:', demo.interactiveUrl)
console.log('isLoading:', isLoading)
```

#### Estados Visuales Incorrectos
```typescript
// Verificar condición de status
{demo.status === "active" && (
  // Botón "Abrir Demo"
)}

{demo.status === "expired" && (
  // Botón "Contratar Servicio"
)}
```

## 🛠️ Herramientas de Debug

### Console Commands Útiles

#### Verificar Estado del Contexto
```javascript
// En browser console
const demoContext = React.useContext(window.DemoContext)
console.log('Demo context state:', demoContext)
```

#### Debug de Iframes
```javascript
// Verificar que iframe existe
const iframe = document.querySelector('iframe[title*="Demo"]')
console.log('Iframe found:', !!iframe)

// Verificar src
console.log('Iframe src:', iframe?.src)

// Verificar sandbox
console.log('Iframe sandbox:', iframe?.sandbox)

// Verificar que carga
iframe?.addEventListener('load', () => console.log('Iframe loaded'))
iframe?.addEventListener('error', (e) => console.log('Iframe error:', e))
```

#### Network Debugging
```javascript
// Verificar requests de iframe
// Chrome DevTools > Network > Filter: iframe

// Buscar:
- Status codes (200, 404, 500)
- Response times
- CORS errors
- CSP violations
```

### Logs del Servidor

#### Vercel Logs
```bash
# Ver Vercel dashboard
# Project > Functions > Logs

# Filtrar por:
- demo_opened
- CSP violation
- iframe error
```

#### Custom Logs
```typescript
// Agregar logs temporales
console.log('[DEBUG] openDemo called:', { demoId: demo.id, url: demo.interactiveUrl })
console.log('[DEBUG] iframe onLoad triggered')
console.log('[DEBUG] iframe onError triggered')
```

## 🚨 Escenarios de Emergencia

### Rollback Inmediato

#### Código Problemático
```bash
# Revertir último commit
git revert HEAD --no-edit
git push origin main

# Redeploy automático en Vercel
```

#### Variables de Entorno
```bash
# En Vercel dashboard
# Project Settings > Environment Variables
# Revertir valores problemáticos
```

#### Database Changes
```bash
# Si hay cambios en BD
# Restaurar desde backup
# O revertir migration
```

### Comunicación de Incidentes

#### Plantilla de Comunicación
```markdown
🚨 **Incidente de Producción - Sistema de Demos**

**Estado**: 🔴 Crítico
**Impacto**: Demos no accesibles para todos los usuarios
**Inicio**: [timestamp]
**Causa**: [descripción técnica]

**Acciones Tomadas**:
- [ ] Identificación del problema
- [ ] Implementación de workaround
- [ ] Inicio de rollback

**Próximas Actualizaciones**: [ETA]
**Contacto**: [equipo responsable]
```

## 📊 Métricas de Salud

### KPIs a Monitorear

#### Funcionalidad
- **Success Rate**: > 95%
- **Error Rate**: < 5%
- **Load Time**: < 3s

#### Seguridad
- **CSP Violations**: = 0
- **Failed Loads**: < 1%
- **Rate Limits**: < 0.1%

#### Performance
- **Lighthouse Score**: > 90
- **Core Web Vitals**: Dentro de rangos
- **Bundle Size**: < 500KB

### Alertas Automáticas

#### Configurar Alertas en Vercel
```typescript
// vercel.json
{
  "alerts": [
    {
      "type": "functionError",
      "threshold": 10,
      "window": "5m"
    },
    {
      "type": "responseTime",
      "threshold": 5000,
      "window": "5m"
    }
  ]
}
```

## 🔄 Soluciones Preventivas

### Code Quality Gates

#### Pre-commit Hooks
```bash
# .husky/pre-commit
npm run lint
npm run type-check
npm test
```

#### CI/CD Checks
```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint

- name: Type Check
  run: npm run type-check

- name: Security Audit
  run: npm audit --audit-level high

- name: E2E Tests
  run: npm run test:e2e
```

### Testing Automatizado

#### Unit Tests
```typescript
describe('DemoModal Security', () => {
  it('should have secure iframe attributes', () => {
    render(<DemoModal {...props} />)
    const iframe = screen.getByTitle(/Demo/)
    expect(iframe).toHaveAttribute('sandbox')
    expect(iframe).toHaveAttribute('referrerPolicy', 'strict-origin-when-cross-origin')
  })
})
```

#### E2E Tests
```typescript
// tests/e2e/demo-flow.spec.ts
test('complete demo flow works', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('[data-testid="open-demo-button"]')
  await page.waitForSelector('iframe[title*="Demo"]')
  // Verificar que iframe carga contenido
})
```

## 📞 Escalation Matrix

### Nivel 1: Desarrollador (0-5 min)
- Revisar logs del navegador
- Verificar configuración básica
- Intentar soluciones conocidas

### Nivel 2: Team Lead (5-15 min)
- Revisar métricas en Vercel
- Verificar deployments recientes
- Coordenar con DevOps

### Nivel 3: Equipo Completo (15-60 min)
- Análisis profundo del problema
- Implementación de hotfix
- Comunicación con stakeholders

### Nivel 4: Crisis Management (1+ hora)
- Rollback completo si es necesario
- Comunicación externa
- Post-mortem analysis

---

## 📋 Checklist de Troubleshooting

### Diagnóstico Inicial ✅
- [x] Verificar síntomas específicos
- [x] Consultar logs relevantes
- [x] Identificar componentes afectados
- [x] Priorizar por impacto

### Investigación ✅
- [x] Reproducir el problema
- [x] Verificar configuraciones
- [x] Revisar código reciente
- [x] Consultar documentación

### Solución ✅
- [x] Implementar fix identificado
- [x] Probar en entorno de desarrollo
- [x] Deploy a staging
- [x] Verificar en producción

### Prevención ✅
- [x] Agregar tests para el caso
- [x] Actualizar documentación
- [x] Revisar procesos relacionados
- [x] Monitoreo mejorado

### Lecciones Aprendidas ✅
- [x] Documentar causa raíz
- [x] Actualizar runbooks
- [x] Entrenar al equipo
- [x] Implementar mejoras preventivas

---

**Última actualización**: Noviembre 2025
**Próxima revisión**: Enero 2026
**Responsable**: DevOps Team

