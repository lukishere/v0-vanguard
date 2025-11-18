# Sistema de Persistencia de Demos

## Problema Resuelto

Anteriormente, las demos eliminadas y las actualizaciones se almacenaban solo en memoria, lo que causaba que:
- Las demos eliminadas reaparecieran después de reiniciar el servidor
- Las ediciones de demos se perdían con hot reload en desarrollo
- Los cambios no persistían entre reinicios

## Solución Implementada

Ahora usamos un sistema de persistencia basado en archivos JSON que guarda:

1. **Demos eliminadas** → `.data/deleted-demos.json`
2. **Actualizaciones de demos** → `.data/demo-updates.json`

### Ubicación de archivos

```
.data/
├── deleted-demos.json    # IDs de demos eliminadas
└── demo-updates.json     # Overrides y actualizaciones de demos
```

### Características

✅ **Persistente**: Los cambios sobreviven a reinicios del servidor
✅ **Automático**: Se crea el directorio `.data/` automáticamente
✅ **Ignorado por Git**: El directorio está en `.gitignore`
✅ **Thread-safe**: Las operaciones son atómicas

## Funciones Disponibles

### Eliminar Demos

```typescript
import { deleteDemo } from "@/app/actions/demos"

await deleteDemo("demo-id")
// La demo se guarda en deleted-demos.json y desaparece de todas las vistas
```

### Obtener Demos Eliminadas

```typescript
import { getDeletedDemos } from "@/app/actions/demos"

const deletedIds = await getDeletedDemos()
// Retorna array de IDs eliminados
```

### Restaurar Demo

```typescript
import { restoreDemo } from "@/app/actions/demos"

await restoreDemo("demo-id")
// La demo vuelve a aparecer en el catálogo
```

### Actualizar Demo

```typescript
import { updateDemo } from "@/app/actions/demos"

await updateDemo("demo-id", {
  summary: "Nuevo resumen",
  description: "Nueva descripción"
})
// Los cambios se guardan en demo-updates.json
```

## Mantenimiento

### Limpiar datos locales

Si necesitas resetear el sistema (eliminar todas las demos borradas y actualizaciones):

```bash
# En desarrollo
rm -rf .data/

# Los archivos se recrearán automáticamente cuando sea necesario
```

### Migrar a producción

Para producción, considera reemplazar este sistema con:
- **Base de datos**: PostgreSQL, MySQL, MongoDB
- **KV Store**: Vercel KV, Redis, Upstash
- **CMS**: Sanity, Contentful, Strapi

## Estructura de Archivos

### deleted-demos.json
```json
["demo-id-1", "demo-id-2", "demo-id-3"]
```

### demo-updates.json
```json
{
  "demo-id-1": {
    "id": "demo-id-1",
    "summary": "Resumen actualizado",
    "description": "Descripción actualizada",
    "tags": ["tag1", "tag2"]
  },
  "demo-id-2": {
    "id": "demo-id-2",
    "status": "in-development",
    "progress": 75
  }
}
```

## Notas Técnicas

- Los archivos JSON se leen/escriben de forma asíncrona
- Los errores de lectura (archivo no existe) se manejan silenciosamente
- Se usa `fs/promises` para operaciones no bloqueantes
- El directorio se crea automáticamente con `recursive: true`
- Se llama a `revalidatePath()` después de cada cambio para actualizar la UI

## Troubleshooting

### Las demos eliminadas siguen apareciendo

1. Verifica que el archivo `.data/deleted-demos.json` existe
2. Revisa los logs del servidor para ver si hay errores de permisos
3. Asegúrate de que el servidor se haya reiniciado después del cambio

### Los cambios no se guardan

1. Verifica permisos de escritura en el directorio del proyecto
2. Revisa la consola del servidor para errores
3. Comprueba que no haya problemas de espacio en disco

### Limpiar una demo específica sin restaurarla

```bash
# Edita manualmente el archivo
code .data/deleted-demos.json
# O usa un script
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('.data/deleted-demos.json')); const filtered = data.filter(id => id !== 'demo-id'); fs.writeFileSync('.data/deleted-demos.json', JSON.stringify(filtered));"
```
