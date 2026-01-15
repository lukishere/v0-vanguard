# Configuración SMTP para Formulario de Contacto

Este documento explica cómo configurar el servidor SMTP para que el formulario de contacto funcione correctamente.

## Variables de Entorno Requeridas

El formulario de contacto requiere las siguientes variables de entorno configuradas en `.env.local` (desarrollo) o en Vercel (producción):

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
CONTACT_EMAIL=contacto@vanguard-ia.tech
```

---

## 📋 Guía Completa de Configuración

### 🔧 Configuración en Desarrollo Local (.env.local)

#### Paso 1: Crear o editar el archivo `.env.local`

1. En la raíz del proyecto, crea o edita el archivo `.env.local`
2. Si ya existe, ábrelo con un editor de texto

#### Paso 2: Agregar las variables SMTP

Abre `.env.local` y agrega o actualiza estas líneas:

```env
# SMTP Configuration for Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=abcdefghijklmnop
CONTACT_EMAIL=contacto@vanguard-ia.tech
```

**⚠️ IMPORTANTE - Diferencia entre SMTP_USER y CONTACT_EMAIL:**

- **`SMTP_USER`**: Es el email de Gmail que tiene la contraseña de aplicación (el que ENVÍA los correos)
  - Ejemplo: Si generaste la contraseña con `miemail@gmail.com`, usa ese email aquí
  - Este será el remitente de los correos
  - ❌ **NO uses** `contacto@vanguard-ia.tech` aquí
- **`CONTACT_EMAIL`**: Es el email DESTINATARIO (donde quieres recibir los formularios)
  - Ejemplo: `contacto@vanguard-ia.tech`
  - Este es donde llegarán los mensajes del formulario de contacto

**Otros puntos importantes:**

- Reemplaza `tu_email@gmail.com` con tu email de Gmail completo que tiene la contraseña de aplicación
- Reemplaza `abcdefghijklmnop` con tu contraseña de aplicación de 16 caracteres **SIN ESPACIOS**
- Si tu contraseña de aplicación viene como `abcd efgh ijkl mnop`, úsala como `abcdefghijklmnop` (sin espacios)
- **NO uses comillas** alrededor de los valores
- **NO uses tu contraseña normal de Gmail**, solo la contraseña de aplicación

#### Paso 3: Verificar el formato

Tu `.env.local` debería verse así (ejemplo):

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=usuario@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
CONTACT_EMAIL=contacto@vanguard-ia.tech
```

**❌ INCORRECTO:**

```env
SMTP_PASS="abcd efgh ijkl mnop"  # ❌ Con comillas
SMTP_PASS=abcd efgh ijkl mnop     # ❌ Con espacios
```

**✅ CORRECTO:**

```env
SMTP_PASS=abcdefghijklmnop        # ✅ Sin espacios, sin comillas
```

#### Paso 4: Reiniciar el servidor

1. Detén el servidor de desarrollo (Ctrl+C)
2. Inicia el servidor nuevamente:
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

#### Paso 5: Probar la configuración

1. Ve a la página de contacto en tu aplicación local
2. Envía un formulario de prueba
3. Verifica que no aparezcan errores en la consola

---

### 🚀 Configuración en Producción (Vercel)

#### Paso 1: Acceder a Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (v0-vanguard o el nombre que tengas)

#### Paso 2: Ir a Environment Variables

1. En el menú lateral, haz clic en **"Settings"**
2. En el menú superior, haz clic en **"Environment Variables"**

#### Paso 3: Agregar Variable SMTP_HOST

1. Haz clic en el botón **"Add New"** o **"Add"**
2. En el campo **"Key"**, escribe: `SMTP_HOST`
3. En el campo **"Value"**, escribe: `smtp.gmail.com`
4. Marca las casillas:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opcional, pero recomendado)
5. Haz clic en **"Save"**

#### Paso 4: Agregar Variable SMTP_PORT

1. Haz clic en **"Add New"** nuevamente
2. **Key**: `SMTP_PORT`
3. **Value**: `587`
4. Marca: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

#### Paso 5: Agregar Variable SMTP_USER

⚠️ **IMPORTANTE**: `SMTP_USER` debe ser el **email de Gmail que tiene la contraseña de aplicación** (el que se usa para ENVIAR), NO el email de destino.

1. Haz clic en **"Add New"**
2. **Key**: `SMTP_USER`
3. **Value**: Tu email de Gmail completo que tiene la contraseña de aplicación (ej: `tu_email@gmail.com`)
   - Este es el email que usaste para generar la contraseña de aplicación
   - Este email será el remitente de los correos
4. Marca: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

**Ejemplo:**

- Si generaste la contraseña de aplicación con `miemail@gmail.com`, entonces:
  - `SMTP_USER=miemail@gmail.com` ✅
  - `CONTACT_EMAIL=contacto@vanguard-ia.tech` ✅ (este es el destinatario)

#### Paso 6: Agregar Variable SMTP_PASS

1. Haz clic en **"Add New"**
2. **Key**: `SMTP_PASS`
3. **Value**: Tu contraseña de aplicación de 16 caracteres **SIN ESPACIOS**
   - Si tu contraseña es `abcd efgh ijkl mnop`, escribe: `abcdefghijklmnop`
4. Marca: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

**⚠️ IMPORTANTE:**

- **NO incluyas espacios** en la contraseña
- **NO uses comillas**
- Esta es tu contraseña de aplicación, NO tu contraseña normal de Gmail

#### Paso 7: Agregar Variable CONTACT_EMAIL

1. Haz clic en **"Add New"**
2. **Key**: `CONTACT_EMAIL`
3. **Value**: `contacto@vanguard-ia.tech`
4. Marca: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **"Save"**

#### Paso 8: Verificar las Variables

Deberías ver estas 5 variables en la lista:

```
✅ SMTP_HOST = smtp.gmail.com
✅ SMTP_PORT = 587
✅ SMTP_USER = usuario@gmail.com
✅ SMTP_PASS = abcdefghijklmnop
✅ CONTACT_EMAIL = contacto@vanguard-ia.tech
```

#### Paso 9: Redeploy del Proyecto

**IMPORTANTE**: Después de agregar las variables, debes hacer un redeploy:

1. Ve a la pestaña **"Deployments"** en el menú superior
2. Encuentra el último deployment
3. Haz clic en el menú de tres puntos (⋯) junto al deployment
4. Selecciona **"Redeploy"**
5. Confirma el redeploy

**O alternativamente:**

- Haz un pequeño cambio en el código y haz push al repositorio
- Vercel automáticamente hará un nuevo deployment con las nuevas variables

#### Paso 10: Verificar que Funciona

1. Ve a tu sitio en producción (ej: https://vanguard-ia.tech/contact)
2. Envía un formulario de prueba
3. Verifica que no aparezcan errores
4. Revisa los logs en Vercel Dashboard → Deployments → Tu deployment → Logs

---

## ✅ Checklist de Verificación

### Desarrollo Local

- [ ] Archivo `.env.local` creado en la raíz del proyecto
- [ ] `SMTP_HOST=smtp.gmail.com` configurado
- [ ] `SMTP_PORT=587` configurado
- [ ] `SMTP_USER` con tu email completo de Gmail
- [ ] `SMTP_PASS` con contraseña de aplicación SIN ESPACIOS
- [ ] `CONTACT_EMAIL=contacto@vanguard-ia.tech` configurado
- [ ] Servidor reiniciado después de los cambios
- [ ] Formulario de contacto probado sin errores

### Producción (Vercel)

- [ ] Todas las 5 variables agregadas en Vercel Dashboard
- [ ] Variables marcadas para Production, Preview y Development
- [ ] `SMTP_PASS` sin espacios ni comillas
- [ ] Redeploy realizado después de agregar las variables
- [ ] Formulario de contacto probado en producción
- [ ] Logs revisados para verificar que no hay errores

---

## 🔍 Verificación Rápida

Para verificar que las variables están configuradas correctamente, puedes ejecutar:

```bash
npx tsx scripts/check-smtp-config.ts
```

Este script verificará:

- ✅ Variables requeridas configuradas
- ✅ Variables opcionales configuradas
- ❌ Variables faltantes o mal configuradas

## Configuración por Proveedor

### Gmail

⚠️ **IMPORTANTE**: Gmail NO acepta tu contraseña normal. Debes usar una **contraseña de aplicación**.

#### ❌ Si ves: "La opción de configuración que buscas no está disponible para tu cuenta"

**Esto significa que NO tienes la verificación en 2 pasos activada.** Es un requisito obligatorio.

#### Paso 1: Activar Verificación en 2 Pasos (OBLIGATORIO)

1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. Busca **"Verificación en dos pasos"** o **"2-Step Verification"**
3. Haz clic en **"Comenzar"** o **"Activar"**
4. Sigue el proceso:
   - Ingresa tu contraseña de Google
   - Elige un método de verificación:
     - **SMS** (recibir código por mensaje de texto)
     - **Llamada telefónica** (recibir código por llamada)
     - **App de autenticación** (Google Authenticator, Authy, etc.)
   - Completa la verificación con el código recibido
5. ✅ Una vez activada, podrás acceder a las contraseñas de aplicación

#### Paso 2: Generar Contraseña de Aplicación

**Solo después de activar la verificación en 2 pasos**, podrás generar contraseñas de aplicación:

1. Ve a: https://myaccount.google.com/apppasswords
2. Ahora deberías ver la página de contraseñas de aplicación (no el mensaje de error)
3. Selecciona:
   - **Aplicación**: "Correo"
   - **Dispositivo**: "Otro (nombre personalizado)"
   - Ingresa: "VANGUARD-IA Contact Form"
4. Haz clic en **"Generar"**
5. **Copia la contraseña de 16 caracteres** (sin espacios, ejemplo: `abcd efgh ijkl mnop` → usa `abcdefghijklmnop`)

6. **Configurar en .env.local**

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_email@gmail.com
   SMTP_PASS=abcdefghijklmnop  # SIN ESPACIOS - La contraseña de aplicación de 16 caracteres
   CONTACT_EMAIL=contacto@vanguard-ia.tech
   ```

   ⚠️ **CRÍTICO**:

   - **NO uses tu contraseña normal de Gmail**
   - **NO incluyas espacios** en la contraseña de aplicación
   - Si la contraseña viene como `abcd efgh ijkl mnop`, úsala como `abcdefghijklmnop`
   - El `SMTP_USER` debe ser tu email completo (ej: `usuario@gmail.com`)

7. **Verificar la configuración**
   - Reinicia el servidor después de cambiar `.env.local`
   - Prueba enviando un formulario de contacto

### Otros Proveedores SMTP

#### Outlook/Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=tu_email@outlook.com
SMTP_PASS=tu_contraseña
```

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu_sendgrid_api_key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@tu_dominio.mailgun.org
SMTP_PASS=tu_mailgun_password
```

## Verificación

### Desarrollo Local

Ejecuta el script de verificación:

```bash
npx tsx scripts/check-smtp-config.ts
```

Este script verificará:

- ✅ Variables requeridas configuradas
- ✅ Variables opcionales configuradas
- ❌ Variables faltantes o mal configuradas

### Producción (Vercel)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables SMTP:

   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`

4. Reinicia el deployment después de agregar las variables

## Troubleshooting

### Error: "SMTP configuration is missing"

- **Causa**: Falta una o más variables de entorno requeridas
- **Solución**: Verifica que todas las variables estén configuradas en `.env.local` o Vercel

### Error: "SMTP authentication failed" o "535-5.7.8 Username and Password not accepted"

- **Causa**: Credenciales incorrectas o formato incorrecto
- **Solución**:
  1. **Para Gmail**:
     - ✅ **PRIMERO**: Activa la verificación en 2 pasos (requisito obligatorio)
     - ✅ DEBES usar una **contraseña de aplicación**, NO tu contraseña normal
     - ✅ Genera la contraseña en: https://myaccount.google.com/apppasswords
     - ✅ **Elimina todos los espacios** de la contraseña de aplicación
     - ✅ El `SMTP_USER` debe ser tu email completo (ej: `usuario@gmail.com`)
  2. **Verifica el formato en `.env.local`**:
     ```env
     SMTP_PASS=abcdefghijklmnop  # Sin espacios, sin comillas
     ```
  3. **Si sigue fallando**:
     - Genera una nueva contraseña de aplicación
     - Asegúrate de copiarla completa (16 caracteres)
     - Reinicia el servidor después de cambiar `.env.local`

### Error: "La opción de configuración que buscas no está disponible para tu cuenta"

- **Causa**: No tienes la verificación en 2 pasos activada
- **Solución**:
  1. Ve a: https://myaccount.google.com/security
  2. Activa **"Verificación en dos pasos"**
  3. Completa el proceso de configuración
  4. Una vez activada, vuelve a: https://myaccount.google.com/apppasswords
  5. Ahora podrás generar contraseñas de aplicación

### Error: "Cannot connect to SMTP server"

- **Causa**: Host o puerto incorrectos
- **Solución**:
  - Verifica `SMTP_HOST` (ej: smtp.gmail.com)
  - Verifica `SMTP_PORT` (587 para TLS, 465 para SSL)

### Error: "SMTP certificate verification failed"

- **Causa**: Problema con certificados SSL/TLS
- **Solución**: Verifica que el servidor SMTP soporte TLS 1.2 o superior

## Destinatario del Email

Por defecto, los emails de solicitud de auditoría técnica se envían a:

- **Destino**: `lucas.ballestero@gmail.com`

Para cambiar el destinatario, edita el archivo:

- `app/api/audit-request/route.ts` (línea 59)

## Seguridad

⚠️ **Importante**:

- Nunca commites `.env.local` al repositorio
- Usa contraseñas de aplicación en lugar de contraseñas principales
- En producción, usa variables de entorno de Vercel, no archivos .env

## Logs

Los errores de SMTP se registran en:

- **Desarrollo**: Consola del servidor (terminal donde corre `npm run dev`)
- **Producción**: Vercel Dashboard → Logs

Busca mensajes que comiencen con:

- `SMTP configuration missing:`
- `SMTP verification failed:`
- `Failed to send audit request email:`
