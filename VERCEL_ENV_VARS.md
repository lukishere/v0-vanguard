# Variables de Entorno para Vercel

## 📋 Variables Requeridas

### Clerk Authentication (OBLIGATORIAS)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_c2VsZWN0ZWQtcGFuZGEtMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY = sk_test_5Ej1XoMPNqjfBT4WEXiH0VTR0CjuNARhGHPSC4kO9O
CLERK_WEBHOOK_SECRET = whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
```

**IMPORTANTE - Configurar Webhook:**
1. Ve a https://dashboard.clerk.com → Tu app → "Webhooks"
2. Click "Add Endpoint"
3. URL: `https://tu-dominio.vercel.app/api/webhooks/clerk`
4. Eventos: Selecciona "user.created"
5. Copia el "Signing Secret" y úsalo como `CLERK_WEBHOOK_SECRET`

### Firebase Configuration (YA CONFIGURADAS)

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyApFVqxGU8bcPrGmnaQK3GvdBjLzSZGFow
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = v0-vanguard.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = v0-vanguard
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = v0-vanguard.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 779844653714
NEXT_PUBLIC_FIREBASE_APP_ID = 1:779844653714:web:4b09d2647185e97f098c4b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-4BDJL1V5MN
```

### Otras Variables (OPCIONALES)

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = tu_email@gmail.com
SMTP_PASS = tu_app_password
NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 6Ld_CBEsAAAAAJPbSVgz8pftDYlqW0ZDvTAYdB0o
RECAPTCHA_SECRET_KEY = 6Ld_CBEsAAAAALZ_-BJBr5i0AxQC0UO9XgLcSdG_
GEMINI_API_KEY = AIzaSyDLCS950zSGSzzgvyO4VKBHPvmq6YWe5sk
PERPLEXITY_API_KEY = your_perplexity_api_key_here
```

## 🚀 Pasos para Configurar en Vercel

1. **Ve a Vercel Dashboard**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**: `lukishere/v0-vanguard`
3. **Ve a Settings** → **Environment Variables**
4. **Agrega cada variable** con su valor exacto
5. **Environment**: `Production`
6. **Click "Save"** para cada variable
7. **Redeploy**: Ve a "Deployments" → Click "Redeploy"

## ✅ Verificación

Después del redeploy, el sitio debería:

- ✅ Cargar sin errores 401/500
- ✅ Permitir registro/login
- ✅ Mostrar dashboard correcto según rol
- ✅ Funcionar todas las APIs

## 🔐 Importante

- Las variables `NEXT_PUBLIC_*` son visibles en el navegador
- Las variables sin `NEXT_PUBLIC_` son secretas (solo backend)
- **Clerk keys** son críticas para el funcionamiento</contents>
  </xai:function_call">Vercel
