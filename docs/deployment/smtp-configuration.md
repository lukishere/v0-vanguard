# Configuración SMTP para Formulario de Auditoría Técnica

Este documento explica cómo configurar el servidor SMTP para que el formulario "Agenda tu auditoría técnica" funcione correctamente.

## Variables de Entorno Requeridas

El formulario de auditoría técnica requiere las siguientes variables de entorno configuradas en `.env.local` (desarrollo) o en Vercel (producción):

```env
# SMTP Configuration for Audit Request Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

## Configuración por Proveedor

### Gmail

1. **Habilitar autenticación de 2 factores**
   - Ve a tu cuenta de Google
   - Seguridad → Verificación en dos pasos

2. **Generar una contraseña de aplicación**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Ingresa "VANGUARD-IA Audit Form"
   - Copia la contraseña generada (16 caracteres)

3. **Configurar en .env.local**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de aplicación generada
   ```

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

### Error: "SMTP authentication failed"
- **Causa**: Credenciales incorrectas
- **Solución**:
  - Para Gmail: Usa una contraseña de aplicación, no tu contraseña normal
  - Verifica que `SMTP_USER` y `SMTP_PASS` sean correctos

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
