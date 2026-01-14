# Solución: Botón de Acceso Clientes No Aparece

**Fecha:** 2026-01-12
**Prioridad:** ALTA
**Estado:** Diagnóstico en curso

---

## 🔍 Diagnóstico

El botón de "Acceso Clientes" no aparece aunque las URLs ya están corregidas.

---

## ⚠️ Posibles Causas

### 1. **Usuario ya está autenticado**

**Síntoma:**
- El botón NO aparece
- En su lugar aparece el botón "PORTAL"

**Solución:**
- Este es el comportamiento correcto
- El botón desaparece si estás autenticado
- Haz logout y el botón debería aparecer

---

### 2. **Clerk no está cargando (más probable)**

**Síntoma:**
- El botón NO aparece
- No aparece el botón "PORTAL" tampoco
- Puede aparecer un placeholder (cuadrado gris)

**Causa:**
- Clerk no se está cargando correctamente
- Variables de entorno no aplicadas (necesita redeploy)
- Error de JavaScript
- Keys incorrectas

**Solución:**
1. **Verificar que hiciste redeploy después de cambiar las variables:**
   - Ve a Vercel Dashboard → Deployments
   - Verifica que el último deployment sea después de cambiar las URLs
   - Si NO hiciste redeploy, hazlo ahora

2. **Verificar errores en consola:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Busca errores relacionados con Clerk
   - Copia cualquier error que veas

3. **Verificar que las variables estén correctas:**
   - Verifica que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
   - Verifica que `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/auth`
   - Verifica que `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/auth?mode=signup`

---

### 3. **Hard refresh necesario**

**Síntoma:**
- El navegador tiene la versión antigua cacheada

**Solución:**
- Presiona **Ctrl+Shift+R** (o **Cmd+Shift+R** en Mac)
- O cierra la pestaña y abre una nueva
- Esto fuerza al navegador a cargar la nueva versión

---

### 4. **Dominio no autorizado en Clerk**

**Síntoma:**
- Clerk no funciona en producción
- Errores de CORS o autenticación

**Solución:**
1. Ve a Clerk Dashboard → Domains
2. Verifica que `https://vanguard-ia.tech` esté en la lista
3. Si NO está, agrégalo

---

## 🔧 Solución Paso a Paso

### Paso 1: Verificar si estás autenticado

1. **Abre la página:**
   - `https://vanguard-ia.tech/`

2. **Revisa el header:**
   - Si ves el botón "PORTAL" → Estás autenticado (comportamiento correcto)
   - Si NO ves ningún botón → Continúa con el Paso 2

---

### Paso 2: Verificar redeploy

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Deployments:**
   - Verifica que el último deployment sea **después** de cambiar las URLs
   - Si el último deployment es **antes** de cambiar las URLs:
     - Haz clic en los tres puntos (⋮) del último deployment
     - Selecciona **"Redeploy"**
     - Espera a que termine

---

### Paso 3: Hard refresh

1. **En el navegador:**
   - Presiona **Ctrl+Shift+R** (Windows/Linux)
   - O **Cmd+Shift+R** (Mac)
   - Esto fuerza a recargar sin cache

2. **O cierra y abre una nueva pestaña:**
   - Cierra la pestaña actual
   - Abre una nueva y ve a `https://vanguard-ia.tech/`

---

### Paso 4: Verificar errores en consola

1. **Abre DevTools (F12):**
   - Ve a la pestaña **"Console"**
   - Busca errores en rojo

2. **Errores comunes:**
   - `Clerk: Failed to load` → Clerk no está cargando
   - `Clerk: Development keys...` → Keys incorrectas (pero ya están en producción)
   - `404` o `Not Found` → Rutas incorrectas
   - `Unauthorized` → Dominio no autorizado

3. **Si ves errores:**
   - Copia el error completo
   - Revisa la sección de troubleshooting según el error

---

### Paso 5: Verificar dominio en Clerk

1. **Ve a Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Selecciona tu aplicación

2. **Ve a Domains:**
   - Verifica que `https://vanguard-ia.tech` esté en la lista
   - Si NO está:
     - Haz clic en **"Add Domain"**
     - Ingresa: `https://vanguard-ia.tech`
     - Haz clic en **"Save"**

---

## ✅ Checklist de Verificación

- [ ] NO estás autenticado (haz logout si lo estás)
- [ ] Redeploy completado después de cambiar las URLs
- [ ] Hard refresh realizado (Ctrl+Shift+R)
- [ ] Variables de entorno correctas en Vercel:
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/auth`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/auth?mode=signup`
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
  - [ ] `CLERK_SECRET_KEY` = `sk_live_...`
- [ ] Dominio autorizado en Clerk Dashboard
- [ ] No hay errores en la consola del navegador
- [ ] Botón aparece en la página

---

## 🚨 Si el problema persiste

1. **Revisa los logs de Vercel:**
   - Ve a Vercel Dashboard → Tu proyecto → Logs
   - Busca errores relacionados con Clerk
   - Busca errores de build o runtime

2. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Copia todos los errores
   - Revisa la pestaña **"Network"** para ver si hay requests fallidos

3. **Verifica que el código esté correcto:**
   - El botón debería aparecer si `!isSignedIn` y `isLoaded`
   - Verifica que Clerk esté cargado correctamente

---

## 📝 Notas Importantes

1. **El botón desaparece si estás autenticado:**
   - Este es el comportamiento correcto
   - Si ves "PORTAL" en su lugar, estás autenticado

2. **Redeploy es CRÍTICO:**
   - Las variables de entorno solo se aplican después de un redeploy
   - Si cambiaste las variables pero NO hiciste redeploy, no se aplicarán

3. **Hard refresh es necesario:**
   - El navegador cachea JavaScript
   - Un hard refresh fuerza a cargar la nueva versión

---

## 🔧 Herramienta de Diagnóstico

Se ha creado una página de diagnóstico que muestra toda la información relevante:

**URL:** `/diagnostico`

Esta página muestra en tiempo real:
- Estado del botón (por qué aparece o no)
- Estado de Clerk (isLoaded, isSignedIn, etc.)
- Variables de entorno configuradas (valores sanitizados)
- Errores y advertencias
- Información del entorno

**Uso:**
1. Abre `https://vanguard-ia.tech/diagnostico` en producción
2. Revisa la información mostrada
3. Sigue las instrucciones que aparecen en la página

**API de Diagnóstico:**
También puedes consultar la API: `/api/diagnostico/clerk`

---

## 🔄 Siguiente Paso

1. **Primero:** Visita `/diagnostico` para ver el estado actual
2. **Segundo:** Verifica si hiciste redeploy después de cambiar las URLs
3. **Tercero:** Haz hard refresh (Ctrl+Shift+R)
4. **Cuarto:** Verifica errores en la consola
5. **Quinto:** Verifica que NO estés autenticado

Si después de estos pasos el botón aún no aparece, revisa los logs y errores específicos usando la herramienta de diagnóstico.
