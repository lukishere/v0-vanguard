'use client'

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core"
import { useState } from "react"
import "@copilotkit/react-ui/styles.css"

const VANGUARD_SERVICES = [
  "AI Solutions",
  "IT Infrastructure", 
  "Web Development",
  "Cybersecurity",
  "Data Analytics"
]

export default function CopilotSimpleTest() {
  const [selectedService, setSelectedService] = useState<string>("")
  const [actionLog, setActionLog] = useState<string[]>([])

  // Make VANGUARD services available to AI
  useCopilotReadable({
    description: "VANGUARD's available services",
    value: VANGUARD_SERVICES,
  })

  // Make current state available to AI
  useCopilotReadable({
    description: "Currently selected service",
    value: selectedService || "None selected",
  })

  // Action to select a service
  useCopilotAction({
    name: "selectService",
    description: "Select a VANGUARD service",
    parameters: [
      {
        name: "service",
        type: "string",
        description: "The service name to select",
        required: true,
      },
    ],
    handler: async ({ service }) => {
      const matchedService = VANGUARD_SERVICES.find(s => 
        s.toLowerCase().includes(service.toLowerCase())
      )
      
      if (matchedService) {
        setSelectedService(matchedService)
        setActionLog(prev => [...prev, `Selected: ${matchedService}`])
      } else {
        setActionLog(prev => [...prev, `Service not found: ${service}`])
      }
    },
  })

  // Action to clear selection
  useCopilotAction({
    name: "clearSelection",
    description: "Clear the currently selected service",
    parameters: [],
    handler: async () => {
      setSelectedService("")
      setActionLog(prev => [...prev, "Cleared selection"])
    },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          CopilotKit Simple Test
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            VANGUARD Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VANGUARD_SERVICES.map((service) => (
              <div
                key={service}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedService === service
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Current Selection
          </h3>
          <div className="p-3 bg-gray-50 rounded border">
            {selectedService || "No service selected"}
          </div>
        </div>

        {actionLog.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              AI Action Log
            </h3>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              {actionLog.map((log, index) => (
                <div key={index} className="text-green-800 text-sm">
                  • {log}
                </div>
              ))}
              <button
                onClick={() => setActionLog([])}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Clear Log
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            Test Instructions:
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click the chat button to open the CopilotKit assistant</li>
            <li>• Ask about VANGUARD services: "What services does VANGUARD offer?"</li>
            <li>• Request actions: "Select AI Solutions" or "Clear the selection"</li>
            <li>• Test context awareness: "What service is currently selected?"</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 