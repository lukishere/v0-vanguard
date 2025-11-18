# Guía Completa de Configuración de Clerk

## 📋 Información General

Esta guía documenta la configuración completa de Clerk para autenticación de clientes y administradores en V0 Vanguard.

## 🔧 Configuración de Variables de Entorno

### Archivo: `.env.local`

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2VsZWN0ZWQtcGFuZGEtMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_5Ej1XoMPNqjfBT4WEXiH0VTR0CjuNARhGHPSC4kO9O
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth?mode=signup
```

### Descripción de Variables

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: Clave pública de Clerk (visible en frontend)
- **`CLERK_SECRET_KEY`**: Clave secreta de Clerk (solo backend)
- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`**: URL para login (ruta catch-all)
- **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`**: URL para registro (con query param)

## 🏗️ Estructura de Rutas

### Rutas Públicas (Middleware)

```typescript
// proxy.ts - Rutas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/about/',
  '/services',
  '/services/',
  '/events',
  '/events/',
  '/contact',
  '/contact/',
  '/faq',
  '/faq/',
  '/privacy',
  '/privacy/',
  '/terms',
  '/terms/',
  '/auth(.*)',        // ✅ Catch-all para autenticación
  '/clientes(.*)',    // ✅ Página de login de clientes
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
])
```

### Rutas Protegidas

```typescript
// Rutas que requieren autenticación
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])
```

## 📱 Componentes de Autenticación

### 1. ClientSignIn Component

**Ubicación**: `components/client-sign-in.tsx`

```typescript
interface ClientSignInProps {
  fallbackRedirectUrl?: string
  appearance?: {
    elements?: Record<string, string>
  }
}

// Configuración por defecto
const defaultProps = {
  fallbackRedirectUrl: "/dashboard", // ✅ Redirección a dashboard de clientes
  redirectUrl: "/dashboard"         // ✅ Redirección explícita
}
```

**Características**:
- Redirección automática a `/dashboard` para clientes
- Soporte para usuarios ya autenticados (botón de logout temporal)
- Apariencia personalizada para tema oscuro

### 2. Auth Page (Catch-All)

**Ubicación**: `app/auth/[[...rest]]/page.tsx`

```typescript
// Maneja tanto sign-in como sign-up
const mode = searchParams.get("mode") || "signin"

return mode === "signup" ? (
  <SignUp
    routing="path"
    path="/auth"
    redirectUrl="/dashboard"
    fallbackRedirectUrl="/dashboard"
    // ... appearance config
  />
) : (
  <SignIn
    routing="path"
    path="/auth"
    redirectUrl="/dashboard"
    fallbackRedirectUrl="/dashboard"
    // ... appearance config
  />
)
```

## 🔐 Sistema de Roles y Permisos

### Detección de Roles

**Ubicación**: `lib/admin/permissions.ts`

```typescript
export function isAdmin(user: User | null | undefined): boolean {
  return getUserRole(user) === 'admin'
}

function getUserRole(user: MetadataCarrier | null | undefined): VanguardRole | null {
  // Verifica publicMetadata.role primero, luego privateMetadata.role
  const publicRole = readRole(user?.publicMetadata)
  if (publicRole) return publicRole

  const privateRole = readRole(user?.privateMetadata)
  if (privateRole) return privateRole

  return null
}
```

### Roles Soportados

- **`admin`**: Acceso completo al panel de administración
- **`client`**: Acceso al dashboard de clientes
- **`user`**: Usuario genérico (reservado para futuro)

### Lógica de Redirección

**Ubicación**: `app/dashboard/page.tsx`

```typescript
// Solo admins van a /admin, todos los demás quedan en /dashboard
const userIsAdmin = isAdmin(user)
if (userIsAdmin === true) {
  redirect("/admin/")
}
// Clientes normales continúan al dashboard
```

## 🎨 Configuración de Apariencia

### Provider Global (Layout)

**Ubicación**: `app/layout.tsx`

```typescript
<ClerkProvider
  appearance={{
    variables: {
      colorPrimary: "#1F3B6D",      // Vanguard blue
      colorBackground: "#ffffff",
      fontFamily: inter.style.fontFamily,
    },
    elements: {
      formButtonPrimary: "bg-vanguard-blue hover:bg-vanguard-blue/90 text-white",
      footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
      card: "shadow-lg border border-slate-100 rounded-3xl",
    },
  }}
>
```

### Apariencia de Auth Pages

```typescript
// Tema oscuro para páginas de autenticación
appearance={{
  elements: {
    card: "shadow-none bg-transparent border-0",
    headerTitle: "text-white",
    headerSubtitle: "text-white/70",
    socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white",
    formFieldInput: "bg-white/10 border border-white/20 text-white placeholder:text-white/50",
    formFieldLabel: "text-white/70",
    footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
    footer: "text-white/60",
  },
}}
```

## 🔄 Flujos de Autenticación

### Flujo de Cliente

1. **Acceso inicial** → `http://localhost:3000/clientes/`
2. **Login/Signup** → `http://localhost:3000/auth` (o `/auth?mode=signup`)
3. **Redirección exitosa** → `http://localhost:3000/dashboard`
4. **Verificación de rol** → Si admin → `/admin`, si cliente → permanece en `/dashboard`

### Flujo de Administrador

1. **Acceso inicial** → `http://localhost:3000/clientes/` (o cualquier ruta protegida)
2. **Login** → `http://localhost:3000/auth`
3. **Redirección exitosa** → `http://localhost:3000/dashboard`
4. **Detección de admin** → Automáticamente redirigido a `/admin`
5. **Verificación final** → AdminLayoutClient verifica permisos

## 🛡️ Middleware de Seguridad

### Configuración Actual

**Ubicación**: `proxy.ts`

```typescript
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const userRole = getRoleFromSessionClaims(sessionClaims)
  const isUserAdmin = userRole === 'admin'

  // 🚫 Bloqueo: Admins en /dashboard → redirigir a /admin
  if (isDashboardRoute(req) && userId && isUserAdmin) {
    return NextResponse.redirect(new URL('/admin/', req.url))
  }

  // 🔒 Rutas admin requieren verificación
  if (isAdminRoute(req)) {
    if (!userId) {
      // Redirigir a login
    }
    // Dejar que AdminLayoutClient verifique permisos
  }

  // 🔒 Otras rutas protegidas
  if (!isPublicRoute(req)) {
    if (!userId) {
      // Redirigir a login
    }
  }
})
```

## 📊 Gestión de Metadatos

### Client Metadata Management

**Ubicación**: `lib/admin/clerk-metadata.ts`

```typescript
export async function getClientPublicMetadata(userId: string, user?: User) {
  // Obtiene metadatos públicos del cliente
  // Incluye: demoAccess, role, preferences, etc.
}

export async function updateUserActivity(userId: string, activity: UserActivity) {
  // Actualiza actividad del usuario en Clerk
}
```

## 🧪 Testing y Debugging

### Logs de Debug

```typescript
// En dashboard/page.tsx
console.log("👤 [Dashboard] Usuario:", user?.primaryEmailAddress?.emailAddress)
console.log("🎭 [Dashboard] Rol detectado:", userIsAdmin ? "ADMIN" : "CLIENTE")
console.log("📊 [Dashboard] PublicMetadata:", user?.publicMetadata)
```

### Comandos de Testing

```bash
# Hacer usuario admin
pnpm tsx scripts/make-admin.ts <user-id>

# Hacer usuario cliente
pnpm tsx scripts/make-client.ts <user-id>
```

## 🚨 Troubleshooting

### Problema: "Verificando permisos de administrador"

**Solución**: Verificar que redirecciones apunten a `/dashboard`, no a `/admin`

### Problema: Error 400 en sign-ups

**Solución**: Verificar que `/auth(.*)` esté en rutas públicas del middleware

### Problema: Usuario no puede acceder

**Solución**: Verificar variables de entorno y configuración de Clerk

## 📚 Referencias

- [Documentación Clerk](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/references/nextjs/overview)
- [Custom Redirects](https://clerk.com/docs/guides/custom-redirects)
- [Session Tokens](https://clerk.com/docs/backend-requests/overview)

---

**Estado**: ✅ Configuración completa y funcional
**Última actualización**: November 16, 2025

