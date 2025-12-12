'use client'

import { useEffect, useState } from 'react'
import { ClientTable } from './client-table'
import { getClientMetadataFromUser } from '@/lib/admin/clerk-metadata'
import { getAllDemos } from '@/lib/demos/catalog'
import { getClientActivityStats } from '@/app/actions/client-activities'

interface Client {
  id: string
  name: string
  email: string | null
  metadata: any
  lastActive: string | null
}

interface Demo {
  id: string
  name: string
  description: string
  category: string
}

export function ClientTableWrapper() {
  const [clients, setClients] = useState<Client[]>([])
  const [demos, setDemos] = useState<Demo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load demos first (they don't require Clerk)
        const demosData = await getAllDemos()
        setDemos(demosData)

        // Load clients data from API route instead of direct Clerk call
        const response = await fetch('/api/admin/clients')
        if (!response.ok) {
          throw new Error('Failed to fetch clients')
        }
        const data = await response.json()
        // ✅ Extract clients array from response
        setClients(data.clients || [])
      } catch (err) {
        console.error('Error loading clients data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Cargando clientes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return <ClientTable clients={clients} demos={demos} />
}
