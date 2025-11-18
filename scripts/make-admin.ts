/**
 * Script para asignar rol de admin a un usuario
 *
 * Uso:
 * 1. Obtén el userId del usuario desde Clerk Dashboard
 * 2. Ejecuta: pnpm tsx scripts/make-admin.ts <userId>
 *
 * O modifica este script con el email del usuario y ejecútalo
 */

import { clerkClient } from '@clerk/nextjs/server'

async function makeAdmin(userIdOrEmail: string) {
  try {
    const clerk = await clerkClient()
    let userId = userIdOrEmail

    // Si es un email, buscar el usuario primero
    if (userIdOrEmail.includes('@')) {
      const users = await clerk.users.getUserList({
        emailAddress: [userIdOrEmail],
      })

      if (users.data.length === 0) {
        console.error(`❌ No se encontró usuario con email: ${userIdOrEmail}`)
        return
      }

      userId = users.data[0].id
      console.log(`✅ Usuario encontrado: ${users.data[0].emailAddresses[0]?.emailAddress}`)
    }

    // Obtener usuario actual
    const user = await clerk.users.getUser(userId)

    console.log(`\n📋 Usuario actual:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.emailAddresses[0]?.emailAddress}`)
    console.log(`   Nombre: ${user.fullName || user.username || 'N/A'}`)
    console.log(`   Rol actual: ${user.publicMetadata?.role || 'sin rol'}`)

    // Actualizar metadatos para asignar rol admin
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role: 'admin',
      },
    })

    console.log(`\n✅ Rol de admin asignado correctamente!`)
    console.log(`\n🔐 El usuario ahora puede acceder a: /admin/`)

  } catch (error) {
    console.error('❌ Error al asignar rol de admin:', error)
    process.exit(1)
  }
}

// Ejecutar script
const userIdOrEmail = process.argv[2]

if (!userIdOrEmail) {
  console.log(`
📝 Script para asignar rol de admin

Uso:
  pnpm tsx scripts/make-admin.ts <userId-o-email>

Ejemplos:
  pnpm tsx scripts/make-admin.ts user_2abc123xyz
  pnpm tsx scripts/make-admin.ts admin@vanguard-ia.tech

Nota: Necesitas tener las variables de entorno de Clerk configuradas.
  `)
  process.exit(1)
}

makeAdmin(userIdOrEmail)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
