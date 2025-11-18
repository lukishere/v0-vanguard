# 🚀 Quick Start: Gestión de Usuarios y Demos

Esta guía te ayudará a empezar a usar el sistema de gestión de clientes y demos.

---

## Paso 1: Asegúrate de Tener Rol Admin

Si aún no tienes acceso de administrador:

```bash
pnpm tsx scripts/make-admin.ts tu-email@vanguard-ia.tech
```

Luego **cierra sesión y vuelve a entrar** para refrescar tus permisos.

---

## Paso 2: Agregar Tu Primer Cliente

### Opción A: Cliente Existente en Clerk

Si el usuario ya se registró en `/clientes/`:

```bash
pnpm tsx scripts/make-client.ts cliente@empresa.com
```

### Opción B: Nuevo Cliente

1. Invita al cliente a registrarse en: `https://tu-dominio.com/clientes/`
2. Una vez registrado, ejecuta:
   ```bash
   pnpm tsx scripts/make-client.ts cliente@empresa.com
   ```

---

## Paso 3: Asignar Demos al Cliente

1. **Accede al panel de admin:**
   - Ve a: `http://localhost:3000/admin/clientes` (o tu dominio en producción)

2. **Verás la lista de clientes:**
   - Deberías ver al cliente que acabas de crear
   - Si no lo ves, verifica que ejecutaste el script correctamente

3. **Asignar una demo:**
   - En la tarjeta del cliente, busca el botón "Asignar Demo"
   - Selecciona una demo del catálogo (ej: "Vanguard Copilot")
   - Establece la duración (ej: 30 días)
   - Confirma la asignación

4. **El cliente verá la demo:**
   - El cliente debe cerrar sesión y volver a entrar
   - Accede a: `/dashboard/`
   - Verá la demo en la pestaña "Demos Activas"

---

## Paso 4: Verificar Conectividad

### Como Admin:

1. Ve a `/admin/clientes`
2. Deberías ver:
   - Nombre del cliente
   - Email
   - Última actividad
   - Demos asignadas con días restantes

### Como Cliente:

1. Inicia sesión como cliente
2. Ve a `/dashboard/`
3. Deberías ver:
   - Demos activas (las que el admin asignó)
   - Días restantes de cada demo
   - Botones para abrir demos

---

## 🎯 Ejemplo Completo

```bash
# 1. Convertir usuario en admin (solo una vez)
pnpm tsx scripts/make-admin.ts suzakubcn@gmail.com

# 2. Convertir usuario en cliente
pnpm tsx scripts/make-client.ts cliente1@test.com

# 3. Acceder a admin panel
# http://localhost:3000/admin/clientes

# 4. Asignar demo "Vanguard Copilot" por 30 días (via UI)

# 5. Cliente accede a su dashboard
# http://localhost:3000/dashboard/
# Verá "Vanguard Copilot" con 30 días restantes
```

---

## ❌ Problemas Comunes

### "No veo al cliente en el admin"

**Causa:** El cliente no tiene `role: "client"` en Clerk

**Solución:**
```bash
pnpm tsx scripts/make-client.ts <email-del-cliente>
```

### "El cliente no ve las demos asignadas"

**Causa:** SessionClaims no actualizados

**Solución:**
1. Cliente debe cerrar sesión
2. Volver a iniciar sesión
3. Ahora verá las demos

### "Access denied al admin panel"

**Causa:** No tienes rol admin

**Solución:**
```bash
pnpm tsx scripts/make-admin.ts <tu-email>
# Luego cierra sesión y vuelve a entrar
```

---

## 🔍 Verificar en Clerk Dashboard

1. Ve a: [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Selecciona tu aplicación
3. Ve a "Users"
4. Selecciona un usuario
5. Mira "Public metadata":

**Admin:**
```json
{
  "role": "admin"
}
```

**Cliente:**
```json
{
  "role": "client",
  "demoAccess": [
    {
      "demoId": "vanguard-copilot",
      "assignedAt": "2025-11-14T10:00:00.000Z",
      "expiresAt": "2025-12-14T10:00:00.000Z",
      "daysRemaining": 30,
      "usageDays": 0,
      "totalDays": 30,
      "sessionsCount": 0
    }
  ]
}
```

---

## 📖 Próximos Pasos

- **Explorar demos disponibles:** `/lib/demos/catalog.ts`
- **Personalizar accesos:** Editar duración, revocar demos
- **Ver analytics:** `/admin/analytics` (próximamente)
- **Documentación completa:** `/docs/operations/user-management-guide.md`

---

**¡Listo! Ya puedes gestionar clientes y demos con Clerk 🎉**


