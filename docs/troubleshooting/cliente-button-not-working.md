# Solución: Botón de Acceso Clientes No Funciona

**Fecha:** 2026-01-12
**Prioridad:** ALTA
**Estado:** Guía de solución

---

## 🔍 Diagnóstico

El botón de "Acceso Clientes" depende de Clerk para funcionar. Si Clerk no está cargado o está mal configurado, el botón no funcionará.

---

## ⚠️ Causas Más Comunes

### 1. **Clerk usando keys de desarrollo en producción**

**Síntomas:**
- El botón no aparece o muestra un placeholder
- Errores en consola: "Clerk: Development keys..."
- El botón no navega al hacer clic

**Solución:**
- Cambiar a keys de producción en Vercel
- Seguir la guía: `docs/deployment/clerk-production-migration.md`

### 2. **Clerk no carga correctamente**

**Síntomas:**
- Error en consola: "Failed to load Clerk"
- El botón muestra un placeholder (cuadrado gris)
- La página no carga completamente

**Solución:**
- Verificar que las keys de Clerk estén configuradas en Vercel
- Verificar que el dominio esté autorizado en Clerk Dashboard
- Verificar que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` esté configurado

### 3. **Error de JavaScript**

**Síntomas:**
- El botón aparece pero no hace nada al hacer clic
- Errores en la consola del navegador

**Solución:**
- Abrir DevTools (F12) y revisar errores
- Verificar que Next.js esté funcionando
- Verificar que no haya errores de compilación

---

## 🔧 Solución Paso a Paso

### Paso 1: Verificar el estado actual

1. **Abre la página en producción:**
   - `https://vanguard-ia.tech/`

2. **Abre DevTools (F12):**
   - Ve a la pestaña **"Console"**
   - Busca errores relacionados con Clerk

3. **Verifica si el botón aparece:**
   - Si NO aparece: Clerk no está cargado
   - Si aparece pero no funciona: Error de JavaScript
   - Si aparece y funciona: Problema resuelto ✅

---

### Paso 2: Verificar configuración de Clerk en Vercel

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Settings → Environment Variables:**
   - Verifica que exista `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Verifica que exista `CLERK_SECRET_KEY`
   - Verifica que las keys sean de **producción** (`pk_live_...`, `sk_live_...`)

3. **Si las keys son de desarrollo (`pk_test_...`, `sk_test_...`):**
   - Debes cambiarlas a keys de producción
   - Seguir la guía: `docs/deployment/clerk-production-migration.md`

---

### Paso 3: Verificar dominio en Clerk Dashboard

1. **Ve a Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Selecciona tu aplicación

2. **Ve a Domains:**
   - Verifica que `https://vanguard-ia.tech` esté autorizado
   - Si NO está, agrégalo

3. **Si usas preview deployments:**
   - También agrega `https://tu-proyecto.vercel.app`

---

### Paso 4: Redeploy después de cambios

1. **Después de cambiar keys o dominio:**
   - Ve a Vercel Dashboard → Deployments
   - Haz clic en los tres puntos (⋮) del último deployment
   - Selecciona "Redeploy"
   - Espera a que termine

2. **Verifica que el deployment fue exitoso:**
   - Status debe ser "Ready" (verde)

---

### Paso 5: Verificar que funciona

1. **Recarga la página:**
   - `https://vanguard-ia.tech/`
   - Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac) para hard refresh

2. **Verifica el botón:**
   - Debería aparecer en la esquina superior derecha
   - Debería mostrar "Solicitar Cotización" o similar
   - Al hacer clic, debería navegar a `/clientes/`

3. **Abre DevTools (F12):**
   - Ve a la pestaña **"Console"**
   - No debería haber errores de Clerk

---

## 🔍 Verificación del Código

El botón está en `components/header.tsx` y depende de:

```typescript
const { isSignedIn, isLoaded } = useUser();

// El botón solo aparece si:
// - isMounted = true (componente montado)
// - isLoaded = true (Clerk cargado)
// - !isSignedIn = true (usuario NO autenticado)
```

Si `isLoaded` es `false`, el botón mostrará un placeholder (cuadrado gris).

---

## ✅ Checklist de Verificación

Después de seguir los pasos:

- [ ] Keys de Clerk configuradas en Vercel
- [ ] Keys son de producción (`pk_live_...`, `sk_live_...`)
- [ ] Dominio autorizado en Clerk Dashboard
- [ ] Redeploy completado en Vercel
- [ ] Página recargada con hard refresh
- [ ] Botón aparece en la página principal
- [ ] Botón navega a `/clientes/` al hacer clic
- [ ] No hay errores en la consola del navegador

---

## 🚨 Si el problema persiste

1. **Revisa los logs de Vercel:**
   - Ve a Vercel Dashboard → Tu proyecto → Logs
   - Busca errores relacionados con Clerk

2. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña **"Console"**
   - Copia los errores y revísalos

3. **Verifica que Clerk esté funcionando:**
   - Intenta navegar directamente a `/clientes/`
   - Si la página carga, Clerk está funcionando
   - Si la página no carga, hay un problema con Clerk

---

## 📝 Notas Importantes

1. **El botón desaparece si estás autenticado:**
   - Este es el comportamiento correcto
   - Si estás autenticado, verás el botón "PORTAL" en su lugar

2. **Keys de desarrollo vs producción:**
   - Las keys de desarrollo (`pk_test_...`) tienen limitaciones
   - En producción, debes usar keys LIVE (`pk_live_...`)

3. **Hard refresh necesario:**
   - Después de cambiar keys, haz hard refresh (Ctrl+Shift+R)
   - Esto asegura que el navegador cargue la nueva configuración

---

## 🔄 Siguiente Paso

Después de resolver el problema:
1. Verifica que el botón funciona correctamente
2. Verifica que puedes navegar a `/clientes/`
3. Verifica que puedes iniciar sesión/registrarte
4. Si todo funciona, el problema está resuelto ✅
