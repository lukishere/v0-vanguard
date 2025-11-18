# Automata de Recursos Humanos - Demo Integrada

## 📋 Información General

**Demo Productiva**: Sistema automatizado de reclutamiento con IA
**Repositorio Original**: https://github.com/nicolasmcrespo/hrluke.git
**Estado**: Demo simulada (pendiente integración completa)

## 🎯 Funcionalidad

La demo simula el flujo completo de reclutamiento automatizado:

1. **📄 Carga de CV**: El candidato sube su curriculum
2. **🎤 Entrevista Automatizada**: IA realiza preguntas conversacionales
3. **🤖 Análisis por IA**: Evaluación automática de respuestas
4. **📊 Reporte**: Generación de evaluación completa
5. **📧 Envío por Email**: Reporte enviado automáticamente

## 🏗️ Arquitectura Actual

### Demo Simulada (Versión Actual)
- ✅ Interfaz completa con React/Next.js
- ✅ Estados simulados de progreso
- ✅ UI/UX profesional
- ✅ Integración con sistema de demos principal

### Integración Real (Próximo Paso)
- 🔄 Código del repositorio `hrluke.git`
- 🔄 Backend real de procesamiento de CV
- 🔄 API de entrevistas automatizadas
- 🔄 Sistema de envío de emails

## 🚀 Cómo Ejecutar

### Desarrollo Local
```bash
# Desde demos-app/
npm run dev

# Acceder a: http://localhost:3000/demos/automata-rrhh
```

### Producción (Vercel)
```bash
# Deploy
vercel --prod

# URL: https://vanguard-demos.vercel.app/demos/automata-rrhh
```

## 🔧 Integración con Sistema Principal

### Catálogo Configurado
```typescript
// lib/demos/catalog.ts
{
  id: "automata-rrhh",
  name: "Automata de Recursos Humanos",
  interactiveUrl: "https://vanguard-demos.vercel.app/demos/automata-rrhh",
  status: "available",
  demoType: "dashboard"
}
```

### Seguridad CSP
```typescript
// next.config.mjs (app principal)
"frame-src 'self' https://vanguard-demos.vercel.app"
```

## 📊 Métricas de Demo

### Simulación Actual
- ✅ 8 preguntas de entrevista automatizadas
- ✅ Análisis de respuestas con IA simulada
- ✅ Reporte completo con recomendaciones
- ✅ Estados de progreso visuales
- ✅ Interfaz responsive

### Métricas Reales (Post-Integración)
- 📈 Tasa de finalización de entrevistas
- 📈 Calidad de evaluaciones por IA
- 📈 Tiempo de procesamiento de CV
- 📈 Precisión de recomendaciones

## 🔄 Próximos Pasos de Integración

### Fase 1: Análisis del Repositorio
```bash
# Ejecutar script de integración
node scripts/integrate-hr-demo.js

# Revisar código integrado
# Ajustar dependencias y configuración
```

### Fase 2: Backend Integration
- Conectar con API de procesamiento de CV
- Integrar sistema de entrevistas automatizadas
- Configurar envío de emails
- Ajustar base de datos

### Fase 3: Testing End-to-End
- Pruebas con CVs reales
- Validación de entrevistas
- Verificación de reportes
- Testing de envío de emails

### Fase 4: Optimización
- Performance tuning
- UX improvements
- Analytics avanzados
- Multi-language support

## 🎨 Características de UI/UX

### Diseño Actual
- 🎨 Gradiente azul-indigo-púrpura profesional
- 🎨 Cards con backdrop blur y transparencias
- 🎨 Animaciones de progreso y estados
- 🎨 Iconografía consistente con Lucide React
- 🎨 Responsive design para móviles y desktop

### Interacciones Simuladas
- 📤 Upload de archivos con drag & drop
- 🎤 Indicadores de "escuchando" durante entrevistas
- 📊 Barras de progreso animadas
- 💭 Mensajes de IA con typing effect
- 📧 Confirmaciones de envío

## 🔗 Integración con Sistema de Demos

### Context API
```typescript
// Usa DemoContext para navegación y analytics
const { openDemo, closeDemo } = useDemo()

// Registra actividad automáticamente
await logActivity("demo-opened", `Abrió Automata RRHH`, {
  demoId: "automata-rrhh"
})
```

### Modal Seguro
```typescript
// Iframe con sandboxing completo
<iframe
  src={demo.interactiveUrl}
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  referrerPolicy="strict-origin-when-cross-origin"
/>
```

## 📞 Contacto y Soporte

**Para integración completa:**
- 📧 Email: desarrollo@empresa.com
- 🔗 Repositorio: https://github.com/nicolasmcrespo/hrluke.git
- 📋 Issues: Crear issue en repositorio principal

**Estado Actual**: ✅ Demo simulada funcional | 🔄 Pendiente integración backend real
