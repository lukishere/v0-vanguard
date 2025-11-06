"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const functions = __importStar(require("firebase-functions"));
const zod_1 = require("zod");
// Initialize Genkit with Google AI plugin
const ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)()],
    model: googleai_1.gemini20Flash,
});
// Define the chat flow with proper types
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
// Export the Firebase function with proper configuration
exports.chat = functions.https.onCall(async (data, context) => {
    return chatFlow(data);
});
//# sourceMappingURL=index.js.map