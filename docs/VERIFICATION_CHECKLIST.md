# ✅ Checklist de Verificación - Migración Clerk

Usa este checklist para verificar que la migración de whitelist a Clerk funciona correctamente.

---

## 🔐 Paso 1: Configuración de Admin

- [ ] Ejecutado: `pnpm tsx scripts/make-admin.ts <mi-email>`
- [ ] Cerrada sesión y vuelta a entrar
- [ ] Puedo acceder a `/admin/` sin errores
- [ ] Puedo acceder a `/admin/clientes` sin errores
- [ ] No veo mensaje "Access denied"

**Verificación en Clerk Dashboard:**
- [ ] Mi usuario tiene `publicMetadata.role = "admin"`

---

## 👥 Paso 2: Gestión de Clientes

### Crear Cliente de Prueba

- [ ] Registrado un usuario de prueba en `/clientes/`
- [ ] Ejecutado: `pnpm tsx scripts/make-client.ts <email-prueba>`
- [ ] Script muestra: "✅ Rol de client asignado correctamente!"

**Verificación en Clerk Dashboard:**
- [ ] Usuario de prueba tiene `publicMetadata.role = "client"`
- [ ] Usuario de prueba tiene `publicMetadata.demoAccess = []`

### Ver Cliente en Admin

- [ ] Accedo a `/admin/clientes` como admin
- [ ] Veo el cliente de prueba en la lista
- [ ] Muestra nombre, email, última actividad correctos
- [ ] Muestra "Sin demos asignadas" (aún no asigné ninguna)

---

## 🎮 Paso 3: Asignación de Demos

### Asignar Demo desde Admin

- [ ] En `/admin/clientes`, selecciono el cliente de prueba
- [ ] Click en botón de asignar demo
- [ ] Selecciono una demo (ej: "Vanguard Copilot")
- [ ] Establezco duración (ej: 30 días)
- [ ] Confirmo la asignación
- [ ] Veo confirmación de éxito
- [ ] En la tarjeta del cliente, ahora veo la demo asignada

**Verificación en Clerk Dashboard:**
- [ ] `publicMetadata.demoAccess` del cliente ahora tiene un elemento
- [ ] El elemento tiene: `demoId`, `assignedAt`, `expiresAt`, `daysRemaining`, etc.

---

## 📊 Paso 4: Dashboard del Cliente

### Verificar Vista del Cliente

- [ ] Inicio sesión como cliente de prueba
- [ ] Accedo a `/dashboard/`
- [ ] **IMPORTANTE:** Si no veo la demo, cierro sesión y vuelvo a entrar
- [ ] Veo la demo asignada en sección "Demos Activas"
- [ ] Muestra el nombre correcto de la demo
- [ ] Muestra los días restantes correctos (ej: "30 días restantes")
- [ ] Puedo hacer click en la demo

---

## 🔄 Paso 5: Conectividad Admin ↔ Cliente

### Test de Sincronización

**Como Admin:**
- [ ] Asigno una segunda demo al cliente
- [ ] Veo ambas demos en la tarjeta del cliente

**Como Cliente:**
- [ ] Cierro sesión y vuelvo a entrar
- [ ] Veo ambas demos en "Demos Activas"

**Como Admin:**
- [ ] Revoco una de las demos
- [ ] Solo veo una demo en la tarjeta del cliente

**Como Cliente:**
- [ ] Cierro sesión y vuelvo a entrar
- [ ] Solo veo una demo en "Demos Activas"

✅ **Si todo funciona, la sincronización es correcta**

---

## 🚫 Paso 6: Verificar Eliminación de Whitelist

### Archivos

- [ ] No existe el archivo: `lib/admin/admin-whitelist.ts`
- [ ] `middleware.ts` no importa `admin-whitelist`
- [ ] `app/admin/layout.tsx` no importa `admin-whitelist`

### Código

```bash
# Ejecutar búsqueda:
grep -r "admin-whitelist" app/ lib/ --exclude-dir=node_modules
```

- [ ] Solo aparece en archivos de documentación (`docs/`)
- [ ] No aparece en archivos de código (`app/`, `lib/`, `components/`)

---

## 🔒 Paso 7: Seguridad y Permisos

### Test de Restricciones

**Usuario sin rol:**
- [ ] Registro un nuevo usuario SIN ejecutar script make-client/make-admin
- [ ] Intento acceder a `/admin/` → **DEBE REDIRIGIR** a `/dashboard/`
- [ ] Intento acceder a `/admin/clientes` → **DEBE REDIRIGIR** a `/dashboard/`

**Usuario con rol client:**
- [ ] Inicio sesión como cliente
- [ ] Intento acceder a `/admin/` → **DEBE REDIRIGIR** a `/dashboard/`
- [ ] Puedo acceder a `/dashboard/` sin problemas

**Usuario con rol admin:**
- [ ] Inicio sesión como admin
- [ ] Puedo acceder a `/admin/` sin problemas
- [ ] Puedo acceder a `/dashboard/` sin problemas
- [ ] Puedo ver y editar clientes en `/admin/clientes`

---

## 📱 Paso 8: Experiencia de Usuario

### Dashboard del Cliente

- [ ] Header muestra nombre del cliente correctamente
- [ ] Si hay demos activas, muestra pestañas: "Activas", "En Desarrollo", "Disponibles"
- [ ] Si no hay demos, muestra mensaje apropiado
- [ ] Banner de conversión aparece cuando quedan pocos días
- [ ] Botón de logout funciona

### Panel de Admin

- [ ] Sidebar muestra navegación correcta
- [ ] Dashboard admin muestra métricas
- [ ] Página de clientes carga sin errores
- [ ] Puedo asignar/revocar demos sin errores
- [ ] Los cambios se reflejan inmediatamente en la UI

---

## 🐛 Paso 9: Logs y Debugging

### Console Logs (Desarrollo)

**Al acceder a `/admin/` como admin:**
```
🔍 [Middleware] Admin route check for: /admin/
  User ID: user_xxxxx
  ✅ ADMIN ACCESS GRANTED - User has admin role
```

**Al acceder a `/admin/` como no-admin:**
```
🔍 [Middleware] Admin route check for: /admin/
  User ID: user_yyyyy
  ❌ User does not have admin role
  💡 Current role: client
  💡 To grant admin access, run: pnpm tsx scripts/make-admin.ts user_yyyyy
[Middleware] Redirecting non-admin user to dashboard
```

- [ ] Logs del middleware son correctos
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del servidor

---

## 📚 Paso 10: Documentación

- [ ] He leído `INSTRUCCIONES_PARA_TI.md`
- [ ] He revisado `docs/QUICK_START.md`
- [ ] Entiendo cómo usar `make-admin.ts` y `make-client.ts`
- [ ] Sé dónde encontrar la guía completa (`docs/operations/user-management-guide.md`)

---

## ✨ Resultado Final

Si todos los checkboxes están marcados ✅:

🎉 **¡Migración completada con éxito!**

El sistema ahora:
- ✅ Usa Clerk como fuente única de verdad
- ✅ Muestra clientes reales (no ficticios)
- ✅ Permite asignar demos dinámicamente
- ✅ Sincroniza admin ↔ cliente en tiempo real
- ✅ Es seguro y escalable
- ✅ No depende de whitelist hardcodeada

---

## ❌ Si Algo Falla

### Revisar:

1. **Logs del servidor** - Errores de Clerk, permisos, metadata
2. **Clerk Dashboard** - Verificar `publicMetadata` de usuarios
3. **SessionClaims** - Usuario debe cerrar/abrir sesión después de cambios
4. **Documentación** - `docs/operations/user-management-guide.md` → Troubleshooting

### Reportar:

- Describe qué checkbox falló
- Copia logs de error
- Verifica metadata en Clerk Dashboard
- Lee sección de troubleshooting en la documentación

---

**Fecha de verificación:** _____________
**Verificado por:** _____________
**Resultado:** ⬜ Aprobado  ⬜ Con observaciones

---

## 📝 Notas Adicionales

_Espacio para notas personales sobre la migración:_

```
[Escribe aquí cualquier observación, problema encontrado, o mejora sugerida]








```



