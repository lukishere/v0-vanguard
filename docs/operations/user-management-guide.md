# Guía de Gestión de Usuarios

**Fecha:** Noviembre 2025
**Estado:** Producción

---

## Resumen

Este documento describe cómo gestionar usuarios en el sistema Vanguard-IA, incluyendo la asignación de roles, gestión de accesos a demos y conectividad entre el panel de administración y el dashboard de clientes.

---

## Arquitectura del Sistema

### Roles de Usuario

El sistema utiliza tres roles principales, gestionados mediante `publicMetadata` de Clerk:

1. **`admin`**: Acceso completo al panel de administración (`/admin/*`)
2. **`client`**: Acceso al dashboard de clientes (`/dashboard/`) con demos asignadas
3. **`user`**: Rol por defecto, acceso básico

### Flujo de Autenticación

```
Usuario → Clerk Auth → Metadata (role) → Middleware → Route Access
```

1. Usuario se autentica mediante Clerk (`/clientes/`)
2. Clerk almacena el rol en `publicMetadata.role`
3. El middleware verifica el rol desde `sessionClaims`
4. Se concede o deniega acceso basado en el rol

---

## Gestión de Administradores

### Asignar Rol de Admin

Para convertir un usuario en administrador:

```bash
# Por email
pnpm tsx scripts/make-admin.ts admin@vanguard-ia.tech

# Por user ID
pnpm tsx scripts/make-admin.ts user_2abc123xyz
```

El script:
- Busca el usuario en Clerk
- Actualiza `publicMetadata.role` a `'admin'`
- Permite acceso inmediato a `/admin/*`

### Verificar Acceso Admin

1. El usuario debe tener `publicMetadata.role = 'admin'`
2. Clerk sincroniza el rol a los `sessionClaims`
3. El middleware verifica el rol en cada request

**Nota:** Si el middleware no detecta el rol, el usuario debe cerrar sesión y volver a iniciar sesión para refrescar los `sessionClaims`.

---

## Gestión de Clientes

### Asignar Rol de Cliente

Para convertir un usuario en cliente:

```bash
# Por email
pnpm tsx scripts/make-client.ts cliente@empresa.com

# Por user ID
pnpm tsx scripts/make-client.ts user_2xyz456abc
```

El script:
- Busca el usuario en Clerk
- Actualiza `publicMetadata.role` a `'client'`
- Inicializa `publicMetadata.demoAccess` como array vacío
- Permite acceso a `/dashboard/`

### Asignar Demos a Clientes

1. **Acceder al panel de admin:**
   - Navega a `/admin/clientes`
   - Verás una lista de todos los usuarios con rol `client`

2. **Asignar una demo:**
   - Selecciona el cliente
   - Elige la demo del catálogo
   - Define la duración del acceso (días)
   - Confirma la asignación

3. **El sistema automáticamente:**
   - Actualiza `publicMetadata.demoAccess` del cliente
   - Calcula `expiresAt` basado en la duración
   - El cliente verá la demo en su dashboard inmediatamente

### Estructura de `demoAccess`

```typescript
publicMetadata: {
  role: "client",
  demoAccess: [
    {
      demoId: "vanguard-copilot",
      assignedAt: "2025-11-14T10:00:00.000Z",
      expiresAt: "2025-12-14T10:00:00.000Z",
      daysRemaining: 30,
      usageDays: 5,
      totalDays: 30,
      sessionsCount: 12,
      lastUsedAt: "2025-11-13T15:30:00.000Z"
    }
  ]
}
```

---

## Conectividad Admin ↔ Cliente

### Flujo Completo

```
Admin                          Clerk                        Cliente
  |                              |                             |
  |-- Asignar demo ------------->|                             |
  |   (API: POST /api/admin/clients)                           |
  |                              |                             |
  |                              |-- Update metadata -------->|
  |                              |   (publicMetadata.demoAccess)|
  |                              |                             |
  |                              |                             |-- Lee dashboard
  |                              |                             |   (getClientPublicMetadata)
  |                              |                             |
  |                              |<---- Demo visible ---------|
```

### Endpoints Clave

#### GET `/api/admin/clients`
Obtiene lista de todos los clientes con rol `client`:

```typescript
{
  clients: [
    {
      id: "user_...",
      name: "Cliente Name",
      email: "cliente@email.com",
      metadata: {
        role: "client",
        demoAccess: [...]
      },
      lastActive: "2025-11-14T..."
    }
  ]
}
```

#### POST `/api/admin/clients`
Asigna una demo a un cliente:

```typescript
{
  action: "assign",
  clientId: "user_...",
  demoId: "vanguard-copilot",
  durationDays: 30
}
```

#### DELETE `/api/admin/clients`
Revoca acceso a una demo:

```typescript
{
  action: "revoke",
  clientId: "user_...",
  demoId: "vanguard-copilot"
}
```

---

## Dashboard del Cliente

El dashboard del cliente (`/dashboard/`) muestra:

1. **Demos Activas**: Demos con acceso vigente
2. **En Desarrollo**: Demos próximas a ser asignadas
3. **Disponibles**: Catálogo de demos que puede solicitar
4. **Actividad Reciente**: Historial de interacciones

### Lógica de Visualización

```typescript
// El dashboard lee los metadatos del cliente
const clientMetadata = await getClientPublicMetadata(userId, user)
const clientAccess = clientMetadata.demoAccess

// Enriquece las demos con información de acceso
allDemos.forEach((demo) => {
  const access = clientAccess.find((a) => a.demoId === demo.id)
  if (access) {
    activeDemos.push(enrichDemoWithAccess(demo, access))
  }
})
```

---

## Migración de Whitelist a Clerk

### ❌ Sistema Antiguo (Whitelist)

```typescript
// admin-whitelist.ts (ELIMINADO)
const ADMIN_EMAILS = ['admin@example.com']
const ADMIN_USER_IDS = ['user_123']
```

**Problemas:**
- Hardcodeado en código
- Requiere deploy para cambios
- No escalable
- Datos ficticios en admin

### ✅ Sistema Nuevo (Clerk)

```typescript
// Roles dinámicos en Clerk
publicMetadata: {
  role: "admin" | "client" | "user"
}
```

**Ventajas:**
- Gestión dinámica vía scripts o UI
- Sin deploys necesarios
- Datos reales de Clerk
- Escalable y mantenible

---

## Troubleshooting

### El admin no ve clientes reales

**Problema:** El panel de admin muestra "0 clientes"

**Solución:**
1. Verifica que los usuarios tengan `publicMetadata.role = 'client'`
2. Ejecuta el script: `pnpm tsx scripts/make-client.ts <email>`
3. Refresca el panel de admin

### El cliente no ve las demos asignadas

**Problema:** Dashboard vacío después de asignar demos

**Solución:**
1. Verifica en Clerk Dashboard que `publicMetadata.demoAccess` existe
2. El cliente debe cerrar sesión y volver a entrar
3. Verifica logs del servidor para errores de Clerk

### Error "User does not have admin role"

**Problema:** Usuario no puede acceder a `/admin/`

**Solución:**
1. Verifica `publicMetadata.role` en Clerk Dashboard
2. Ejecuta: `pnpm tsx scripts/make-admin.ts <email>`
3. El usuario debe cerrar sesión y volver a entrar

### SessionClaims no se actualizan

**Problema:** Cambios en metadata no se reflejan inmediatamente

**Solución:**
- Clerk sincroniza metadata a sessionClaims al login
- Usuario debe cerrar sesión y volver a entrar
- O esperar a que la sesión expire y se renueve

---

## Scripts de Utilidad

### `make-admin.ts`
Asigna rol de administrador

```bash
pnpm tsx scripts/make-admin.ts <userId-o-email>
```

### `make-client.ts`
Asigna rol de cliente

```bash
pnpm tsx scripts/make-client.ts <userId-o-email>
```

---

## Mejores Prácticas

1. **Asignación de Roles:**
   - Usar scripts para consistencia
   - Documentar cambios de roles
   - Verificar en Clerk Dashboard

2. **Gestión de Demos:**
   - Asignar duraciones realistas
   - Monitorear `daysRemaining`
   - Renovar antes de expiración

3. **Seguridad:**
   - Roles en `publicMetadata` (visible para el usuario)
   - No exponer datos sensibles
   - Validar permisos en backend

4. **Monitoreo:**
   - Revisar logs del middleware
   - Verificar `lastActiveAt` de clientes
   - Auditar cambios en metadata

---

## Próximos Pasos

- [ ] UI para asignar roles desde panel de admin
- [ ] Sistema de notificaciones para demos próximas a expirar
- [ ] Analytics de uso de demos por cliente
- [ ] Renovación automática de demos
- [ ] Audit log de cambios en metadata




