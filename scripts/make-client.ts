/**
 * Script para asignar rol de client a un usuario
 *
 * Uso:
 * 1. Obtén el userId del usuario desde Clerk Dashboard
 * 2. Ejecuta: pnpm tsx scripts/make-client.ts <userId>
 *
 * O modifica este script con el email del usuario y ejecútalo
 */

import { clerkClient } from '@clerk/nextjs/server'

async function makeClient(userIdOrEmail: string) {
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

    // Actualizar metadatos para asignar rol client
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role: 'client',
        demoAccess: user.publicMetadata?.demoAccess || [],
      },
    })

    console.log(`\n✅ Rol de client asignado correctamente!`)
    console.log(`\n🔐 El usuario ahora puede acceder a: /dashboard/`)
    console.log(`💡 Para asignar demos, ve al panel de admin: /admin/clientes`)

  } catch (error) {
    console.error('❌ Error al asignar rol de client:', error)
    process.exit(1)
  }
}

// Ejecutar script
const userIdOrEmail = process.argv[2]

if (!userIdOrEmail) {
  console.log(`
📝 Script para asignar rol de client

Uso:
  pnpm tsx scripts/make-client.ts <userId-o-email>

Ejemplos:
  pnpm tsx scripts/make-client.ts user_2abc123xyz
  pnpm tsx scripts/make-client.ts cliente@empresa.com

Nota: Necesitas tener las variables de entorno de Clerk configuradas.
  `)
  process.exit(1)
}

makeClient(userIdOrEmail)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
