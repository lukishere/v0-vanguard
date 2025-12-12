# Verificación de reCAPTCHA en Producción

## 🔍 Verificación de Configuración

### Variables de Entorno Requeridas

El captcha requiere **2-3 variables de entorno** en Vercel:

1. **`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`** (Cliente - Pública) - **REQUERIDA**
   - Se usa en el frontend para cargar el script de reCAPTCHA Enterprise
   - Debe estar configurada para **Production**, **Preview** y **Development**

2. **`RECAPTCHA_SECRET_KEY`** (Servidor - Privada) - **REQUERIDA (fallback)**
   - Se usa en el backend como método de respaldo HTTP
   - Debe estar configurada para **Production**, **Preview** y **Development**

3. **`RECAPTCHA_PROJECT_ID`** (Servidor - Privada) - **OPCIONAL (recomendada)**
   - Google Cloud Project ID para usar el SDK de reCAPTCHA Enterprise
   - Si no está configurada, se usa el método HTTP como fallback
   - Alternativa: `GOOGLE_CLOUD_PROJECT_ID` (si ya está configurada)
   - Proporciona mejor análisis de riesgo y más detalles

## ✅ Pasos para Verificar en Vercel

### 1. Verificar Variables de Entorno

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto: `lukishere/v0-vanguard`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que existan ambas variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
5. Verifica que estén configuradas para **Production** (y Preview/Development si aplica)

### 2. Verificar que las Claves sean Válidas

#### Para Site Key (Cliente):
- Debe comenzar con `6L` (reCAPTCHA v3)
- Ejemplo: `6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

#### Para Secret Key (Servidor):
- Debe comenzar con `6L` (reCAPTCHA v3)
- Ejemplo: `6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 3. Verificar Dominio en Google reCAPTCHA

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Selecciona tu sitio
3. Verifica que el dominio de producción esté agregado en **Domains**
   - Ejemplo: `tu-dominio.vercel.app` o `www.tu-dominio.com`
4. Si falta, agrega el dominio y guarda

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "Captcha configuration missing"

**Síntoma:** El formulario muestra un mensaje de error o el botón está deshabilitado.

**Causa:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` no está configurada o está vacía.

**Solución:**
1. Verifica que la variable esté en Vercel
2. Verifica que esté configurada para **Production**
3. **Re-deploy** el proyecto después de agregar la variable

### Problema 2: "Captcha verification failed"

**Síntoma:** El formulario se envía pero falla con error de verificación.

**Causa:** `RECAPTCHA_SECRET_KEY` no está configurada, es incorrecta, o el dominio no está autorizado.

**Solución:**
1. Verifica que `RECAPTCHA_SECRET_KEY` esté en Vercel
2. Verifica que la clave secreta corresponda a la Site Key
3. Verifica que el dominio esté autorizado en Google reCAPTCHA
4. **Re-deploy** el proyecto después de corregir

### Problema 3: "Low security score"

**Síntoma:** El formulario falla con "Low security score".

**Causa:** reCAPTCHA v3 devuelve un score < 0.5 (sospechoso).

**Solución:**
- Esto es normal para algunos usuarios/tráfico
- Puedes ajustar el threshold en `app/api/contact/route.ts` línea 320:
  ```typescript
  if (score < 0.5) { // Cambiar a 0.3 para ser menos estricto
  ```

### Problema 4: El captcha no se carga

**Síntoma:** El script de reCAPTCHA no se carga en el navegador.

**Causa:**
- Site Key incorrecta
- Dominio no autorizado
- Problemas de red/CORS

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores relacionados con `recaptcha`
3. Verifica que el dominio esté autorizado en Google reCAPTCHA
4. Verifica que la Site Key sea correcta

## 🔧 Cómo Obtener las Claves de reCAPTCHA

### Si no tienes claves:

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click en **"+"** para crear un nuevo sitio
3. Configura:
   - **Label:** Nombre descriptivo (ej: "VANGUARD-IA Contact Form")
   - **reCAPTCHA type:** Selecciona **reCAPTCHA v3**
   - **Domains:** Agrega tus dominios:
     - `localhost` (para desarrollo)
     - `tu-dominio.vercel.app` (para preview)
     - `www.tu-dominio.com` (para producción)
     - `tu-dominio.com` (para producción)
4. Acepta los términos
5. Click en **Submit**
6. Copia las claves:
   - **Site Key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Secret Key** → `RECAPTCHA_SECRET_KEY`

## 📝 Checklist de Verificación

- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` está configurada en Vercel (Production)
- [ ] `RECAPTCHA_SECRET_KEY` está configurada en Vercel (Production)
- [ ] Las claves corresponden al mismo sitio en Google reCAPTCHA
- [ ] El dominio de producción está autorizado en Google reCAPTCHA
- [ ] Se hizo re-deploy después de agregar/cambiar las variables
- [ ] El formulario carga el script de reCAPTCHA (verificar en Network tab)
- [ ] El formulario envía correctamente sin errores

## 🚀 Después de Configurar

1. **Re-deploy** el proyecto en Vercel
2. Prueba el formulario de contacto en producción
3. Verifica en la consola del navegador que no haya errores
4. Verifica en los logs de Vercel que no haya errores de captcha

## 📊 Monitoreo

Para verificar que el captcha funciona correctamente:

1. **Logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - Click en **Deployments** → Selecciona el último deployment
   - Click en **Functions** → `api/contact`
   - Revisa los logs para errores de captcha

2. **Google reCAPTCHA Admin:**
   - Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Selecciona tu sitio
   - Ve a **Analytics** para ver estadísticas de uso

## ⚠️ Notas Importantes

- Las variables con `NEXT_PUBLIC_` son visibles en el cliente (no incluyas secretos)
- `RECAPTCHA_SECRET_KEY` debe mantenerse privada (solo servidor)
- Después de cambiar variables de entorno, **siempre re-deploy**
- reCAPTCHA v3 es invisible (no muestra checkbox)
- El score mínimo es 0.5 (configurable en el código)
