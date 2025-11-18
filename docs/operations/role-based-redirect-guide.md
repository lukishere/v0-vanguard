# Guía de Redirección por Roles

## ✅ Implementación Completada

El sistema ahora redirige automáticamente a los usuarios según su rol:
- **Admins** → `/admin` (panel administrativo)
- **Clientes/Users** → `/dashboard` (portal de cliente)

## 🔒 Capas de Seguridad Implementadas

### 1. **Middleware** (`middleware.ts`)
- Intercepta peticiones a `/dashboard/*`
- Si el usuario es admin, redirige automáticamente a `/admin`
- Previene acceso antes de que se cargue la página

```typescript
// Detecta admins intentando acceder a /dashboard
if (isDashboardRoute(req) && userId && isUserAdmin) {
  redirect("/admin/")
}
```

### 2. **Dashboard de Cliente** (`app/dashboard/page.tsx`)
- Segunda capa de verificación en el servidor
- Verifica rol con `isAdmin(user)`
- Redirige a `/admin` si es admin

```typescript
const userIsAdmin = isAdmin(user)
if (userIsAdmin) {
  redirect("/admin/")
}
```

### 3. **Redirección Post-Login** (`app/auth/redirect/page.tsx`)
- Página inteligente que detecta el rol del usuario
- Redirige automáticamente después de iniciar sesión
- Admin → `/admin`, Cliente → `/dashboard`

### 4. **Layout de Admin** (`app/admin/layout.tsx`)
- Protege todas las rutas `/admin/*`
- Verifica que el usuario tenga rol `admin`
- Redirige clientes a `/dashboard`

## 🎯 Flujo de Autenticación

```mermaid
Usuario inicia sesión
    ↓
/auth/redirect
    ↓
Verificar rol
    ├─ Admin → /admin
    └─ Cliente → /dashboard
```

### Escenarios:

**1. Admin inicia sesión:**
```
/clientes → Login → /auth/redirect → /admin ✅
```

**2. Cliente inicia sesión:**
```
/clientes → Login → /auth/redirect → /dashboard ✅
```

**3. Admin intenta acceder a /dashboard:**
```
/dashboard → Middleware detecta → Redirect a /admin ✅
```

**4. Cliente intenta acceder a /admin:**
```
/admin → Layout verifica → Redirect a /dashboard ✅
```

## 📝 Archivos Modificados

1. ✅ `middleware.ts` - Bloqueo de admins en dashboard
2. ✅ `app/dashboard/page.tsx` - Verificación de rol admin
3. ✅ `app/auth/redirect/page.tsx` - Redirección inteligente (NUEVO)
4. ✅ `components/client-sign-in.tsx` - Actualizado redirect URLs
5. ✅ `app/clientes/[[...rest]]/page.tsx` - Actualizado redirect URLs

## 🧪 Cómo Probar

### Test 1: Login como Admin
1. Ir a `/clientes`
2. Iniciar sesión con cuenta admin (ej: Susaku)
3. **Resultado esperado:** Redirige automáticamente a `/admin`
4. Intentar acceder a `/dashboard` manualmente
5. **Resultado esperado:** Inmediatamente redirige a `/admin`

### Test 2: Login como Cliente
1. Ir a `/clientes`
2. Iniciar sesión con cuenta de cliente
3. **Resultado esperado:** Redirige a `/dashboard`
4. Intentar acceder a `/admin` manualmente
5. **Resultado esperado:** Redirige de vuelta a `/dashboard`

### Test 3: URLs Directas
- Admin visitando `localhost:3000/dashboard` → Redirige a `/admin` ✅
- Cliente visitando `localhost:3000/admin` → Redirige a `/dashboard` ✅

## 🔍 Logs de Depuración

El sistema registra logs en la consola del servidor:

```
🚫 [Middleware] Admin intentando acceder a /dashboard, redirigiendo a /admin
🔄 [Auth Redirect] Admin detected, redirecting to /admin
🔒 [Dashboard] Admin detectado, redirigiendo a /admin
✅ [Admin Layout] ADMIN ACCESS GRANTED
```

## 🎨 URLs Configuradas

**Post-Login:**
- `afterSignInUrl`: `/auth/redirect/`
- `afterSignUpUrl`: `/auth/redirect/`
- `fallbackRedirectUrl`: `/auth/redirect/`

**Protección de Rutas:**
- `/dashboard/*` - Solo clientes
- `/admin/*` - Solo admins
- `/auth/redirect` - Todos autenticados

## 🔐 Roles en Clerk

Los roles se almacenan en `publicMetadata`:

```json
{
  "publicMetadata": {
    "role": "admin"  // o "client" o "user"
  }
}
```

Para cambiar roles, usar los scripts:
```bash
# Hacer admin
pnpm tsx scripts/make-admin.ts <user_id>

# Hacer cliente
pnpm tsx scripts/make-client.ts <user_id>
```

## ⚡ Rendimiento

- **Middleware:** Verificación en edge (ultra rápida)
- **Server Components:** Verificación en servidor (sin client-side)
- **Zero Flash:** Usuario nunca ve contenido incorrecto

## 🛠️ Mantenimiento

Si necesitas agregar más roles:

1. Actualizar `VanguardRole` en `lib/admin/permissions.ts`
2. Agregar lógica en `/auth/redirect/page.tsx`
3. Crear layouts específicos si es necesario
4. Actualizar middleware si requiere rutas especiales

## ✨ Beneficios

1. ✅ **Separación clara** - Admins y clientes en espacios separados
2. ✅ **Seguridad multi-capa** - 4 niveles de protección
3. ✅ **UX fluida** - Redirección automática sin confusión
4. ✅ **Sin flash de contenido** - Verificación antes de renderizar
5. ✅ **Fácil mantenimiento** - Lógica centralizada y clara
