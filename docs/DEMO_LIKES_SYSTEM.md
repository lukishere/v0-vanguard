# Sistema de Likes para Demos en Desarrollo

## 📊 Resumen

El sistema de likes permite a los clientes mostrar interés en las demos que están en desarrollo, proporcionando al equipo administrativo información valiosa sobre qué servicios tienen mayor engagement.

---

## 🎯 Propósito

- **Para Clientes:** Expresar interés en demos en desarrollo sin comprometerse a apuntarse a la waitlist
- **Para Admins:** Obtener métricas de engagement para priorizar el desarrollo de demos según la demanda real

---

## 🔧 Componentes del Sistema

### 1. **Server Actions** (`app/actions/demo-likes.ts`)

#### Funciones principales:

- `toggleDemoLike(demoId)` - Da o quita like a una demo
- `getDemoLikeStats(demoId)` - Obtiene estadísticas de likes para una demo específica
- `getAllDemoLikes()` - Obtiene todas las estadísticas (para admin)
- `getMostLikedDemos(limit)` - Obtiene las demos más populares

#### Persistencia:

- Archivo: `.data/demo-likes.json`
- Formato: Array de objetos `{ demoId, clientId, likedAt }`
- Ya incluido en `.gitignore`

---

### 2. **Componente de Like** (`components/dashboard/like-button.tsx`)

#### Características:

- **Estado Dinámico:**
  - Sin like: Botón outline con "Me interesa"
  - Con like: Botón sólido azul con "Te gusta"
- **Contador:** Muestra el número total de likes si > 0
- **Feedback:** Toast notifications para confirmar acciones
- **Toggle:** Click para dar/quitar like

####Props:

```typescript
interface LikeButtonProps {
  demoId: string
  demoName: string
}
```

---

### 3. **Integración en Demo Cards**

**Dashboard Cliente:**
- Aparece solo en demos con `status="in-development"`
- Se muestra junto al botón "Apuntarse"
- Diseño coherente con el resto de botones

---

### 4. **Visualización en Admin Panel**

**Admin Demos:**

1. **Badge en Header:**
   - Muestra cantidad de likes si > 0
   - Solo visible para demos en desarrollo
   - Formato: "👍 X likes"

2. **Sección de Engagement:**
   - Card dedicada debajo del progreso
   - Muestra contador total de clientes interesados
   - Mensaje motivacional si tiene engagement

---

## 📈 Flujo de Uso

### Cliente:

1. Ve una demo en desarrollo en la sección "En Desarrollo"
2. Hace click en "Me interesa" (👍)
3. El botón cambia a "Te gusta" (azul)
4. Recibe confirmación por toast
5. Puede quitar el like haciendo click nuevamente

### Admin:

1. Accede a Admin > Demos
2. Ve las demos en desarrollo
3. Observa los badges con conteo de likes
4. Lee la sección de "Engagement" para cada demo
5. Prioriza desarrollo según el interés mostrado

---

## 🎨 Diseño Visual

### Botón de Like (Cliente):

**Sin like:**
```
[ 👍 Me interesa ]  ← Outline, fondo semi-transparente
```

**Con like:**
```
[ 👍 5 Te gusta ]   ← Azul sólido, contador visible
```

### Badge de Likes (Admin):

```
🔨 En Desarrollo  |  dashboard  |  [ 👍 5 likes ]
```

### Card de Engagement (Admin):

```
┌─────────────────────────────────────┐
│ 👍 Engagement: 5 clientes interesados │
│ Esta demo está generando interés     │
└─────────────────────────────────────┘
```

---

## 🔐 Seguridad y Validación

- ✅ Requiere autenticación (`auth()` de Clerk)
- ✅ Un like por usuario por demo (toggle)
- ✅ Validación en servidor (Server Actions)
- ✅ Logs de actividad en consola

---

## 📊 Métricas Disponibles

### Para Admins:

1. **Conteo por Demo:** Cuántos clientes dieron like a cada demo
2. **Ranking:** Demos ordenadas por popularidad
3. **Tendencias:** Identificar qué servicios tienen mayor demanda

### Uso futuro (potencial):

- Dashboard de analytics con gráficos
- Notificaciones cuando una demo alcanza X likes
- Priorización automática de roadmap
- Segmentación por tipo de cliente

---

## 🚀 Implementación

### Archivos Creados:

- `app/actions/demo-likes.ts` - Server Actions
- `components/dashboard/like-button.tsx` - Componente de UI
- `.data/demo-likes.json` - Persistencia (auto-generado)

### Archivos Modificados:

- `components/dashboard/demo-card.tsx` - Integración del botón
- `app/admin/demos/page.tsx` - Visualización de estadísticas
- `components/dashboard/demo-tabs.tsx` - Cambio de "Catálogo" a "Disponibles"

---

## 💡 Mejoras Futuras

1. **Analytics Dashboard:**
   - Gráfico de tendencias de likes en el tiempo
   - Comparación entre demos

2. **Notificaciones:**
   - Alertas al admin cuando una demo alcanza cierto umbral
   - Email semanal con demos más populares

3. **Integración con CRM:**
   - Exportar datos de engagement
   - Segmentar clientes por intereses

4. **Gamificación:**
   - Recompensas por dar feedback temprano
   - Acceso prioritario a demos populares

---

## 🐛 Troubleshooting

### El botón no cambia de estado:

- Verificar autenticación del usuario
- Check logs en consola: "👍 [Likes] Like registrado"
- Verificar permisos de escritura en `.data/`

### Likes no persisten entre reinicios:

- Verificar que `.data/demo-likes.json` existe
- Check permisos del directorio
- Revisar logs de errores en `saveLikes()`

### Conteo no se actualiza en Admin:

- El conteo se carga al renderizar la página
- Hacer refresh de la página para ver cambios
- En producción, implementar revalidación automática

---

## 📝 Notas de Desarrollo

- Sistema diseñado para ser ligero y escalable
- Fácil migración futura a base de datos
- Compatible con el sistema de persistencia existente
- Sin dependencias externas adicionales
