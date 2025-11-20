# Estrategia de Almacenamiento de Datos - V0 Vanguard

**Fecha de decisión:** 2024-11-20  
**Estado:** Implementado  
**Decisión:** Mantener datos de perfil en Clerk Metadata

---

## 📋 Contexto

El sistema necesita almacenar información del perfil empresarial de clientes. Se evaluaron dos opciones principales:
1. Clerk `publicMetadata` (actual)
2. Base de datos propia (Firebase/Supabase/Postgres)

## 🎯 Decisión

**Mantener almacenamiento en Clerk `publicMetadata` para fase MVP**

### Razones:

1. **Simplicidad operacional**
   - Sin infraestructura adicional que mantener
   - Sin costos extra de base de datos
   - Sin lógica de sincronización compleja

2. **Velocidad de desarrollo**
   - Iteración rápida en fase de validación
   - Menos código para mantener
   - Deploy más simple

3. **Suficiente para escala actual**
   - < 50 clientes esperados en Q1 2025
   - Perfil empresarial básico (~1KB por usuario)
   - Límite de Clerk: 5KB (suficiente margen)

4. **Seguridad y compliance incluidos**
   - SOC 2 Type II certified
   - GDPR/CCPA compliant
   - Backups automáticos
   - 99.99% uptime SLA

## 📊 Estructura de Datos en Clerk

### `publicMetadata` (accesible client-side)
```typescript
{
  role: "client" | "admin",
  onboardingCompleted: boolean,
  demoAccess: DemoAccess[],
  companyProfile: {
    companyName: string,
    industry: string,
    companySize: string,
    position: string,
    phone?: string,
    interests?: string,
    completedAt: string
  }
}
```

### `privateMetadata` (solo server-side)
```typescript
{
  // Reservado para datos sensibles futuros
  // Ej: historial de pagos, notas internas, etc.
}
```

## ✅ Ventajas de Clerk Metadata

| Aspecto | Beneficio |
|---------|-----------|
| **Costo** | $0 adicional (incluido en plan Clerk) |
| **Latencia** | Zero-latency (datos viajan con sesión) |
| **Sincronización** | Automática en todos los dispositivos |
| **Backups** | Automáticos por Clerk |
| **Escalabilidad** | Manejada por Clerk |
| **Compliance** | GDPR/CCPA incluido |
| **Desarrollo** | Sin código de DB adicional |

## ⚠️ Limitaciones Conocidas

| Limitación | Impacto | Mitigación |
|------------|---------|------------|
| **Tamaño máximo** | ~5KB por usuario | Actual: ~1KB. Margen: 5x |
| **Queries complejas** | No se pueden hacer filtros avanzados | Suficiente para < 100 clientes |
| **Analytics** | Limitado a datos individuales | Usar actividades para analytics |
| **Vendor lock-in** | Dependencia de Clerk | Plan de migración documentado |

## 🔄 Plan de Migración (Futuro)

### Triggers para migrar a DB propia:

1. **Volumen:** > 50 clientes activos
2. **Complejidad:** Perfil > 20 campos
3. **Analytics:** Necesidad de reportes complejos
4. **Integraciones:** CRM externo (HubSpot, Salesforce)

### Arquitectura objetivo (Q2 2025):

```typescript
// Clerk → Solo autenticación + referencias
publicMetadata: {
  role: "client",
  profileId: "uuid-abc-123", // ← Referencia a DB
  onboardingCompleted: true
}

// Base de Datos propia (Firebase/Supabase)
CompanyProfile {
  id: "uuid-abc-123",
  userId: "clerk_user_xyz",
  companyName: string,
  industry: string,
  // ... campos extendidos
  metadata: JSONB, // Campos dinámicos
  createdAt: timestamp,
  updatedAt: timestamp,
  _version: number // Versionado
}
```

### Opciones de DB evaluadas:

| Tecnología | Costo/mes | Complejidad | Recomendación |
|------------|-----------|-------------|---------------|
| **Firebase Firestore** | ~$25 | Media | ✅ Migración fácil |
| **Supabase** | Gratis/$25 | Media-Alta | ✅ Mejor largo plazo |
| **Vercel Postgres** | ~$20 | Media | ⭐ Si ya en Vercel |
| **MongoDB Atlas** | Gratis/$57 | Media | ⚠️ Overkill |

## 🔐 Consideraciones de Seguridad

### ✅ Datos en `publicMetadata` (Actual)
- Nombre de empresa
- Industria
- Tamaño de empresa
- Cargo del usuario
- Teléfono (opcional)
- Áreas de interés

**Justificación:** Datos no sensibles, útiles para personalización client-side.

### 🔒 Datos que irían a `privateMetadata`
- Información financiera
- Historial de pagos
- Notas internas del equipo
- Ratings internos

**Implementación:** Solo cuando sean necesarios.

## 📝 Implementación Actual

### API Endpoint: `/api/user/profile`

```typescript
// POST - Guardar/actualizar perfil
{
  companyName: string,
  industry: string,
  companySize: string,
  position: string,
  phone?: string,
  interests?: string
}

// Guarda en:
user.publicMetadata.companyProfile
user.publicMetadata.onboardingCompleted = true
```

### Componentes:

1. **OnboardingModal** (`components/dashboard/onboarding-modal.tsx`)
   - Modal obligatorio en primer acceso
   - Se muestra si `onboardingCompleted === false`
   - Incluye retry logic para sincronización

2. **ProfileButton** (`components/dashboard/profile-button.tsx`)
   - Botón "Mi Perfil" en header del dashboard
   - Permite editar información en cualquier momento
   - Carga datos existentes para edición

### Lógica de Sincronización:

```typescript
// Al completar onboarding
await fetch("/api/user/profile", { method: "POST", body })
await user.reload() // Primera recarga

// Retry si no se sincronizó
if (!user.publicMetadata?.onboardingCompleted) {
  setTimeout(() => user.reload(), 1000) // Segunda recarga
}
```

## 📊 Métricas de Validación

### KPIs para evaluar migración:

| Métrica | Umbral | Estado Actual |
|---------|--------|---------------|
| Clientes totales | > 50 | ~5-10 |
| Campos de perfil | > 20 | 6 campos |
| Queries complejas/día | > 100 | 0 |
| Tamaño promedio perfil | > 3KB | ~1KB |
| Integraciones externas | > 1 | 0 |

**Conclusión:** Todos los indicadores están MUY por debajo del umbral de migración.

## 🎯 Próximos Pasos

### Inmediato (Q4 2024):
- [x] Implementar retry logic en sincronización
- [x] Agregar botón de perfil en dashboard
- [x] Documentar estructura de datos
- [ ] Validar con usuarios reales (Lucas, etc.)

### Mediano plazo (Q1 2025):
- [ ] Monitorear métricas de uso
- [ ] Evaluar feedback de clientes
- [ ] Considerar campos adicionales necesarios

### Largo plazo (Q2 2025+):
- [ ] Reevaluar cuando > 30 clientes
- [ ] Diseñar arquitectura de migración si necesario
- [ ] Implementar webhook system para DB propia

## 📚 Referencias

- [Clerk Metadata Documentation](https://clerk.com/docs/users/metadata)
- [Clerk Security & Compliance](https://clerk.com/security)
- Decisión de arquitectura discutida: 2024-11-20
- Implementación: `docs/changes/2024-11-20-fix-admin-dashboard-api-crash.md`

## 🤝 Contribuidores

- Decisión técnica: Equipo de desarrollo
- Revisión de seguridad: Pendiente
- Aprobación: Product Owner

---

**Última actualización:** 2024-11-20  
**Próxima revisión:** Q1 2025 o cuando se alcancen 30 clientes activos

