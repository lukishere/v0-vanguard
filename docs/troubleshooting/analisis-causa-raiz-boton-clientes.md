# Análisis de Causa Raíz: Botón "Acceso Clientes" No Aparece

**Fecha:** 2026-01-12
**Prioridad:** CRÍTICA
**Estado:** 🔍 ANÁLISIS COMPLETO

---

## 🔍 Análisis del Problema

### Código del Botón (components/header.tsx)

El botón solo aparece si se cumplen **TODAS** estas condiciones:

```typescript
const { isSignedIn, isLoaded } = useUser();
const [isMounted, setIsMounted] = useState(false);

// El botón aparece solo si:
{!isMounted || !isLoaded ? (
  <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-md" /> // Placeholder
) : !isSignedIn ? (
  <Button>Acceso Clientes</Button> // ✅ BOTÓN APARECE
) : (
  <Button>PORTAL</Button> // Usuario autenticado
)}
```

**Condiciones para que aparezca el botón:**
1. ✅ `isMounted = true` (componente montado en cliente)
2. ✅ `isLoaded = true` (Clerk cargado correctamente)
3. ✅ `!isSignedIn = true` (usuario NO autenticado)

**Si `isLoaded = false`:**
- Se muestra un placeholder gris (cuadrado animado)
- El botón NO aparece

---

## ⚠️ Causa Raíz del Problema Actual

### Problema Principal: Clerk No Carga (`isLoaded = false`)

**Error en consola:**
```
Loading the script `https://clerk.vanguard-ia.tech/npm/@clerk/clerk-js@5/dis...`
violates the following Content Security Policy directive
```

**Causa:**
1. **Dominio personalizado configurado pero NO verificado:**
   - En Clerk Dashboard → Domains → `vanguard-ia.tech`
   - Estado: **0/5 Verified** (no verificado)
   - Frontend API: `clerk.vanguard-ia.tech` **Unverified**

2. **Clerk intenta usar dominio personalizado:**
   - Aunque NO está verificado, Clerk intenta cargar scripts desde `clerk.vanguard-ia.tech`
   - Esto causa un error de CSP (aunque ya agregamos el dominio a la CSP)

3. **Resultado:**
   - `isLoaded = false` (Clerk no carga)
   - Se muestra placeholder gris en lugar del botón
   - El botón NO aparece

---

## 🔄 ¿Por Qué Funcionaba Antes?

### Escenarios Probables:

**Escenario 1: No había dominio personalizado configurado**
- Clerk usaba automáticamente los dominios estándar (`*.clerk.com`)
- Estos dominios YA están permitidos en la CSP
- `isLoaded = true` → Botón aparecía ✅

**Escenario 2: Dominio personalizado estaba verificado**
- Si el dominio estaba verificado (5/5 Verified)
- Clerk podía cargar desde `clerk.vanguard-ia.tech`
- `isLoaded = true` → Botón aparecía ✅

**Escenario 3: CSP menos estricta**
- Si la CSP no estaba configurada o era menos estricta
- Clerk podía cargar aunque hubiera problemas
- `isLoaded = true` → Botón aparecía ✅

---

## 📅 Timeline de Cambios

### Cambios Recientes que Afectaron:

1. **Configuración de dominio personalizado en Clerk:**
   - Se configuró `vanguard-ia.tech` en Clerk Dashboard
   - Los registros DNS NO se configuraron (0/5 Verified)
   - **Fecha estimada:** Reciente (después de que funcionaba)

2. **Actualización de CSP:**
   - Se agregó CSP estricta en `next.config.mjs`
   - Aunque agregamos el dominio personalizado, Clerk no puede cargar desde un dominio no verificado
   - **Fecha:** 2026-01-12

3. **Cambio de keys de desarrollo a producción:**
   - Se migró de `pk_test_...` a `pk_live_...`
   - Esto podría haber activado el uso del dominio personalizado
   - **Fecha:** Reciente

---

## ✅ Soluciones Posibles

### Solución 1: Eliminar Dominio Personalizado (RÁPIDA)

**Pasos:**
1. Ve a Clerk Dashboard → Domains → vanguard-ia.tech
2. Ve a "Danger zone" → "Change domain"
3. Elimina/desactiva el dominio personalizado
4. Clerk usará automáticamente los dominios estándar

**Resultado:**
- Clerk carga desde `*.clerk.com` (ya permitido en CSP)
- `isLoaded = true` → Botón aparece ✅
- **Tiempo:** Inmediato

---

### Solución 2: Configurar Registros DNS (LENTA pero permanente)

**Pasos:**
1. Configura los 5 registros CNAME en tu proveedor DNS:
   - `clerk` → `frontend-api.clerk.services`
   - `accounts` → `accounts.clerk.services`
   - `clkmail` → `mail.812wv7u7rj15.clerk.services`
   - `clk._domainkey` → `dkim1.812wv7u7rj15.clerk.services`
   - `clk2._domainkey` → `dkim2.812wv7u7rj15.clerk.services`
2. Espera verificación (puede tardar horas/días)
3. Una vez verificado (5/5), Clerk podrá cargar desde el dominio personalizado

**Resultado:**
- Clerk carga desde `clerk.vanguard-ia.tech` (verificado)
- `isLoaded = true` → Botón aparece ✅
- **Tiempo:** Horas/días

---

## 🔍 Verificación del Estado Actual

### Para verificar por qué no aparece el botón:

1. **Abre DevTools (F12) → Console:**
   - Busca errores de CSP
   - Busca errores de Clerk
   - Verifica si `isLoaded = false`

2. **Revisa el código del header:**
   - Si ves un placeholder gris → `isLoaded = false`
   - Si no ves nada → Error de JavaScript
   - Si ves "PORTAL" → Estás autenticado (comportamiento correcto)

3. **Verifica estado de Clerk:**
   - Ve a `/diagnostico` (página de diagnóstico que creamos)
   - Revisa el estado de `isLoaded` y `isSignedIn`

---

## 📋 Resumen

**Problema actual:**
- Dominio personalizado configurado pero NO verificado
- Clerk intenta usar dominio no verificado → Error CSP
- `isLoaded = false` → Botón NO aparece

**Por qué funcionaba antes:**
- Probablemente NO había dominio personalizado configurado
- O el dominio estaba verificado
- Clerk usaba dominios estándar que funcionan correctamente

**Solución recomendada:**
- **Inmediata:** Eliminar dominio personalizado no verificado
- **Permanente:** Configurar registros DNS correctamente

---

## 🚨 Acción Requerida

**Para resolver el problema AHORA:**

1. ✅ Eliminar dominio personalizado en Clerk Dashboard
2. ✅ Esperar 1-2 minutos
3. ✅ Hard refresh (Ctrl+Shift+R)
4. ✅ Verificar que el botón aparece

**O si prefieres mantener el dominio personalizado:**

1. ✅ Configurar los 5 registros DNS CNAME
2. ✅ Esperar verificación (horas/días)
3. ✅ Una vez verificado, el botón debería aparecer

---

## 📝 Notas Importantes

1. **El código del botón NO cambió:**
   - El código sigue siendo el mismo desde 2024-11-19
   - El problema es que Clerk no carga, no el código

2. **La CSP ya permite el dominio:**
   - Agregamos `https://*.vanguard-ia.tech` a la CSP
   - Pero Clerk no puede cargar desde un dominio no verificado

3. **El dominio personalizado es OPCIONAL:**
   - Clerk funciona perfectamente sin él
   - Solo es necesario si quieres usar tu propio dominio
   - Si no está verificado, causa problemas
