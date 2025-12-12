"use client";

import { ClientDetailModal } from "@/components/admin/client-detail-modal";
import type { Demo } from "@/lib/demos/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  metadata: any;
  lastActive: string | null;
}

interface ClientTableProps {
  clients: Client[];
  demos: Demo[];
}

export function ClientTable({ clients, demos }: ClientTableProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-500">
        Aún no hay clientes con acceso asignado. Usa el panel de Clerk para
        invitarlos y luego otorga demos desde aquí.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mail
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Última actividad
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => {
              // Split name into first and last name (defensive check)
              const nameParts = client.name ? client.name.split(" ") : [""];
              const firstName = nameParts[0] || "";
              const lastName = nameParts.slice(1).join(" ") || "";

              return (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleClientClick(client)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.lastActive
                      ? formatDistanceToNow(new Date(client.lastActive), {
                          locale: es,
                          addSuffix: true,
                        })
                      : "Sin actividad registrada"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          demos={demos}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
        />
      )}
    </>
  );
}
