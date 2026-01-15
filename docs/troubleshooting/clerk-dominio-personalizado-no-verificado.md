# Clerk: Dominio Personalizado No Verificado Causando Error CSP

**Fecha:** 2026-01-12
**Prioridad:** CRÍTICA
**Estado:** 🔍 EN INVESTIGACIÓN

---

## 🔍 Problema Identificado

**Error en consola:**
```
Loading the script `https://clerk.vanguard-ia.tech/npm/@clerk/clerk-js@5/dis...`
violates the following Content Security Policy directive
```

**Situación:**
- Clerk intenta cargar scripts desde `clerk.vanguard-ia.tech` (dominio personalizado)
- El dominio personalizado NO está verificado en Clerk Dashboard (0/5 Verified)
- La CSP fue actualizada para permitir el dominio, pero el problema persiste

---

## ⚠️ Causa Raíz Probable

Si el dominio personalizado NO está verificado pero está configurado en Clerk Dashboard, Clerk podría estar intentando usarlo de todos modos, causando errores.

**Solución recomendada:** Deshabilitar el dominio personalizado en Clerk Dashboard y usar los dominios estándar de Clerk.

---

## ✅ Solución: Deshabilitar Dominio Personalizado en Clerk

### Paso 1: Ir a Clerk Dashboard

1. Ve a: https://dashboard.clerk.com
2. Selecciona tu aplicación
3. Ve a **"Domains"** en el menú lateral

### Paso 2: Verificar Estado del Dominio

- Si ves `vanguard-ia.tech` o `clerk.vanguard-ia.tech` con estado **"Unverified"**
- Esto confirma que el dominio NO está correctamente configurado

### Paso 3: Eliminar/Deshabilitar Dominio Personalizado

**Opción A: Eliminar el dominio personalizado (Recomendado para solución inmediata)**

1. En Clerk Dashboard → Domains → vanguard-ia.tech
2. Ve a la sección **"Danger zone"** (al final de la página)
3. Haz clic en el botón rojo **"Change domain"**
4. Confirma para eliminar/desactivar el dominio personalizado
5. Esto hará que Clerk use automáticamente los dominios estándar

**Opción B: Configurar registros DNS (Solo si realmente necesitas dominio personalizado)**

Si quieres mantener el dominio personalizado, necesitas configurar los 5 registros DNS CNAME:
1. `clerk` → `frontend-api.clerk.services`
2. `accounts` → `accounts.clerk.services`
3. `clkmail` → `mail.812wv7u7rj15.clerk.services`
4. `clk._domainkey` → `dkim1.812wv7u7rj15.clerk.services`
5. `clk2._domainkey` → `dkim2.812wv7u7rj15.clerk.services`

**NOTA:** Esto puede tomar horas/días para verificar. Para solución inmediata, usa Opción A.

### Paso 4: Verificar que Funciona

Después de eliminar/deshabilitar el dominio personalizado:

1. Clerk debería usar automáticamente los dominios estándar:
   - `https://*.clerk.com`
   - `https://*.clerk.accounts.dev`

2. La CSP actual ya permite estos dominios (están en la configuración)

3. Espera 1-2 minutos para que Clerk actualice la configuración

4. Haz hard refresh en el navegador (Ctrl+Shift+R)

5. Verifica que el error de CSP desaparece

---

## 🔄 Alternativa: Verificar el Dominio Personalizado

Si realmente quieres usar el dominio personalizado, necesitas:

### Paso 1: Configurar DNS

1. Ve a tu proveedor DNS (donde está configurado `vanguard-ia.tech`)
2. Agrega los registros CNAME que Clerk solicita
3. Estos registros deberían apuntar a Clerk

### Paso 2: Esperar Verificación

1. Vuelve a Clerk Dashboard → Domains
2. Espera a que todos los registros muestren "Verified" (5/5)
3. Esto puede tomar horas

### Paso 3: Verificar Funcionamiento

1. Una vez verificado, Clerk debería usar el dominio personalizado
2. La CSP ya permite el dominio (está configurada)
3. Verifica que funciona correctamente

---

## 📋 Recomendación

**Para resolver el problema INMEDIATAMENTE:**

1. ✅ **Deshabilitar/Eliminar dominio personalizado** (Opción A)
2. ✅ **Usar dominios estándar de Clerk** (ya permitidos en CSP)
3. ✅ **No requiere cambios de código**
4. ✅ **No requiere configuración DNS**

**Para usar dominio personalizado en el futuro:**

1. Configurar DNS correctamente
2. Esperar verificación completa (5/5)
3. Luego habilitar el dominio personalizado

---

## 🔍 Verificación Post-Solución

Después de deshabilitar el dominio personalizado:

- [ ] No hay errores de CSP en la consola
- [ ] Clerk carga correctamente
- [ ] El botón "Acceso Clientes" aparece
- [ ] El formulario de login/signup funciona
- [ ] Los scripts de Clerk cargan desde `*.clerk.com` (no desde dominio personalizado)

---

## 📝 Notas Importantes

1. **Los dominios estándar de Clerk YA están permitidos en la CSP:**
   - `https://*.clerk.com` ✅
   - `https://*.clerk.accounts.dev` ✅
   - No se necesita cambiar la CSP

2. **El dominio personalizado es OPCIONAL:**
   - Clerk funciona perfectamente sin él
   - Solo es necesario si quieres usar tu propio dominio
   - Si no está verificado, causa problemas

3. **Deshabilitar dominio personalizado NO afecta funcionalidad:**
   - Clerk seguirá funcionando normalmente
   - Solo cambiará el dominio desde el que se cargan los scripts
   - Los usuarios no notarán diferencia

---

## 🚨 Si el Problema Persiste

1. **Verificar que el dominio fue eliminado:**
   - Ve a Clerk Dashboard → Domains
   - Confirma que NO hay dominios personalizados configurados

2. **Hard refresh del navegador:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Limpiar caché del navegador:**
   - Ctrl+Shift+Delete
   - Selecciona "Cached images and files"
   - Limpiar

4. **Probar en modo incógnito:**
   - Abre una ventana incógnita
   - Visita `https://vanguard-ia.tech/clientes/`
   - Verifica si el error persiste

---

## 📚 Referencias

- [Clerk Custom Domains Documentation](https://clerk.com/docs/custom-domains/overview)
- [Clerk Dashboard - Domains](https://dashboard.clerk.com)
