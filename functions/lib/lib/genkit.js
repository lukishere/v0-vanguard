"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatFunction = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const https_1 = require("firebase-functions/https");
const params_1 = require("firebase-functions/params");
const zod_1 = require("zod");
const apiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
const ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)()],
    model: googleai_1.gemini20Flash,
});
// Define the chat flow
const chatFlow = ai.defineFlow({
    name: "chat",
    inputSchema: zod_1.z.object({
        message: zod_1.z.string(),
        context: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string()
        })).optional()
    }),
    outputSchema: zod_1.z.object({
        response: zod_1.z.string(),
        context: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string()
        }))
    }),
}, async ({ message, context = [] }) => {
    const prompt = `You are GUARDBOT, a professional AI assistant for VANGUARD. 
  You provide concise, helpful responses about VANGUARD's services.
  Previous conversation context: ${JSON.stringify(context)}
  User message: ${message}`;
    const { text } = await ai.generate(prompt);
    const newContext = [
        ...context,
        { role: 'user', content: message },
        { role: 'assistant', content: text }
    ];
    return {
        response: text,
        context: newContext
    };
});
// Export the Firebase function
exports.chatFunction = (0, https_1.onCallGenkit)({
    secrets: [apiKey],
    authPolicy: (0, https_1.hasClaim)("email_verified"),
    enforceAppCheck: true,
}, chatFlow);
//# sourceMappingURL=genkit.js.map