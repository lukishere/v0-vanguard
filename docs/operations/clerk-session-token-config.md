# Configuración de Clerk Session Token Template

**Fecha:** 14 de Noviembre, 2025
**Estado:** ⚠️ PENDIENTE DE CONFIGURAR
**Prioridad:** 🔴 ALTA (requerido para que el middleware funcione correctamente)

---

## 🚨 Problema Actual

El middleware **NO puede acceder** a `publicMetadata.role` porque Clerk no lo incluye en `sessionClaims` por defecto.

### Solución Temporal Implementada

Por ahora, el sistema usa un enfoque híbrido:
- **Middleware:** Permite el paso si el usuario está autenticado
- **Admin Layout:** Verifica el rol usando `currentUser()` (que SÍ tiene acceso a `publicMetadata`)

Esta solución funciona, pero **no es óptima** porque:
- El middleware no puede bloquear acceso a rutas admin
- La verificación ocurre después de cargar el layout

---

## ✅ Solución Definitiva: Session Token Template

Necesitas configurar Clerk para que sincronice `publicMetadata` a `sessionClaims`.

### Paso 1: Acceder a Clerk Dashboard

1. Ve a: https://dashboard.clerk.com
2. Selecciona tu aplicación
3. En el menú lateral, ve a: **"Sessions"**
4. Click en: **"Edit"** en la sección "Customize session token"

### Paso 2: Configurar Session Token Template

En el editor de JSON, agrega esto:

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}",
    "demoAccess": "{{user.public_metadata.demoAccess}}"
  }
}
```

O si prefieres incluir todo el `publicMetadata`:

```json
{
  "publicMetadata": "{{user.public_metadata}}"
}
```

### Paso 3: Guardar y Verificar

1. Click en **"Apply changes"**
2. Los cambios se aplican inmediatamente
3. Los usuarios deben cerrar sesión y volver a entrar

---

## 🧪 Verificar que Funciona

### Opción A: Logs del Servidor

Con los logs actualizados del middleware, verás:

**Antes de configurar:**
```
🔍 [Middleware] Admin route check for: /admin/
  User ID: user_xxxxx
  📋 SessionClaims publicMetadata: undefined
  🎭 Detected role from sessionClaims: none
  ⚠️ Role not found in sessionClaims
  💡 Letting admin layout verify with clerkClient...
```

**Después de configurar:**
```
🔍 [Middleware] Admin route check for: /admin/
  User ID: user_xxxxx
  📋 SessionClaims publicMetadata: { role: 'admin' }
  🎭 Detected role from sessionClaims: admin
  ✅ ADMIN ACCESS GRANTED - User has admin role in sessionClaims
```

### Opción B: Consola del Navegador

Agrega este código temporal a cualquier página para ver los claims:

```typescript
import { useAuth } from '@clerk/nextjs'

function DebugClaims() {
  const { getToken } = useAuth()

  const showClaims = async () => {
    const token = await getToken({ template: 'default' })
    console.log('Token:', token)
    // Decodifica el JWT en: https://jwt.io
  }

  return <button onClick={showClaims}>Show Claims</button>
}
```

---

## 📖 Documentación Oficial de Clerk

- [Customize Session Tokens](https://clerk.com/docs/backend-requests/making/custom-session-token)
- [Session Claims](https://clerk.com/docs/backend-requests/resources/session-tokens)

---

## 🔄 Después de Configurar

### Paso 1: Actualizar Middleware (Opcional)

Una vez que confirmes que `sessionClaims` tiene el rol, puedes hacer el middleware más estricto:

```typescript
// Cambiar de:
console.log('  💡 Letting admin layout verify with clerkClient...')
return NextResponse.next()

// A:
console.log('  ❌ User does not have admin role')
console.log('  💡 To grant admin access, run: pnpm tsx scripts/make-admin.ts', userId)
return NextResponse.redirect(new URL('/dashboard/', req.url))
```

### Paso 2: Simplificar Admin Layout

El layout puede ser más simple porque el middleware ya bloqueó el acceso:

```typescript
// El middleware ya verificó, esto es solo logging
const hasAdminRole = isAdmin(user)
console.log('  ✅ Admin access already verified by middleware')
```

---

## ⚠️ Notas Importantes

### Session Token Template Afecta TODO

- Todos los usuarios verán los cambios
- Los tokens existentes NO se actualizan automáticamente
- Usuarios deben cerrar sesión y volver a entrar

### Refresh Tokens

Los tokens tienen un tiempo de vida (TTL):
- Por defecto: 1 hora
- Se renuevan automáticamente
- Pero el contenido solo cambia al hacer login nuevamente

### Desarrollo vs Producción

- Los cambios en Session Token Template se aplican a TODOS los ambientes
- No hay "desarrollo" vs "producción" para esto
- Ten cuidado al editar

---

## 🎯 Template Recomendado

Este es el template completo recomendado para Vanguard-IA:

```json
{
  "publicMetadata": "{{user.public_metadata}}",
  "userId": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "firstName": "{{user.first_name}}",
  "lastName": "{{user.last_name}}"
}
```

Esto incluye:
- ✅ `publicMetadata` completo (incluye `role` y `demoAccess`)
- ✅ Información básica del usuario
- ✅ Todo lo necesario para el middleware

---

## 🐛 Troubleshooting

### "Sigo sin ver el rol en sessionClaims"

1. **Guardaste el template?** Click en "Apply changes"
2. **Cerraste sesión?** Usuario debe hacer logout y login
3. **Sintaxis correcta?** Verifica comillas y llaves
4. **Template correcto?** Debe ser el "Default template"

### "El token es muy grande"

Si el token JWT crece demasiado:
- Limita lo que incluyes en el template
- Solo incluye `role`, no todo `publicMetadata`
- Considera usar `privateMetadata` para datos sensibles

### "Los cambios no se aplican"

- Verifica en Clerk Dashboard que se guardó
- Verifica que no haya errores de sintaxis
- Prueba con navegador en modo incógnito
- Verifica que el template es el "Default"

---

## ✅ Checklist de Configuración

- [ ] Accedido a Clerk Dashboard
- [ ] Encontrado sección "Sessions"
- [ ] Click en "Edit" Session Token
- [ ] Agregado template con `publicMetadata`
- [ ] Click en "Apply changes"
- [ ] Cerrado sesión en la app
- [ ] Iniciado sesión nuevamente
- [ ] Verificado logs del middleware
- [ ] Role aparece en sessionClaims
- [ ] Admin puede acceder a `/admin/`

---

## 📞 Soporte

Si tienes problemas configurando esto:
1. Verifica la sintaxis del JSON
2. Lee la documentación oficial de Clerk
3. Prueba con un template mínimo primero
4. Contacta soporte de Clerk si es necesario

---

**Una vez configurado, el sistema funcionará de forma óptima con el middleware bloqueando acceso desde el primer request.** 🚀


