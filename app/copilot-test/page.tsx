'use client'

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core"
import { useState } from "react"
import "@copilotkit/react-ui/styles.css"

// Mock data to test context awareness
const mockVanguardServices = [
  { id: 1, name: "AI Solutions", description: "Custom AI implementations for business automation" },
  { id: 2, name: "IT Infrastructure", description: "Cloud and on-premise infrastructure management" },
  { id: 3, name: "Web Development", description: "Modern web applications and digital experiences" },
  { id: 4, name: "Cybersecurity", description: "Comprehensive security solutions and audits" },
  { id: 5, name: "Data Analytics", description: "Business intelligence and data visualization" }
]

const mockProjects = [
  { id: 1, name: "E-commerce Platform", status: "In Progress", client: "TechCorp" },
  { id: 2, name: "AI Chatbot Implementation", status: "Completed", client: "RetailPlus" },
  { id: 3, name: "Security Audit", status: "Planning", client: "FinanceSecure" }
]

// Inner component that uses CopilotKit hooks
function CopilotTestContent() {
  const [selectedService, setSelectedService] = useState<string>("")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [notifications, setNotifications] = useState<string[]>([])

  // Make services data available to the AI
  useCopilotReadable({
    description: "VANGUARD's available services and their descriptions",
    value: mockVanguardServices,
  })

  // Make current projects available to the AI
  useCopilotReadable({
    description: "Current projects and their status",
    value: mockProjects.filter(p => 
      projectFilter === "all" || p.status.toLowerCase() === projectFilter
    ),
  })

  // Make current UI state available to the AI
  useCopilotReadable({
    description: "Current user interface state",
    value: {
      selectedService,
      projectFilter,
      notificationCount: notifications.length
    },
  })

  // Action: Select a service
  useCopilotAction({
    name: "selectService",
    description: "Select a VANGUARD service to highlight",
    parameters: [
      {
        name: "serviceName",
        type: "string",
        description: "The name of the service to select",
        required: true,
      },
    ],
    handler: async ({ serviceName }) => {
      const service = mockVanguardServices.find(s => 
        s.name.toLowerCase().includes(serviceName.toLowerCase())
      )
      if (service) {
        setSelectedService(service.name)
        setNotifications(prev => [...prev, `Selected service: ${service.name}`])
      }
    },
  })

  // Action: Filter projects
  useCopilotAction({
    name: "filterProjects",
    description: "Filter projects by status (all, completed, in progress, planning)",
    parameters: [
      {
        name: "status",
        type: "string",
        description: "The status to filter by",
        required: true,
      },
    ],
    handler: async ({ status }) => {
      const validStatuses = ["all", "completed", "in progress", "planning"]
      const normalizedStatus = status.toLowerCase()
      
      if (validStatuses.includes(normalizedStatus)) {
        setProjectFilter(normalizedStatus)
        setNotifications(prev => [...prev, `Filtered projects by: ${status}`])
      }
    },
  })

  // Action: Add notification
  useCopilotAction({
    name: "addNotification",
    description: "Add a notification message for the user",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The notification message",
        required: true,
      },
    ],
    handler: async ({ message }) => {
      setNotifications(prev => [...prev, message])
    },
  })

  const filteredProjects = mockProjects.filter(p => 
    projectFilter === "all" || p.status.toLowerCase() === projectFilter
  )

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              CopilotKit Test Environment
            </h1>
            <p className="text-blue-200 text-lg">
              Testing CopilotKit integration alongside existing GUARDBOT
            </p>
            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-blue-100 text-sm">
                💡 Try asking the AI assistant about VANGUARD services, current projects, or ask it to perform actions like "select AI Solutions" or "filter completed projects"
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">VANGUARD Services</h2>
              <div className="space-y-4">
                {mockVanguardServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedService === service.name
                        ? 'bg-blue-500/30 border-blue-400 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedService(service.name)}
                  >
                    <h3 className="text-white font-medium mb-2">{service.name}</h3>
                    <p className="text-blue-200 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Current Projects</h2>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="bg-slate-800 text-white px-3 py-1 rounded border border-slate-600"
                >
                  <option value="all">All Projects</option>
                  <option value="completed">Completed</option>
                  <option value="in progress">In Progress</option>
                  <option value="planning">Planning</option>
                </select>
              </div>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <h3 className="text-white font-medium mb-1">{project.name}</h3>
                    <p className="text-blue-200 text-sm mb-2">Client: {project.client}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                      project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="bg-green-900/30 backdrop-blur rounded-xl p-6 border border-green-500/30 mb-8">
              <h3 className="text-green-300 font-semibold mb-4">AI Actions Performed:</h3>
              <div className="space-y-2">
                {notifications.map((notification, index) => (
                  <div key={index} className="text-green-100 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {notification}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setNotifications([])}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Clear Notifications
              </button>
            </div>
          )}

          {/* Comparison Info */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">CopilotKit vs GUARDBOT Comparison</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-blue-300 font-medium mb-2">CopilotKit Features:</h4>
                <ul className="text-blue-100 space-y-1">
                  <li>• Context-aware conversations</li>
                  <li>• Action execution capabilities</li>
                  <li>• Real-time data integration</li>
                  <li>• Customizable UI components</li>
                  <li>• Built-in state management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-300 font-medium mb-2">GUARDBOT Features:</h4>
                <ul className="text-green-100 space-y-1">
                  <li>• Custom Firebase integration</li>
                  <li>• Google Gemini AI model</li>
                  <li>• VANGUARD brand styling</li>
                  <li>• Conversation history</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CopilotKit Popup Component */}
        <CopilotPopup
          instructions="You are an AI assistant for VANGUARD, a technology consultancy company. You have access to information about VANGUARD's services, current projects, and can perform actions to help users interact with the interface. Be helpful, professional, and focus on VANGUARD's capabilities in AI, IT infrastructure, web development, cybersecurity, and data analytics."
          labels={{
            title: "VANGUARD CopilotKit Assistant",
            initial: "Hi! I'm your VANGUARD AI assistant. I can help you explore our services, check project status, and interact with this interface. Try asking me about our services or tell me to perform actions like 'select AI Solutions' or 'show completed projects'."
          }}
        />
      </div>
  )
}

// Main page component that wraps with CopilotKit provider
export default function CopilotTestPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotTestContent />
    </CopilotKit>
  )
} 