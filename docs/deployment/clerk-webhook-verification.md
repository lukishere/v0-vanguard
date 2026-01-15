# Verificación de Webhook de Clerk y Botón de Clientes

**Fecha:** 2026-01-12
**Estado:** Guía de verificación
**Prioridad:** ALTA

---

## 🔍 Verificación del Webhook

### ⚠️ Error 405 es NORMAL

El error HTTP 405 que ves al visitar `https://vanguard-ia.tech/api/webhooks/clerk/` desde el navegador es **normal y esperado**.

**Razón:**
- El endpoint `/api/webhooks/clerk` **solo acepta POST** (no GET)
- Cuando visitas la URL desde el navegador, hace una petición **GET**
- Por eso obtienes "Method Not Allowed" (405)

**Esto significa que el endpoint está configurado correctamente.** ✅

---

## ✅ Cómo Verificar que el Webhook Funciona

### Paso 1: Verificar en Clerk Dashboard

1. **Ve a Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Inicia sesión

2. **Ve a Webhooks:**
   - En el menú lateral, busca **"Webhooks"**
   - Haz clic en **"Webhooks"**

3. **Verificar que existe un webhook:**
   - Deberías ver un webhook configurado
   - La URL debería ser: `https://vanguard-ia.tech/api/webhooks/clerk`
   - El evento debería ser: `user.created`

4. **Verificar el estado del webhook:**
   - Haz clic en el webhook para ver detalles
   - Deberías ver el **"Signing Secret"** (empieza con `whsec_...`)
   - Revisa los logs del webhook para ver si hay eventos recientes

---

### Paso 2: Verificar en Vercel

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Settings → Environment Variables:**
   - En el menú lateral, haz clic en **"Settings"**
   - Luego haz clic en **"Environment Variables"**

3. **Verificar `CLERK_WEBHOOK_SECRET`:**
   - Busca `CLERK_WEBHOOK_SECRET`
   - Verifica que tenga un valor (debe empezar con `whsec_...`)
   - Verifica que esté marcado para **Production** ✅

4. **Si NO existe `CLERK_WEBHOOK_SECRET`:**
   - Ve a Clerk Dashboard → Webhooks
   - Copia el **"Signing Secret"** del webhook
   - Agrégalo a Vercel como `CLERK_WEBHOOK_SECRET`
   - Marca **Production** ✅
   - Haz clic en **"Save"**
   - Haz un **redeploy**

---

### Paso 3: Probar el Webhook

1. **Crear un usuario de prueba:**
   - Ve a `https://vanguard-ia.tech/clientes/`
   - Registra un nuevo usuario
   - Completa el proceso de registro

2. **Verificar en Clerk Dashboard:**
   - Ve a Clerk Dashboard → Webhooks → Tu webhook
   - Revisa los **"Logs"** o **"Events"**
   - Deberías ver un evento `user.created` reciente
   - Verifica que el status sea **"Success"** (200) ✅

3. **Verificar en Vercel Logs:**
   - Ve a Vercel Dashboard → Tu proyecto → **"Logs"**
   - Busca logs con `[Webhook]`
   - Deberías ver: `✅ [Webhook] New user created: ...`
   - Deberías ver: `✅ [Webhook] Initialized metadata for user: ...`

---

## 🔍 Verificación del Botón de Clientes

### ¿Dónde está el botón?

El botón de "Clientes" está en el **header** de la página principal:
- **Ubicación:** `components/header.tsx` (línea 85-90)
- **Texto:** Depende del idioma, pero generalmente dice "Solicitar Cotización" o "Acceso Clientes"
- **URL:** `/clientes/`

### Paso 1: Verificar que el botón aparece

1. **Ve a la página principal:**
   - `https://vanguard-ia.tech/`

2. **Verifica el header:**
   - En la parte superior de la página, deberías ver un botón
   - El botón debería estar en la esquina superior derecha
   - Si estás **no autenticado**, deberías ver el botón de "Clientes"
   - Si estás **autenticado**, deberías ver el botón "PORTAL" (no el de clientes)

3. **Si el botón NO aparece:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Busca errores de JavaScript
   - Verifica que no haya errores de Clerk

---

### Paso 2: Verificar que el botón funciona

1. **Haz clic en el botón:**
   - Deberías ser redirigido a `/clientes/`
   - La URL debería cambiar a `https://vanguard-ia.tech/clientes/`

2. **Si el botón NO funciona (no navega):**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Busca errores de JavaScript
   - Verifica que Next.js esté funcionando correctamente

3. **Si hay errores en la consola:**
   - Copia los errores
   - Verifica que Clerk esté configurado correctamente
   - Verifica que las keys de Clerk sean válidas

---

### Paso 3: Verificar la página /clientes/

1. **Ve a `/clientes/`:**
   - Deberías ver una página con el título "Acceso Clientes"
   - Deberías ver un formulario de login/signup de Clerk

2. **Si la página NO carga:**
   - Verifica que la ruta exista: `app/clientes/[[...rest]]/page.tsx`
   - Verifica que no haya errores en los logs de Vercel
   - Verifica que Clerk esté configurado correctamente

3. **Si ves errores de autenticación:**
   - Verifica que las keys de Clerk en Vercel sean correctas
   - Verifica que el dominio esté autorizado en Clerk Dashboard
   - Verifica que estés usando keys de **producción** (no test)

---

## 🔧 Troubleshooting

### Problema: Error 405 en el webhook

**Solución:** Este error es **normal**. El webhook solo acepta POST, no GET. No es un problema.

### Problema: El botón de clientes no aparece

**Posibles causas:**
1. Estás autenticado (el botón desaparece si estás logueado)
2. Hay un error de JavaScript
3. Clerk no está cargado correctamente

**Solución:**
1. Verifica que NO estés autenticado
2. Abre DevTools y revisa errores en la consola
3. Verifica que Clerk esté configurado correctamente

### Problema: El botón no navega a /clientes/

**Posibles causas:**
1. Error de JavaScript
2. Next.js no está funcionando
3. El link está mal configurado

**Solución:**
1. Abre DevTools y revisa errores
2. Verifica que Next.js esté funcionando
3. Verifica que el link en `components/header.tsx` sea correcto: `<Link href="/clientes/">`

### Problema: La página /clientes/ no carga

**Posibles causas:**
1. Error en el servidor
2. Clerk no está configurado
3. El dominio no está autorizado

**Solución:**
1. Verifica los logs de Vercel
2. Verifica que Clerk esté configurado en Vercel
3. Verifica que el dominio esté autorizado en Clerk Dashboard

### Problema: El webhook no recibe eventos

**Posibles causas:**
1. El webhook no está configurado en Clerk
2. La URL del webhook es incorrecta
3. El `CLERK_WEBHOOK_SECRET` es incorrecto

**Solución:**
1. Verifica que el webhook esté configurado en Clerk Dashboard
2. Verifica que la URL sea correcta: `https://vanguard-ia.tech/api/webhooks/clerk`
3. Verifica que `CLERK_WEBHOOK_SECRET` en Vercel coincida con el secret en Clerk Dashboard
4. Haz un redeploy después de actualizar el secret

---

## ✅ Checklist de Verificación

Después de completar todas las verificaciones:

- [ ] Error 405 en webhook es normal (no es un problema)
- [ ] Webhook configurado en Clerk Dashboard
- [ ] URL del webhook correcta: `https://vanguard-ia.tech/api/webhooks/clerk`
- [ ] Evento `user.created` seleccionado en Clerk
- [ ] `CLERK_WEBHOOK_SECRET` configurado en Vercel
- [ ] `CLERK_WEBHOOK_SECRET` coincide con Clerk Dashboard
- [ ] Webhook recibe eventos (verificar logs)
- [ ] Botón de clientes aparece en la página principal (si no estás autenticado)
- [ ] Botón de clientes navega a `/clientes/`
- [ ] Página `/clientes/` carga correctamente
- [ ] Formulario de login/signup aparece en `/clientes/`

---

## 📝 Notas Importantes

1. **Error 405 es NORMAL:**
   - El webhook endpoint solo acepta POST
   - No es un error, es el comportamiento esperado

2. **El botón desaparece si estás autenticado:**
   - Este es el comportamiento correcto
   - Si estás autenticado, verás el botón "PORTAL" en su lugar

3. **El webhook solo funciona en producción:**
   - Los webhooks de Clerk solo funcionan con URLs públicas
   - No funcionan con `localhost` a menos que uses un túnel (ngrok, etc.)

---

## 🔄 Siguiente Paso

Después de verificar el webhook y el botón de clientes:
1. Si todo está correcto, el sistema debería funcionar normalmente
2. Si hay problemas, sigue la sección de troubleshooting
3. Si el botón no funciona, verifica los logs de Vercel y la consola del navegador
