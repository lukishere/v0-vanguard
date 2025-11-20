# Automatización de Bienvenida del Chatbot PORTAL

## 🎯 Descripción General

El chatbot PORTAL incluye una funcionalidad de bienvenida automática que se activa cuando un cliente inicia sesión por primera vez en la plataforma. Esta característica mejora la experiencia del usuario proporcionando una introducción personalizada y guiada.

## ⚙️ Funcionalidad Técnica

### Activación Automática

- **Tiempo de espera**: 10 segundos después de cargar el dashboard
- **Condición**: Solo para usuarios que nunca han visto el mensaje de bienvenida
- **Persistencia**: Se registra en `localStorage` con la clave `portal-welcome-seen`

### Mensaje de Bienvenida

```text
¡Bienvenido a PORTAL! 👋

Estoy aquí para ayudarte en tu experiencia con nuestras soluciones de IA. Te recomiendo explorar nuestro catálogo de demos disponibles para ver cómo podemos transformar tu negocio.

Si tienes cualquier duda o necesitas más información, no dudes en agendar una reunión con nuestros especialistas. ¿En qué puedo ayudarte hoy?
```

### Componentes Afectados

- `components/dashboard/chatbot-widget.tsx`: Lógica principal de automatización
- `components/dashboard/client-dashboard-wrapper.tsx`: Integración en el dashboard del cliente

## 🔧 Configuración y Personalización

### Parámetros Configurables

```typescript
// Tiempo de espera antes de mostrar el mensaje (en ms)
const WELCOME_DELAY = 10000; // 10 segundos

// Clave para localStorage
const WELCOME_KEY = 'portal-welcome-seen';

// Mensaje personalizado
const welcomeMessage = `¡Bienvenido a PORTAL! 👋\n\n...`;
```

### Modificar el Mensaje

Para cambiar el contenido del mensaje de bienvenida, edita la variable `welcomeMessage` en `chatbot-widget.tsx`:

```typescript
const welcomeMessage: Message = {
  id: Date.now().toString(),
  user: "Bot",
  text: `Tu nuevo mensaje personalizado aquí`,
  timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
}
```

## 🧪 Testing y Desarrollo

### Resetear Estado de Bienvenida

Para probar la funcionalidad múltiples veces durante el desarrollo:

```javascript
// En la consola del navegador
localStorage.removeItem('portal-welcome-seen');

// O usando la función de utilidad
resetPortalWelcome(); // Solo disponible en desarrollo
```

### Script de Utilidad

Se incluye un script en `scripts/reset-chatbot-welcome.js` que proporciona funciones de ayuda para testing.

## 📊 Métricas y Seguimiento

La apertura automática del chatbot se registra como actividad en el sistema con el tipo `"chat-opened"` y descripción `"Abrió el chatbot de consultas"`.

## 🔒 Consideraciones de Seguridad

- El estado de bienvenida se almacena solo en localStorage del navegador
- No se envía información sensible al chatbot
- El mensaje se muestra una sola vez por navegador/dispositivo

## 🚀 Próximas Mejoras

- [ ] Personalización del mensaje basada en el perfil del usuario
- [ ] Integración con el historial de demos del cliente
- [ ] Opción para que el usuario pueda solicitar que se repita el mensaje
- [ ] A/B testing de diferentes versiones del mensaje

## 📝 Notas de Implementación

- El mensaje de bienvenida reemplaza el mensaje inicial por defecto
- La funcionalidad es no intrusiva y no interfiere con otras interacciones del usuario
- Se limpia automáticamente el timer si el componente se desmonta antes de los 10 segundos


