'use client'

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import CopilotSimpleTest from "@/components/copilot-simple-test"
import "@copilotkit/react-ui/styles.css"

export default function CopilotSimplePage() {
  return (
    <CopilotKit 
      runtimeUrl="/api/copilotkit"
    >
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              CopilotKit Simple Test
            </h1>
            <p className="text-gray-600 text-lg">
              Basic functionality test for CopilotKit integration
            </p>
          </div>
          
          <CopilotSimpleTest />
        </div>

        {/* CopilotKit Popup Assistant */}
        <CopilotPopup
          instructions="You are an AI assistant for VANGUARD, a technology consultancy. You can help users explore VANGUARD's services (AI Solutions, IT Infrastructure, Web Development, Cybersecurity, Data Analytics) and perform actions like selecting or clearing services. Be helpful and professional."
          labels={{
            title: "VANGUARD Assistant",
            initial: "Hi! I can help you explore VANGUARD's services. Try asking me about our services or tell me to select one!"
          }}
        />
      </div>
    </CopilotKit>
  )
} 