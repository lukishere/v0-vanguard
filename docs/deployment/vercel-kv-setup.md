# Configuración de Vercel KV para Eventos/Noticias

**Fecha:** 2024-12-12
**Estado:** ✅ Implementado
**Propósito:** Migrar almacenamiento de eventos/noticias de filesystem a Vercel KV para funcionar en producción

---

## 🎯 Problema Resuelto

El sistema de eventos/noticias usaba el sistema de archivos (`.data/news.json`), que **no funciona en producción** en Vercel porque:

- El sistema de archivos es de solo lectura en producción
- Los archivos son efímeros (se eliminan entre deployments)
- `process.cwd()` puede apuntar a un directorio diferente

## ✅ Solución Implementada

Migración a **Vercel KV** (Redis-compatible key-value store) con fallback automático a filesystem en desarrollo.

### Arquitectura

```
Producción (Vercel):
  Eventos/Noticias → Vercel KV → Persistencia permanente ✅

Desarrollo (Local):
  Eventos/Noticias → Filesystem (.data/news.json) → Fallback ✅
```

---

## 📋 Configuración en Vercel Dashboard

### ⚠️ Actualización: KV ahora está en el Marketplace

**Nota importante:** Vercel movió KV al Marketplace. Ahora debes usar **Upstash** desde el Marketplace.

### Paso 1: Crear Base de Datos KV desde el Marketplace

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la pestaña **"Storage"**
4. Haz clic en **"Create New"** (si no lo ves, busca "Browse Storage")
5. En la sección **"Marketplace Database Providers"**, busca **"Upstash"**
6. Haz clic en **"Upstash"** (debería decir "Serverless DB (Redis, Vector, Queue, Search)")
7. Haz clic en **"Add Integration"** o **"Connect"**
8. Selecciona tu proyecto de Vercel
9. Elige un nombre para tu base de datos (ej: `vanguard-kv`)
10. Selecciona la región más cercana a tus usuarios

**⚠️ Configuración importante:**

Si ves opciones de **"Embedding Model"** y **"Similarity Function"**:

- ✅ **NO las configures** - Son para Vector Search (búsqueda semántica)
- ✅ **Déjalas en blanco o selecciona "Skip"** - Solo necesitas Redis básico
- ✅ **Tipo de base de datos:** Selecciona **"Redis"** (no "Vector" o "Search")

11. Haz clic en **"Create"** o **"Add"**

> 💡 **Nota:** Si ves opciones de Redis/Upstash en el Marketplace, ignóralas. Vercel KV nativo es la mejor opción para este proyecto.

### Paso 2: Obtener Credenciales

Después de crear la base de datos Upstash:

**Opción A: Desde Vercel (si se configuraron automáticamente)**

1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Busca las variables que Upstash agregó automáticamente:
   - `UPSTASH_REDIS_REST_URL` (o similar)
   - `UPSTASH_REDIS_REST_TOKEN` (o similar)

**Opción B: Desde Upstash Dashboard (si necesitas las credenciales manualmente)**

1. Ve a [Upstash Dashboard](https://console.upstash.com/)
2. Selecciona tu base de datos
3. Ve a la pestaña **"Details"** o **"REST API"**
4. Copia las siguientes credenciales:
   - `UPSTASH_REDIS_REST_URL` → Usar como `KV_REST_API_URL`
   - `UPSTASH_REDIS_REST_TOKEN` → Usar como `KV_REST_API_TOKEN`
   - Para read-only, usa el mismo token o crea uno separado

### Paso 3: Configurar Variables de Entorno

#### En Vercel Dashboard:

1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. **Si Upstash no agregó las variables automáticamente**, agrega las siguientes:

```
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your_upstash_redis_token
KV_REST_API_READ_ONLY_TOKEN=your_upstash_redis_token
```

> 💡 **Nota:** Si Upstash agregó variables con nombres diferentes (ej: `UPSTASH_REDIS_REST_URL`), puedes:
>
> - Opción 1: Renombrarlas a `KV_REST_API_URL` y `KV_REST_API_TOKEN`
> - Opción 2: Actualizar el código para usar los nombres de Upstash (ver abajo)

3. Asegúrate de que estén configuradas para:

   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opcional, para testing)

4. Haz clic en **"Save"**

#### En Desarrollo Local:

Crea un archivo `.env.local` (o agrega a tu `.env.local` existente):

```bash
KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
```

> ⚠️ **Importante:** No commitees `.env.local` al repositorio. Está en `.gitignore`.

### Paso 4: Redeploy

Después de configurar las variables:

1. Ve a **Deployments**
2. Haz clic en **"Redeploy"** en el último deployment
3. O simplemente haz un nuevo push al repositorio

---

## 🔍 Verificación

### Verificar que KV está funcionando:

1. **En producción:**

   - Ve a `/events` en tu sitio
   - Crea un evento desde `/admin/noticias`
   - Verifica que el evento aparece en `/events`
   - Recarga la página - el evento debe persistir ✅

2. **Logs:**
   - Revisa los logs de Vercel
   - No deberías ver warnings sobre "Filesystem not available"
   - Deberías ver logs de operaciones KV exitosas

### Verificar datos en KV:

1. Ve a tu proyecto en Vercel Dashboard
2. **Storage** → Tu base de datos KV
3. En la pestaña **"Data"**, deberías ver:
   - Key: `news:all`
   - Value: JSON con todos los eventos/noticias

---

## 🛠️ Troubleshooting

### Problema: "KV client not initialized"

**Causa:** Variables de entorno no configuradas

**Solución:**

1. Verifica que las 3 variables KV estén en Vercel Dashboard
2. Asegúrate de que estén configuradas para Production
3. Redeploy el proyecto

### Problema: Eventos no persisten

**Causa:** KV no está disponible, usando fallback a filesystem

**Solución:**

1. Verifica logs de Vercel para errores de KV
2. Verifica que las credenciales sean correctas
3. Verifica que la base de datos KV esté activa en Vercel

### Problema: Error "Invalid token"

**Causa:** Token incorrecto o expirado

**Solución:**

1. Ve a Storage → Tu base de datos KV → Settings
2. Regenera los tokens
3. Actualiza las variables de entorno en Vercel
4. Redeploy

---

## 📊 Estructura de Datos

Los eventos/noticias se almacenan en KV con la siguiente estructura:

**Key:** `news:all`
**Value:**

```json
{
  "news_1234567890_abc123": {
    "id": "news_1234567890_abc123",
    "type": "evento",
    "title": "Event Title",
    "content": "Event content...",
    "author": "Author Name",
    "publishedAt": { "seconds": 1234567890, "nanoseconds": 0 },
    "isActive": true,
    "createdAt": { "seconds": 1234567890, "nanoseconds": 0 },
    "updatedAt": { "seconds": 1234567890, "nanoseconds": 0 },
    "eventDate": "2024-12-25",
    "eventLocation": "Location",
    "eventLink": "https://...",
    "showInShowcase": true
  }
}
```

---

## 💰 Costos

Vercel KV tiene un tier gratuito generoso:

- **Free Tier:** 10,000 comandos/día
- **Pro Tier:** $0.20 por 100,000 comandos adicionales

Para un sitio con < 100 eventos/noticias y < 1,000 visitas/día, el tier gratuito es más que suficiente.

---

## 🔄 Migración de Datos Existentes

Si tienes eventos/noticias en desarrollo local (`.data/news.json`):

1. **Opción 1: Recrear manualmente**

   - Los eventos se pueden recrear desde el panel de admin

2. **Opción 2: Script de migración** (si es necesario)

   ```typescript
   // Script temporal para migrar datos
   import { kv } from "@vercel/kv";
   import fs from "fs/promises";

   const data = JSON.parse(await fs.readFile(".data/news.json", "utf-8"));
   await kv.set("news:all", data);
   ```

---

## ✅ Checklist de Implementación

- [x] Instalar `@vercel/kv` package
- [x] Crear utilidad `lib/kv.ts` con fallback
- [x] Modificar `app/actions/news.ts` para usar KV
- [x] Actualizar `env.example` con variables KV
- [x] Crear documentación de configuración
- [ ] Configurar KV en Vercel Dashboard
- [ ] Agregar variables de entorno en Vercel
- [ ] Verificar funcionamiento en producción
- [ ] Migrar datos existentes (si aplica)

---

## 🔄 Actualización: KV ahora está en el Marketplace

### ⚠️ Cambio importante

**Vercel movió KV al Marketplace.** Ya no está disponible como opción directa en Storage. Ahora debes usar **Upstash** desde el Marketplace.

### ¿Por qué Upstash?

- ✅ **Oficial en Marketplace** - Integración recomendada por Vercel
- ✅ **Compatible con @vercel/kv** - El código existente funciona sin cambios
- ✅ **Mismo backend** - Upstash es el proveedor que Vercel KV usaba internamente
- ✅ **Características adicionales** - Vector, Queue, Search disponibles si las necesitas
- ✅ **Tier gratuito generoso** - 10,000 comandos/día

### ⚠️ Configuración: NO necesitas Vector Search

Al crear la base de datos Upstash, **NO necesitas configurar**:

- ❌ **Embedding Model** - Solo para búsqueda semántica/vectorial
- ❌ **Similarity Function** - Solo para comparación de vectores
- ❌ **Vector Database** - No necesario para eventos/noticias simples

**Para este proyecto, solo necesitas:**

- ✅ **Redis básico** - Key-value store simple
- ✅ **REST API** - Para acceder desde el código

### El código ya está preparado

El código usa `@upstash/redis` con `Redis.fromEnv()` que automáticamente detecta:

- ✅ **Variables de Upstash** (recomendado): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- ✅ **Variables legacy de Vercel KV** (compatibilidad): `KV_REST_API_URL`, `KV_REST_API_TOKEN`

**Ejemplo de uso:**

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
await redis.set("news:all", data);
const data = await redis.get("news:all");
```

Funciona automáticamente sin necesidad de cambios adicionales.

---

## 📚 Referencias

- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [@upstash/redis Package](https://www.npmjs.com/package/@upstash/redis)
- [Upstash Console](https://console.upstash.com/)
- [Vercel Marketplace - Upstash](https://vercel.com/integrations/upstash)
