# Configuración Pendiente - Verificación Completa

**Fecha:** 2026-01-12
**Prioridad:** ALTA
**Estado:** Problemas encontrados

---

## ❌ Problema Crítico Encontrado

### 1. URLs de Autenticación INCORRECTAS en Vercel

**Problema:**

- En Vercel tienes configurado:

  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` ❌
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` ❌

- Pero el código usa:
  - Ruta `/auth` (catch-all) ✅
  - Ruta `/auth?mode=signup` para registro ✅

**Impacto:**

- Clerk intentará redirigir a `/sign-in` y `/sign-up` que NO existen en la aplicación
- El flujo de autenticación no funcionará correctamente
- Los usuarios no podrán iniciar sesión/registrarse

**Solución:**

1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Busca `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
3. Cambia el valor de `/sign-in` a `/auth` ✅
4. Busca `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
5. Cambia el valor de `/sign-up` a `/auth?mode=signup` ✅
6. Marca **Production** ✅
7. Haz clic en **"Save"**
8. Haz un **redeploy**

---

## ✅ Configuración Correcta (Ya está bien)

### 1. Keys de Clerk - PRODUCCIÓN ✅

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...` ✅
- `CLERK_SECRET_KEY` = `sk_live_...` ✅
- **Estado:** Correcto - Usando keys de producción

### 2. Webhook de Clerk ✅

- `CLERK_WEBHOOK_SECRET` = `whsec_...` ✅
- Webhook configurado en Clerk Dashboard ✅
- URL: `https://vanguard-ia.tech/api/webhooks/clerk` ✅
- Evento: `user.created` ✅
- **Estado:** Correcto - Configurado

### 3. Variables de KV ✅

- `KV_REST_API_URL` ✅
- `KV_REST_API_TOKEN` ✅
- `KV_REST_API_READ_ONLY_TOKEN` ✅
- **Estado:** Correcto - Configurado

---

## ⚠️ Configuración Opcional (No crítica)

### 1. Dominios DNS Personalizados en Clerk

**Estado:** En configuración pero NO verificado

En Clerk Dashboard → Domains → vanguard-ia.tech, veo:

- DNS Configuration: **0/5 Verified** (no verificado)
- Frontend API: **Unverified**
- Account portal: **Unverified**
- Email: **Unverified**

**Nota:** Esta configuración es **OPCIONAL**. Clerk funciona sin ella usando los dominios por defecto (`clerk.accounts.dev`). Solo es necesaria si quieres usar dominios personalizados.

**Si quieres configurarlo (opcional):**

1. Necesitas acceso a tu proveedor DNS (donde está configurado `vanguard-ia.tech`)
2. Agregar los registros CNAME que Clerk solicita
3. Esperar a que se verifiquen (puede tomar horas)

**Si NO quieres configurarlo:**

- Puedes dejarlo así - Clerk seguirá funcionando con los dominios por defecto
- No afecta el funcionamiento básico

---

## 🔧 Acciones Requeridas

### URGENTE (Debe hacerse ahora):

1. **✅ Cambiar URLs de autenticación en Vercel:**

   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` → `/auth`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` → `/auth?mode=signup`

2. **✅ Redeploy después de cambiar las variables**

3. **✅ Verificar que el botón de clientes funciona**

### OPCIONAL (Puede hacerse después):

1. Configurar DNS personalizado en Clerk (si lo deseas)
2. Verificar otros ajustes menores

---

## 📋 Checklist de Verificación

Después de corregir las URLs:

- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/auth` (no `/sign-in`)
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/auth?mode=signup` (no `/sign-up`)
- [ ] Variables marcadas para **Production** ✅
- [ ] Redeploy completado
- [ ] Botón de clientes funciona
- [ ] Puedes navegar a `/clientes/`
- [ ] Puedes iniciar sesión
- [ ] Puedes registrarte

---

## 🔍 Cómo Verificar

1. **Después de cambiar las variables y hacer redeploy:**

   - Ve a `https://vanguard-ia.tech/`
   - Haz clic en el botón de clientes
   - Deberías ser redirigido a `/clientes/`
   - Deberías ver el formulario de login/signup

2. **Si aún no funciona:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Busca errores relacionados con Clerk
   - Verifica que no haya errores de redirección

---

## 📝 Notas Importantes

1. **El problema principal es la inconsistencia de URLs:**

   - El código espera `/auth`
   - Vercel tiene `/sign-in` y `/sign-up`
   - Esto causa que Clerk redirija a rutas que no existen

2. **Las keys de producción están correctas:**

   - Ya están usando `pk_live_...` y `sk_live_...`
   - Esto es correcto ✅

3. **El webhook está configurado:**

   - El webhook está bien configurado
   - Solo necesita recibir eventos (aparecerán cuando haya nuevos usuarios)

4. **DNS personalizado es opcional:**
   - No es necesario para el funcionamiento básico
   - Solo afecta la URL que los usuarios ven (usar dominio personalizado vs `clerk.accounts.dev`)

---

## 🎯 Resumen

**Problema encontrado:**

- ❌ URLs de autenticación incorrectas en Vercel

**Solución:**

- ✅ Cambiar `/sign-in` → `/auth`
- ✅ Cambiar `/sign-up` → `/auth?mode=signup`
- ✅ Redeploy

**Estado actual:**

- ✅ Keys de producción correctas
- ✅ Webhook configurado
- ✅ KV configurado
- ❌ URLs de autenticación incorrectas ← **CORREGIR ESTO**
