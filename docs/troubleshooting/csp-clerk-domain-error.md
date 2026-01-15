# Error: CSP bloquea dominio personalizado de Clerk

**Fecha:** 2026-01-12
**Prioridad:** CRÍTICA
**Estado:** ✅ SOLUCIONADO

---

## 🔍 Problema Identificado

**Error en consola:**
```
Loading the script `https://clerk.vanguard-ia.tech/npm/@clerk/clerk-js@5/dis...`
violates the following Content Security Policy directive:
`script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://vercel.live`
```

**Error consecuente:**
```
Clerk: Failed to load Clerk (code="failed_to_load_clerk_js_timeout")
```

---

## ⚠️ Causa Raíz

El usuario tiene configurado un **dominio personalizado de Clerk** (`clerk.vanguard-ia.tech`), pero la Content Security Policy (CSP) en `next.config.mjs` solo permitía scripts de los dominios estándar de Clerk:

- ✅ `https://*.clerk.com`
- ✅ `https://clerk.com`
- ✅ `https://*.clerk.accounts.dev`
- ❌ `https://clerk.vanguard-ia.tech` (NO estaba permitido)

---

## ✅ Solución Aplicada

Se actualizó la CSP en `next.config.mjs` para incluir el dominio personalizado de Clerk en todas las directivas relevantes:

### Cambios Realizados:

1. **script-src**: Agregado `https://*.vanguard-ia.tech` y `https://clerk.vanguard-ia.tech`
2. **style-src**: Agregado `https://*.vanguard-ia.tech` y `https://clerk.vanguard-ia.tech`
3. **img-src**: Agregado `https://*.vanguard-ia.tech` y `https://clerk.vanguard-ia.tech`
4. **font-src**: Agregado `https://*.vanguard-ia.tech` y `https://clerk.vanguard-ia.tech`
5. **connect-src**: Agregado `https://*.vanguard-ia.tech`, `https://clerk.vanguard-ia.tech`, y `wss://*.vanguard-ia.tech`, `wss://clerk.vanguard-ia.tech`
6. **frame-src**: Agregado `https://*.vanguard-ia.tech` y `https://clerk.vanguard-ia.tech`

### Código Actualizado:

```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://*.vanguard-ia.tech https://clerk.vanguard-ia.tech https://vercel.live"
```

---

## 🔄 Pasos para Aplicar la Solución

1. **Verificar cambios en código:**
   - El archivo `next.config.mjs` ya tiene los cambios aplicados
   - Verificar que todas las directivas CSP incluyan el dominio personalizado

2. **Commit y push:**
   ```bash
   git add next.config.mjs
   git commit -m "fix: agregar dominio personalizado de Clerk a CSP"
   git push
   ```

3. **Redeploy en Vercel:**
   - Las variables de entorno no cambian
   - Solo necesita redeploy del código
   - El deploy se activará automáticamente con el push

4. **Verificar solución:**
   - Visitar `https://vanguard-ia.tech/clientes/`
   - Abrir DevTools (F12) → Console
   - Verificar que NO haya errores de CSP
   - Verificar que Clerk cargue correctamente
   - Verificar que el botón "Acceso Clientes" aparezca

---

## ✅ Verificación Post-Fix

Después del redeploy, verificar:

- [ ] No hay errores de CSP en la consola
- [ ] Clerk carga correctamente (`isLoaded = true`)
- [ ] El botón "Acceso Clientes" aparece (si no estás autenticado)
- [ ] El formulario de login/signup de Clerk aparece en `/clientes/`
- [ ] La autenticación funciona correctamente

---

## 📝 Notas Importantes

1. **Dominio personalizado de Clerk:**
   - Si usas un dominio personalizado de Clerk (como `clerk.vanguard-ia.tech`), DEBES agregarlo a la CSP
   - La CSP es estricta por seguridad, por lo que debes permitir explícitamente cada dominio

2. **Subdominios:**
   - Se agregó `https://*.vanguard-ia.tech` para cubrir todos los subdominios
   - También se agregó `https://clerk.vanguard-ia.tech` específicamente para ser más explícito

3. **WebSockets:**
   - Se agregó `wss://*.vanguard-ia.tech` y `wss://clerk.vanguard-ia.tech` a `connect-src`
   - Esto permite conexiones WebSocket desde el dominio personalizado

4. **Seguridad:**
   - Los cambios mantienen la seguridad de la CSP
   - Solo se permiten dominios específicos y conocidos
   - No se usa `*` para todos los dominios (solo para subdominios específicos)

---

## 🔄 Si el Problema Persiste

1. **Verificar dominio en Clerk Dashboard:**
   - Ve a Clerk Dashboard → Domains
   - Verifica que `clerk.vanguard-ia.tech` esté configurado correctamente
   - Verifica que los registros DNS estén correctos

2. **Verificar redeploy:**
   - Asegúrate de que el redeploy se haya completado
   - Verifica los logs de Vercel para asegurar que no haya errores de build

3. **Hard refresh:**
   - Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac)
   - Esto fuerza al navegador a cargar la nueva versión

4. **Revisar logs:**
   - Revisa los logs de Vercel para errores de build o runtime
   - Revisa la consola del navegador para otros errores

---

## 📚 Referencias

- [Clerk Custom Domains Documentation](https://clerk.com/docs/custom-domains/overview)
- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
