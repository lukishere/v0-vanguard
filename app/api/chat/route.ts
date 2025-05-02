import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    // Create a system prompt that defines the chatbot's behavior
    const systemPrompt = `You are VANGUARD's Groq-powered assistant, designed to help website visitors learn about VANGUARD's services.

VANGUARD is a consultancy specializing in:
- AI Development: AI strategy, machine learning implementation, NLP, computer vision, AI integration
- Computer Services: IT strategy, system architecture, technology optimization, digital transformation
- Web Branding: Brand identity, website design, UX optimization, content strategy, SEO
- Web Innovation: Custom web apps, responsive design, progressive web apps, e-commerce, interactive UIs
- Infrastructure Consulting: Cloud design, on-premises solutions, hybrid cloud, infrastructure optimization
- Security: Security assessment, threat detection, data protection, compliance management, security training

Contact information:
- Email: negocios@vanguard.es
- Phone: +34 627 961 956
- Location: Barcelona, Spain
- Hours: Monday-Friday 9:00-18:00, Saturday 10:00-14:00, Sunday closed

Be helpful, professional, and concise. If asked about something outside VANGUARD's services, politely redirect the conversation to how VANGUARD can help with technology and business needs.`

    // Extract the user's message
    const userMessage = messages[messages.length - 1].content

    // Generate a response using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: userMessage,
      system: systemPrompt,
      maxTokens: 500,
    })

    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
