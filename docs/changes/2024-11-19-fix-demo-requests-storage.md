# Fix: Demo Requests Storage - Filesystem a Clerk Metadata

**Fecha:** 2024-11-19
**Tipo:** Bug Fix - Critical
**Archivo:** `app/actions/demo-requests.ts`

## 📋 Problema

El sistema de solicitudes de demos estaba almacenando datos en el **filesystem local** usando `fs.writeFile()`:

```typescript
// ❌ CÓDIGO ANTERIOR (NO FUNCIONA EN VERCEL)
const DATA_DIR = path.join(process.cwd(), ".data");
const REQUESTS_FILE = path.join(DATA_DIR, "demo-requests.json");

async function saveRequests(requests: Map<string, DemoRequest>) {
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(obj, null, 2), "utf-8");
}
```

### **Problemas identificados:**

1. ❌ **Vercel tiene filesystem read-only** en producción
2. ❌ Las solicitudes se **perdían en cada deployment**
3. ❌ Error al intentar escribir archivos
4. ❌ No escalable (un solo archivo JSON)
5. ❌ No persistente entre instancias serverless

### **Error reportado:**

```
Error al solicitar demo
Error al procesar la solicitud
```

## ✅ Solución Implementada

### **Nueva arquitectura: Clerk privateMetadata**

Migración completa a almacenamiento en **Clerk privateMetadata**, donde cada usuario almacena sus propias solicitudes:

```typescript
// ✅ NUEVO CÓDIGO (FUNCIONA EN VERCEL)
async function saveRequest(request: DemoRequest) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(request.clientId);
  const metadata = user.privateMetadata as any;
  const userRequests = metadata?.demoRequests || {};

  userRequests[request.id] = request;

  await clerk.users.updateUser(request.clientId, {
    privateMetadata: {
      ...metadata,
      demoRequests: userRequests,
    },
  });
}
```

### **Estructura de datos en Clerk:**

```typescript
// User privateMetadata
{
  demoRequests: {
    "req_1234567890_abc123": {
      id: "req_1234567890_abc123",
      clientId: "user_xyz",
      clientName: "Juan Pérez",
      clientEmail: "juan@empresa.com",
      demoId: "automata-rrhh",
      demoName: "Autómata RRHH",
      status: "pending",
      requestedAt: "2024-11-19T...",
      message: "Necesito automatizar...",
    },
    "req_9876543210_def456": {
      // otra solicitud...
    }
  }
}
```

## 🔄 Cambios Realizados

### **Funciones eliminadas:**

- ❌ `ensureDataDir()` - Ya no necesitamos crear directorios
- ❌ `saveRequests(Map)` - Reemplazada por `saveRequest(single)`

### **Funciones modificadas:**

#### 1. **`loadRequests()`**

**Antes:** Leía de archivo JSON
**Ahora:** Agrega solicitudes de todos los usuarios

```typescript
async function loadRequests(): Promise<Map<string, DemoRequest>> {
  const clerk = await clerkClient();
  const allRequests = new Map<string, DemoRequest>();

  const users = await clerk.users.getUserList({ limit: 500 });

  for (const user of users.data) {
    const metadata = user.privateMetadata as any;
    const userRequests = metadata?.demoRequests || {};

    for (const [requestId, request] of Object.entries(userRequests)) {
      allRequests.set(requestId, request as DemoRequest);
    }
  }

  return allRequests;
}
```

#### 2. **`requestDemoAccess()`**

**Cambio:** Usa `saveRequest()` en lugar de `saveRequests()`

```typescript
// Antes
requestsStore.set(requestId, request);
await saveRequests(requestsStore);

// Ahora
await saveRequest(request);
```

#### 3. **`approveRequest()`**

**Cambio:** Usa `saveRequest()` para actualizar estado

```typescript
request.status = "approved";
request.processedAt = new Date().toISOString();
request.processedBy = userId;
await saveRequest(request); // ✅ Guarda en Clerk
```

#### 4. **`rejectRequest()`**

**Cambio:** Usa `saveRequest()` para actualizar estado

```typescript
request.status = "rejected";
request.processedAt = new Date().toISOString();
request.processedBy = userId;
request.message = reason;
await saveRequest(request); // ✅ Guarda en Clerk
```

## 🎯 Beneficios

| Aspecto            | Antes (Filesystem)           | Ahora (Clerk)         |
| ------------------ | ---------------------------- | --------------------- |
| **Persistencia**   | ❌ Se pierde en deploy       | ✅ Permanente         |
| **Vercel**         | ❌ No funciona               | ✅ Compatible         |
| **Escalabilidad**  | ❌ Un solo archivo           | ✅ Distribuido        |
| **Seguridad**      | ⚠️ Archivo local             | ✅ privateMetadata    |
| **Backup**         | ❌ Manual                    | ✅ Automático (Clerk) |
| **Sincronización** | ❌ Problemas multi-instancia | ✅ Centralizado       |

## 🧪 Testing

### Build:

- ✅ `pnpm build` exitoso sin errores
- ✅ No hay errores de linter
- ✅ Dependencia `fs/promises` removida

### Validaciones necesarias en Vercel:

- [ ] Solicitar demo desde dashboard funciona
- [ ] Solicitud se guarda en Clerk privateMetadata
- [ ] Admin puede ver solicitudes en `/admin/solicitudes`
- [ ] Aprobar solicitud actualiza estado correctamente
- [ ] Rechazar solicitud actualiza estado correctamente
- [ ] Solicitudes persisten después de redeploy

## 📦 Impacto

**Archivos afectados:**

- `app/actions/demo-requests.ts` (modificado)

**Breaking changes:** Ninguno

**Migración de datos:**

- Las solicitudes antiguas en `.data/demo-requests.json` NO se migran automáticamente
- Si existen solicitudes antiguas, se pueden migrar manualmente a Clerk
- Nuevas solicitudes usan el nuevo sistema

## 🔐 Seguridad

- ✅ `privateMetadata` no es accesible desde el cliente
- ✅ Solo admins pueden ver todas las solicitudes
- ✅ Usuarios solo ven sus propias solicitudes
- ✅ Autenticación verificada con `auth()` de Clerk

## 📊 Estructura de Acceso

### **Usuario regular:**

- Puede crear solicitudes (se guardan en su `privateMetadata`)
- Puede ver sus propias solicitudes vía `getClientRequests(userId)`

### **Admin:**

- Puede ver todas las solicitudes vía `getAllRequests()`
- Puede aprobar/rechazar solicitudes
- Puede filtrar por estado (pending, approved, rejected)

## ⚠️ Consideraciones

### **Límites de Clerk:**

- `privateMetadata` tiene un límite de **~8KB por usuario**
- Cada solicitud ocupa ~500 bytes
- Límite estimado: **~16 solicitudes por usuario**
- Si se excede, considerar:
  - Limpiar solicitudes antiguas (>6 meses)
  - Mover a base de datos externa (Firebase, Supabase)

### **Performance:**

- `loadRequests()` itera sobre todos los usuarios
- Con 500 usuarios, puede tardar 2-3 segundos
- Considerar caché si el volumen crece
- Alternativa: Usar base de datos dedicada

## 🚀 Próximos Pasos (Opcional)

- [ ] Implementar limpieza automática de solicitudes antiguas
- [ ] Agregar paginación en `loadRequests()` para mejor performance
- [ ] Considerar migración a Firebase/Supabase si escala
- [ ] Agregar analytics de solicitudes (tasa de aprobación, tiempo de respuesta)

