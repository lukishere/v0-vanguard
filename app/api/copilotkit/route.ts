import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: NextRequest) {
  const geminiApiKey = process.env.GEMINI_API_KEY
  
  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({
        error: "Gemini API key not configured",
        message: "Please set GEMINI_API_KEY environment variable to test CopilotKit with Gemini.",
        instructions: "Add GEMINI_API_KEY=your_api_key_here to your .env.local file"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  try {
    const body = await req.json()
    console.log("=== COPILOTKIT REQUEST DEBUG ===")
    console.log("Full request body:", JSON.stringify(body, null, 2))
    console.log("Operation name:", body.operationName)
    console.log("Variables:", JSON.stringify(body.variables, null, 2))

    // Handle GraphQL queries from CopilotKit
    if (body.operationName === "generateCopilotResponse") {
      console.log("=== PROCESSING generateCopilotResponse ===")
      
      // Try different possible message locations
      const variables = body.variables || {}
      const data = variables.data || {}
      
      console.log("Data object:", JSON.stringify(data, null, 2))
      
      // Check multiple possible message locations
      let messages = data.messages || data.message || variables.messages || variables.message || []
      
      console.log("Found messages:", JSON.stringify(messages, null, 2))
      console.log("Messages type:", typeof messages)
      console.log("Messages length:", Array.isArray(messages) ? messages.length : "not array")
      
      // If messages is not an array, try to make it one
      if (!Array.isArray(messages)) {
        if (messages && typeof messages === 'object') {
          messages = [messages]
        } else if (typeof messages === 'string') {
          messages = [{ role: "user", content: messages }]
        } else {
          messages = []
        }
      }
      
      console.log("Processed messages:", JSON.stringify(messages, null, 2))
      
      // Get the last message or create a default one
      let messageContent = ""
      
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        console.log("Last message:", JSON.stringify(lastMessage, null, 2))
        
        // Handle CopilotKit's actual message structure
        messageContent = lastMessage?.textMessage?.content || 
                        lastMessage?.content || 
                        lastMessage?.text || 
                        lastMessage?.message || ""
      }
      
      // If still no content, check for other possible content locations
      if (!messageContent) {
        messageContent = data.content || data.text || data.prompt || variables.content || variables.text || variables.prompt || ""
      }
      
      console.log("Final message content:", messageContent)
      
      // If still no content, use a default
      if (!messageContent) {
        console.log("No content found, using default message")
        messageContent = "Hello"
      }

      console.log("=== CALLING GEMINI ===")
      console.log("Using content:", messageContent)

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      // Generate response with Gemini
      const result = await model.generateContent(messageContent)
      const response = await result.response
      const text = response.text()

      console.log("=== GEMINI RESPONSE ===")
      console.log("Gemini response:", text)

      // Return in CopilotKit expected format with proper GraphQL structure
      const responseData = {
        data: {
          generateCopilotResponse: {
            messages: [
              {
                __typename: "TextMessageOutput",
                id: `msg_${Date.now()}`,
                content: [text],
                role: "assistant",
                createdAt: new Date().toISOString(),
                parentMessageId: null
              }
            ],
            metaEvents: [],
            usage: {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            }
          }
        }
      }

      console.log("=== FINAL RESPONSE ===")
      console.log("Sending response:", JSON.stringify(responseData, null, 2))

      return new Response(
        JSON.stringify(responseData),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
        }
      )
    }

    // Handle other GraphQL operations
    console.log("=== UNSUPPORTED OPERATION ===")
    console.log("Operation:", body.operationName)
    
    return new Response(
      JSON.stringify({
        data: null,
        errors: [{ message: `Unsupported operation: ${body.operationName}` }]
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      }
    )

  } catch (error) {
    console.error("=== ERROR IN COPILOTKIT API ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    
    return new Response(
      JSON.stringify({
        data: null,
        errors: [{ 
          message: error instanceof Error ? error.message : "Unknown error occurred",
          extensions: { code: "INTERNAL_ERROR" }
        }]
      }),
      {
        status: 200, // GraphQL typically returns 200 even for errors
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      }
    )
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
} 