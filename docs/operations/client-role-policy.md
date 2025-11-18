# Política de Roles de Cliente

## 🎯 Estrategia Actual

**Por defecto, todos los usuarios autenticados son clientes, excepto los admins.**

### Lógica de Roles:

```typescript
// ✅ Usuario SIN metadata → Cliente (acceso a /dashboard)
// ✅ Usuario con role: "client" → Cliente (acceso a /dashboard)
// ✅ Usuario con role: "user" → Cliente (acceso a /dashboard)
// ❌ Usuario con role: "admin" → Admin (acceso a /admin)
```

## 📋 Cambios Implementados

### 1. **Panel de Admin - Lista de Clientes** (`app/admin/clientes/page.tsx`)

**Antes:**
```typescript
.filter((entry) => entry.metadata.role === "client")
// ❌ Solo mostraba usuarios con rol "client" explícito
```

**Ahora:**
```typescript
.filter((entry) => entry.metadata.role !== "admin")
// ✅ Muestra TODOS los usuarios excepto admins
```

### 2. **API de Clientes** (`app/api/admin/clients/route.ts`)

**Antes:**
```typescript
.filter((entry) => entry.metadata.role === "client")
// ❌ Solo retornaba usuarios con rol "client"
```

**Ahora:**
```typescript
.filter((entry) => entry.metadata.role !== "admin")
// ✅ Retorna todos los usuarios excepto admins
```

## 🔄 Flujo de Autenticación

### Usuario Nuevo (Sin Metadata):
```
Registro → Login → /auth/redirect
    ↓
Sin metadata
    ↓
No es admin → Considerado CLIENTE
    ↓
Redirige a /dashboard ✅
    ↓
Aparece en panel de admin ✅
```

### Usuario con Rol Explícito:
```
role: "client" → /dashboard ✅
role: "user"   → /dashboard ✅
role: "admin"  → /admin ✅
```

## 🎯 Comportamiento Por Área

| Área | Sin Metadata | role: "client" | role: "user" | role: "admin" |
|------|--------------|----------------|--------------|---------------|
| `/dashboard` | ✅ Acceso | ✅ Acceso | ✅ Acceso | ❌ Bloqueado |
| `/admin` | ❌ Bloqueado | ❌ Bloqueado | ❌ Bloqueado | ✅ Acceso |
| Panel Admin (lista) | ✅ Visible | ✅ Visible | ✅ Visible | ❌ Oculto |
| Asignar Demos | ✅ Permitido | ✅ Permitido | ✅ Permitido | N/A |

## 🛠️ Scripts Disponibles

### Asignar Rol de Cliente (Opcional)
```bash
pnpm tsx scripts/make-client.ts <user-id-o-email>
```

**Nota:** Ya NO es necesario ejecutar este script para que un usuario aparezca como cliente. Se hace automáticamente.

### Asignar Rol de Admin (Requerido)
```bash
pnpm tsx scripts/make-admin.ts <user-id-o-email>
```

**Nota:** SÍ es necesario para dar permisos de administrador.

## ✨ Ventajas de la Nueva Estrategia

1. ✅ **Onboarding Automático**: Usuarios nuevos automáticamente son clientes
2. ✅ **Menos Configuración**: No necesitas asignar rol "client" manualmente
3. ✅ **Menos Errores**: No hay usuarios "perdidos" sin rol
4. ✅ **Visible Inmediatamente**: Aparecen en el panel de admin desde el inicio
5. ✅ **Flexible**: Puedes seguir asignando rol "client" si lo prefieres

## 🔍 Identificación de Roles

### En el Código:

```typescript
import { isAdmin, getUserRole } from "@/lib/admin/permissions"

const role = getUserRole(user)
// null | "user" | "client" | "admin"

const isUserAdmin = isAdmin(user)
// true | false
```

### Lógica de Permisos:

```typescript
// ✅ Es Admin
if (isAdmin(user)) { /* acceso a /admin */ }

// ✅ Es Cliente (todos los demás)
if (!isAdmin(user)) { /* acceso a /dashboard */ }
```

## 📊 Métricas del Dashboard Admin

El conteo de "Clientes activos" ahora incluye:
- ✅ Usuarios con rol "client"
- ✅ Usuarios con rol "user"
- ✅ Usuarios sin rol definido
- ❌ Usuarios con rol "admin" (excluidos)

## 🧪 Casos de Prueba

### Test 1: Usuario Nuevo
1. Crear cuenta nueva (sin asignar rol)
2. Iniciar sesión
3. **Esperado:** Va a `/dashboard` ✅
4. Verificar en `/admin/clientes`
5. **Esperado:** Aparece en la lista ✅

### Test 2: Usuario Existente Sin Metadata
1. Usuario como Lucas (sin metadata)
2. Iniciar sesión
3. **Esperado:** Accede a `/dashboard` ✅
4. Verificar en panel de admin
5. **Esperado:** Ahora aparece en la lista ✅

### Test 3: Admin
1. Usuario con role: "admin"
2. Iniciar sesión
3. **Esperado:** Va a `/admin` ✅
4. Verificar en `/admin/clientes`
5. **Esperado:** NO aparece en la lista de clientes ✅

## 💡 Recomendaciones

### Para Producción:
- ✅ Mantener esta estrategia (menos fricción para clientes)
- ✅ Solo asignar rol explícito a admins
- ✅ Dejar que usuarios normales funcionen sin metadata

### Para Control Estricto (Opcional):
Si prefieres control explícito:
1. Cambiar filtro de vuelta a `role === "client"`
2. Ejecutar script para todos los usuarios nuevos
3. Requiere más mantenimiento manual

## 🔐 Seguridad

La seguridad sigue siendo robusta:
- ✅ Middleware bloquea acceso no autorizado
- ✅ Layouts verifican permisos
- ✅ API routes validan autenticación
- ✅ Solo admins pueden gestionar accesos

**La ausencia de metadata NO otorga privilegios extras**, solo acceso básico de cliente.
