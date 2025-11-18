# Sistema de Mensajes Admin → Cliente

## 📋 Descripción

Sistema de notificaciones/mensajes que permite a los administradores enviar comunicaciones directas a los clientes. Los mensajes aparecen como notificaciones en el dashboard del cliente, completamente separado del chatbot IA.

## ✨ Características

### **Para Administradores**

#### Enviar Mensajes (`/admin/clientes`)
- Botón "📨 Enviar Mensaje" en cada tarjeta de cliente
- Modal con formulario completo:
  - **Asunto** (obligatorio)
  - **Prioridad**:
    - Normal (por defecto)
    - ⚠️ Importante (icono amarillo)
    - 🚨 Urgente (icono rojo)
  - **Mensaje** (obligatorio, con contador de caracteres)
- Validación de campos obligatorios
- Toast de confirmación al enviar

#### Información Almacenada
- ID del mensaje único
- Cliente destinatario (ID, nombre)
- Admin remitente (ID, nombre)
- Asunto y contenido
- Prioridad del mensaje
- Timestamp de envío
- Estado de lectura (leído/no leído)
- Timestamp de lectura

### **Para Clientes**

#### Notificaciones en Dashboard
- **Icono de campana** 🔔 en el header (al lado del botón de cerrar sesión)
- **Badge rojo** con contador de mensajes no leídos
- Badge desaparece cuando todos los mensajes están leídos
- Se actualiza automáticamente cada 10 segundos

#### Panel de Mensajes
- **Panel deslizante** (Sheet) desde la derecha
- **Botón "Marcar todos"** para marcar todos como leídos
- Lista de mensajes ordenados por fecha (más reciente primero)

#### Estados Visuales de Mensajes

**Mensaje No Leído:**
- Border azul brillante con glow
- Punto azul pulsante
- Fondo con sombra azul
- Texto en blanco brillante

**Mensaje Leído:**
- Border gris suave
- Sin punto pulsante
- Fondo gris tenue
- Texto en gris
- Muestra "Leído hace X tiempo"

**Prioridades:**
- **Normal**: Sin badge especial
- **Importante**: Badge amarillo con icono ⚠️
- **Urgente**: Badge rojo con icono 🚨

#### Interacción
- Click en mensaje no leído → Marca automáticamente como leído
- "Marcar todos" → Marca todos los mensajes como leídos
- Animación suave en transiciones

## 🗂️ Estructura de Archivos

### Backend
```
app/actions/messages.ts              # Server Actions para gestión de mensajes
app/api/messages/route.ts            # GET mensajes del cliente
app/api/messages/[messageId]/read/   # POST marcar mensaje como leído
app/api/messages/mark-all-read/      # POST marcar todos como leídos
```

### Frontend
```
components/admin/send-message-button.tsx    # Modal para enviar mensajes (Admin)
components/dashboard/messages-panel.tsx     # Panel de notificaciones (Cliente)
```

### Persistencia
```
.data/admin-messages.json            # Almacenamiento de mensajes
```

## 🔄 Flujo de Funcionamiento

### 1. Admin Envía Mensaje

```
Admin → Click "Enviar Mensaje"
     → Abre modal
     → Completa formulario (asunto, prioridad, mensaje)
     → Click "Enviar Mensaje"
     → Server Action `sendMessageToClient()`
     → Guarda en `.data/admin-messages.json`
     → Obtiene datos del cliente desde Clerk
     → Obtiene datos del admin desde Clerk
     → Toast confirmación
     → Revalida páginas
```

### 2. Cliente Recibe Notificación

```
Cliente → Entra al dashboard
       → `MessagesPanel` se monta
       → Llama a `/api/messages`
       → Muestra badge con número de no leídos
       → Polling cada 10 segundos
       → Actualiza automáticamente
```

### 3. Cliente Lee Mensaje

```
Cliente → Click en icono de campana 🔔
       → Abre panel deslizante
       → Ve lista de mensajes
       → Click en mensaje no leído
       → Llama a `/api/messages/[messageId]/read`
       → Marca como leído
       → Actualiza UI instantáneamente
       → Reduce contador de badge
```

## 📊 Modelo de Datos

```typescript
interface AdminMessage {
  id: string                    // msg_1234567890_abc123
  clientId: string              // user_xyz (Clerk ID)
  clientName: string            // "Juan Pérez"
  subject: string               // "Actualización importante"
  content: string               // Contenido del mensaje
  priority: "normal" | "important" | "urgent"
  sentAt: string                // ISO 8601 timestamp
  sentBy: string                // user_admin (Clerk ID)
  sentByName: string            // "Admin Vanguard"
  read: boolean                 // false por defecto
  readAt?: string               // ISO 8601 timestamp cuando se lee
}
```

## 🎨 Diseño Visual

### Badge de Notificaciones
```
🔔  con badge rojo → Mensajes no leídos
🔔  sin badge      → Sin mensajes no leídos o todos leídos
```

### Colores y Estilos
- **Badge contador**: `bg-rose-500` con texto blanco
- **Mensajes no leídos**:
  - Border: `border-vanguard-blue/40`
  - Background: `bg-vanguard-blue/5`
  - Shadow: `shadow-vanguard-blue/10`
  - Punto: `bg-vanguard-blue` con `animate-pulse`

- **Mensajes leídos**:
  - Border: `border-white/10`
  - Background: `bg-slate-800/40`

- **Prioridades**:
  - Urgente: `bg-rose-500/20 text-rose-300 border-rose-500/30`
  - Importante: `bg-amber-500/20 text-amber-300 border-amber-500/30`
  - Normal: `bg-blue-500/20 text-blue-300 border-blue-500/30`

## 🔧 Server Actions Disponibles

### `sendMessageToClient(clientId, subject, content, priority)`
Envía un mensaje a un cliente específico.
```typescript
const result = await sendMessageToClient(
  "user_xyz",
  "Actualización de demo",
  "Tu demo está lista para probar!",
  "important"
)
// Returns: { success: true, messageId: "msg_..." }
```

### `getClientMessages(clientId)`
Obtiene todos los mensajes de un cliente.
```typescript
const messages = await getClientMessages("user_xyz")
// Returns: AdminMessage[]
```

### `getUnreadCount(clientId)`
Cuenta mensajes no leídos de un cliente.
```typescript
const count = await getUnreadCount("user_xyz")
// Returns: number
```

### `markMessageAsRead(messageId)`
Marca un mensaje como leído.
```typescript
const result = await markMessageAsRead("msg_123")
// Returns: { success: true }
```

### `markAllAsRead(clientId)`
Marca todos los mensajes de un cliente como leídos.
```typescript
const result = await markAllAsRead("user_xyz")
// Returns: { success: true, count: 3 }
```

### `deleteMessage(messageId)`
Elimina un mensaje (solo admin).
```typescript
const result = await deleteMessage("msg_123")
// Returns: { success: true }
```

## 🔐 Seguridad

- ✅ Autenticación requerida (Clerk)
- ✅ Validación de userId en todas las APIs
- ✅ Cliente solo ve sus propios mensajes
- ✅ Admin puede enviar a cualquier cliente
- ✅ No se exponen IDs internos sensibles

## 🚀 Extensiones Futuras

Posibles mejoras:
- 📎 Adjuntar archivos o enlaces
- 💬 Respuestas de clientes (conversación bidireccional)
- 🔔 Notificaciones push/email
- 🗓️ Programar envío de mensajes
- 📁 Categorías de mensajes
- 🔍 Búsqueda de mensajes
- 📊 Analytics de lectura
- ⏰ Recordatorios automáticos
- 🎯 Envío masivo a múltiples clientes
- 🔄 Plantillas de mensajes predefinidas

## 📝 Ejemplo de Uso

### Caso 1: Notificar sobre demo lista

```typescript
// Admin envía mensaje cuando demo está lista
await sendMessageToClient(
  clientId,
  "🎉 Tu demo está lista",
  "Hola! Te informamos que la demo que solicitaste ya está disponible en tu panel. Puedes acceder desde la sección 'Demos Activas'.\n\nSi tienes dudas, no dudes en contactarnos.",
  "important"
)
```

### Caso 2: Mensaje urgente sobre mantenimiento

```typescript
await sendMessageToClient(
  clientId,
  "⚠️ Mantenimiento programado",
  "El sistema estará en mantenimiento el día 15 de enero de 2:00 AM a 4:00 AM. Durante este tiempo no podrás acceder a las demos.\n\nDisculpa las molestias.",
  "urgent"
)
```

### Caso 3: Mensaje informativo

```typescript
await sendMessageToClient(
  clientId,
  "Nueva funcionalidad disponible",
  "Hemos agregado un nuevo chatbot de asistencia. Puedes acceder haciendo click en el ícono de la esquina inferior derecha.\n\n¡Esperamos que te sea útil!",
  "normal"
)
```

## 🐛 Troubleshooting

### Los mensajes no aparecen
1. Verifica que el archivo `.data/admin-messages.json` existe
2. Revisa los logs del servidor para errores
3. Verifica que el polling está funcionando (debería hacer request cada 10 seg)
4. Asegúrate de que el userId del cliente es correcto

### Badge no se actualiza
1. El polling está configurado a 10 segundos, espera ese tiempo
2. Verifica en Network tab que las llamadas a `/api/messages` están funcionando
3. Revisa la consola del navegador para errores

### Mensaje no se marca como leído
1. Verifica que el click en el mensaje está funcionando
2. Revisa que la API `/api/messages/[messageId]/read` responde correctamente
3. Verifica permisos del archivo `.data/admin-messages.json`

## ✅ Ventajas vs Integrar en Chatbot

**Por qué NO integrarlo en el chatbot:**
- ❌ Confunde al usuario (¿IA o humano?)
- ❌ Historial mezclado
- ❌ Complica lógica del chatbot
- ❌ Difícil diferenciar visualmente

**Por qué usar sistema separado:**
- ✅ Clara separación de responsabilidades
- ✅ Notificaciones visuales obvias
- ✅ Historial dedicado
- ✅ Mejor UX
- ✅ No afecta código del chatbot
- ✅ Fácil de expandir

---

**Sistema implementado y listo para usar!** 🎉
