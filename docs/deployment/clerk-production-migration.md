# Guía: Migración de Clerk de Desarrollo a Producción

**Fecha:** 2026-01-12
**Estado:** Guía de migración
**Prioridad:** CRÍTICA

---

## 🎯 Objetivo

Migrar Clerk de keys de desarrollo (`pk_test_...`, `sk_test_...`) a keys de producción (`pk_live_...`, `sk_live_...`) para habilitar todas las funcionalidades en producción.

---

## ⚠️ Problema Identificado

Las acciones del panel admin no funcionan en producción porque:
- ❌ Se están usando keys de **desarrollo** (`pk_test_...`, `sk_test_...`)
- ❌ En producción deben usarse keys **LIVE** (`pk_live_...`, `sk_live_...`)
- ❌ Las keys de desarrollo tienen limitaciones y no funcionan completamente en producción

---

## 📋 Pasos para Migrar a Producción

### Paso 1: Obtener Keys LIVE de Clerk

1. **Ve a Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Inicia sesión con tu cuenta

2. **Selecciona tu aplicación:**
   - Si tienes múltiples aplicaciones, selecciona la que usas para producción
   - Si solo tienes una, esa es la que necesitas

3. **Ve a API Keys:**
   - En el menú lateral, busca **"API Keys"** o **"Configure"** → **"API Keys"**
   - Deberías ver dos secciones:
     - **Development keys** (pk_test_..., sk_test_...)
     - **Production keys** (pk_live_..., sk_live_...)

4. **Obtener Production Keys:**
   - Si ya tienes production keys:
     - Copia `Publishable key` (empieza con `pk_live_...`)
     - Copia `Secret key` (empieza con `sk_live_...`)
   - Si NO tienes production keys:
     - Haz clic en **"Create Production Key"** o **"Enable Production Mode"**
     - Clerk generará nuevas keys de producción
     - Copia ambas keys

---

### Paso 2: Configurar Keys LIVE en Vercel

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Settings → Environment Variables:**
   - En el menú lateral, haz clic en **"Settings"**
   - Luego haz clic en **"Environment Variables"**

3. **Actualizar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`:**
   - Busca `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Haz clic en el icono de edición (✏️ o tres puntos)
   - Reemplaza el valor `pk_test_...` con `pk_live_...` (la key de producción que copiaste)
   - **Importante:** Marca las casillas para:
     - ✅ **Production**
     - ✅ **Preview** (opcional)
     - ✅ **Development** (opcional, puedes dejarlo con test keys para desarrollo local)
   - Haz clic en **"Save"**

4. **Actualizar `CLERK_SECRET_KEY`:**
   - Busca `CLERK_SECRET_KEY`
   - Haz clic en el icono de edición
   - Reemplaza el valor `sk_test_...` con `sk_live_...` (la key de producción que copiaste)
   - **Importante:** Marca las casillas para:
     - ✅ **Production**
     - ✅ **Preview** (opcional)
     - ⚠️ **Development** - Aquí tienes dos opciones:
       - **Opción A:** Usar LIVE también en Development (recomendado para consistencia)
       - **Opción B:** Dejar TEST en Development (para desarrollo local)
   - Haz clic en **"Save"**

5. **Verificar `CLERK_WEBHOOK_SECRET` (si usas webhooks):**
   - Si tienes webhooks configurados, verifica que `CLERK_WEBHOOK_SECRET` esté configurado
   - El webhook secret es el mismo para development y production
   - Si no está configurado, sigue el Paso 3 para configurarlo

---

### Paso 3: Configurar Webhook en Clerk (si no está configurado)

1. **Ve a Clerk Dashboard → Webhooks:**
   - En el menú lateral, busca **"Webhooks"**
   - Si ya tienes un webhook configurado, verifica que la URL sea correcta

2. **Crear/Actualizar Webhook Endpoint:**
   - Haz clic en **"Add Endpoint"** (si no existe) o edita el existente
   - **URL:** `https://vanguard-ia.tech/api/webhooks/clerk`
   - **Events:** Selecciona `user.created` (y otros eventos que necesites)
   - Haz clic en **"Add"** o **"Save"**

3. **Copiar Signing Secret:**
   - Después de crear/actualizar el webhook, verás el **"Signing Secret"**
   - Copia el valor (empieza con `whsec_...`)

4. **Agregar a Vercel:**
   - Ve a Vercel Dashboard → Settings → Environment Variables
   - Busca `CLERK_WEBHOOK_SECRET`
   - Si existe, actualízalo con el nuevo secret
   - Si no existe, agrégalo:
     - Key: `CLERK_WEBHOOK_SECRET`
     - Value: `whsec_...` (el secret que copiaste)
     - Environment: ✅ Production, ✅ Preview, ✅ Development
   - Haz clic en **"Save"**

---

### Paso 4: Autorizar Dominio en Clerk

1. **Ve a Clerk Dashboard → Domains:**
   - En el menú lateral, busca **"Domains"** o **"Allowed Domains"**

2. **Verificar/Agregar Dominio de Producción:**
   - Verifica que `https://vanguard-ia.tech` esté en la lista
   - Si NO está:
     - Haz clic en **"Add Domain"** o **"Allow Domain"**
     - Ingresa: `https://vanguard-ia.tech`
     - Haz clic en **"Save"**
   - También agrega el dominio de Vercel si usas previews:
     - `https://tu-proyecto.vercel.app`

3. **Verificar Dominios Permitidos:**
   - Asegúrate de que estén autorizados:
     - ✅ `https://vanguard-ia.tech` (producción)
     - ✅ `https://tu-proyecto.vercel.app` (preview deployments)
     - ✅ `http://localhost:3000` (desarrollo local, opcional)

---

### Paso 5: Actualizar Usuarios a Producción (si es necesario)

**⚠️ IMPORTANTE:** Si cambias a production keys, los usuarios creados con test keys NO estarán disponibles.

**Opciones:**

1. **Opción A: Migrar usuarios (si ya tienes usuarios importantes):**
   - Clerk no permite migrar usuarios directamente
   - Los usuarios deberán registrarse nuevamente en producción
   - Si son usuarios importantes, puedes contactarlos para que se registren

2. **Opción B: Empezar desde cero (si no tienes usuarios importantes):**
   - Los usuarios se crearán desde cero en producción
   - Simplemente continúa con el siguiente paso

3. **Opción C: Usar la misma aplicación de Clerk (recomendado):**
   - Si tu aplicación de Clerk ya tiene production keys habilitadas
   - Los usuarios existentes deberían seguir funcionando
   - Solo necesitas cambiar las keys en Vercel

---

### Paso 6: Redeploy en Vercel

1. **Ve a Vercel Dashboard → Deployments:**
   - En el menú lateral, haz clic en **"Deployments"**
   - Deberías ver la lista de deployments

2. **Redeploy:**
   - Encuentra el último deployment
   - Haz clic en el icono de tres puntos (⋮)
   - Selecciona **"Redeploy"**
   - Confirma el redeploy

   **O simplemente:**
   - Haz un nuevo push a tu repositorio
   - Vercel automáticamente hará un nuevo deployment

3. **Verificar el Deployment:**
   - Espera a que el deployment termine (puede tomar 1-3 minutos)
   - Verifica que el status sea **"Ready"** (verde)

---

### Paso 7: Verificar Funcionamiento

1. **Verificar Autenticación:**
   - Ve a `https://vanguard-ia.tech/auth`
   - Intenta iniciar sesión
   - Debería funcionar sin errores

2. **Verificar Panel Admin:**
   - Inicia sesión como admin
   - Ve a `https://vanguard-ia.tech/admin`
   - Verifica que puedas acceder sin problemas

3. **Verificar Acciones del Admin:**
   - Ve a `https://vanguard-ia.tech/admin/noticias`
   - Intenta crear un evento
   - Verifica que se guarde correctamente
   - Verifica que aparezca en `/events`

4. **Verificar Consola del Navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - No deberías ver warnings sobre "development keys"
   - No deberías ver errores de autenticación

---

## ✅ Checklist de Verificación

Después de completar todos los pasos, verifica:

- [ ] Keys LIVE configuradas en Vercel Dashboard
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...` (en Production)
- [ ] `CLERK_SECRET_KEY` = `sk_live_...` (en Production)
- [ ] `CLERK_WEBHOOK_SECRET` configurado (si usas webhooks)
- [ ] Dominio `https://vanguard-ia.tech` autorizado en Clerk
- [ ] Webhook configurado en Clerk Dashboard
- [ ] Redeploy completado en Vercel
- [ ] Autenticación funcionando en producción
- [ ] Panel admin accesible
- [ ] Acciones del admin funcionando (crear/editar/eliminar eventos)
- [ ] Sin errores en consola del navegador

---

## 🔧 Troubleshooting

### Problema: "Unauthorized" o 401 después del cambio

**Causa:** Keys no actualizadas correctamente o dominio no autorizado

**Solución:**
1. Verifica que las keys en Vercel sean `pk_live_...` y `sk_live_...`
2. Verifica que el dominio esté autorizado en Clerk Dashboard
3. Haz un nuevo redeploy

### Problema: Usuarios no pueden iniciar sesión

**Causa:** Usuarios fueron creados con test keys y no existen en production

**Solución:**
- Los usuarios deben registrarse nuevamente en producción
- O verifica que estés usando la misma aplicación de Clerk

### Problema: Acciones del admin siguen sin funcionar

**Causa:** Puede ser problema de KV, no de Clerk

**Solución:**
1. Verifica que KV esté configurado (ya lo hiciste)
2. Verifica que los eventos se estén guardando en KV
3. Revisa los logs de Vercel para errores específicos

### Problema: Webhook no funciona

**Causa:** Webhook secret incorrecto o URL incorrecta

**Solución:**
1. Verifica que la URL del webhook sea correcta: `https://vanguard-ia.tech/api/webhooks/clerk`
2. Verifica que `CLERK_WEBHOOK_SECRET` sea correcto
3. Haz redeploy después de actualizar el secret

---

## 📝 Notas Importantes

1. **Desarrollo Local:**
   - Puedes seguir usando keys de test (`pk_test_...`) en `.env.local` para desarrollo
   - Las keys de producción solo se usan en Vercel (Production environment)

2. **Separación de Entornos:**
   - **Development:** Keys de test (`pk_test_...`, `sk_test_...`)
   - **Production:** Keys LIVE (`pk_live_...`, `sk_live_...`)
   - Vercel permite configurar diferentes valores para cada entorno

3. **Seguridad:**
   - ⚠️ **NUNCA** commitees keys reales al repositorio
   - ⚠️ **SIEMPRE** usa variables de entorno
   - ⚠️ Keys LIVE son para producción solamente

4. **Mantenimiento:**
   - Si regeneras keys en Clerk, actualízalas inmediatamente en Vercel
   - Haz redeploy después de actualizar keys

---

## 🎉 Resultado Esperado

Después de completar esta migración:

- ✅ Clerk funcionando correctamente en producción
- ✅ Panel admin completamente funcional
- ✅ Acciones del admin funcionando (crear/editar/eliminar eventos)
- ✅ Sin warnings sobre "development keys"
- ✅ Autenticación estable en producción
- ✅ Usuarios pueden registrarse e iniciar sesión normalmente

---

## 📚 Referencias

- [Clerk Dashboard](https://dashboard.clerk.com)
- [Clerk Documentation - Production Keys](https://clerk.com/docs/deployments/overview)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🔄 Siguiente Paso

Después de migrar Clerk a producción:
1. Verifica que las acciones del admin funcionen
2. Si aún hay problemas, revisa la configuración de KV
3. Crea eventos desde `/admin/noticias` para poblar KV en producción
