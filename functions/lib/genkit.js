"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatFunction = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const params_1 = require("firebase-functions/params");
const firebase_functions_1 = require("firebase-functions");
const zod_1 = require("zod");
const https_1 = require("firebase-functions/https");
const apiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
const ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)()],
    model: googleai_1.gemini20Flash,
});
const guardbotMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(["user", "assistant"]),
    content: zod_1.z.string().min(1).max(4000),
});
const guardbotInputSchema = zod_1.z.object({
    message: zod_1.z.string().min(1).max(2000),
    context: zod_1.z.array(guardbotMessageSchema).max(12).optional(),
    locale: zod_1.z.enum(["en", "es"]).optional(),
});
const guardbotOutputSchema = zod_1.z.object({
    response: zod_1.z.string(),
    context: zod_1.z.array(guardbotMessageSchema),
});
const MAX_CONTEXT_MESSAGES = 8;
const SYSTEM_PROMPT = `You are GuardBot, the official AI assistant for VANGUARD. 
- Maintain a concise, professional tone that reflects a trusted technology consultancy.
- Base every answer solely on verified company information or the provided knowledge base context.
- When unsure, acknowledge the limitation and offer to connect the user with a human via email (contacto@vanguard-ia.tech).
- Adopt the role that best fits the topic (consultant, architect, security specialist) and ask 1–3 diagnostic questions before proposing next steps.
- Reference proven client outcomes (TechNova +40% efficiency, Global Financial Group security improvements, HealthPlus digital growth) when relevant.
- Always close with a clear call to action (audit, consultation, demo, call).
- Never fabricate contacts, pricing, or commitments.
- If the user asks for pricing, quotes, budgets, or estimates, decline to invent figures and instead invite them to share requirements via contacto@vanguard-ia.tech or schedule a quick call.`;
const FALLBACK = {
    en: "I ran into an issue composing that answer. Please try again or email us at contacto@vanguard-ia.tech.",
    es: "Tuve un problema al preparar la respuesta. Inténtalo de nuevo o escríbenos a contacto@vanguard-ia.tech.",
};
const chatFlow = ai.defineFlow({
    name: "chat",
    inputSchema: guardbotInputSchema,
    outputSchema: guardbotOutputSchema,
}, async ({ message, context = [], locale }) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
        const notice = (locale ?? "en") === "es"
            ? "No pude procesar un mensaje vacío. ¿Podrías reformularlo?"
            : "I couldn't process an empty message. Could you rephrase it?";
        return { response: notice, context };
    }
    const sanitizedHistory = sanitizeContext(context);
    const recentHistory = sanitizedHistory.slice(-MAX_CONTEXT_MESSAGES);
    const activeLocale = locale ?? "en";
    firebase_functions_1.logger.debug("GuardBot request received", {
        locale: activeLocale,
        messageLength: trimmedMessage.length,
        contextMessages: recentHistory.length,
    });
    const prompt = buildPrompt(trimmedMessage, recentHistory, activeLocale);
    try {
        const { text } = await ai.generate(prompt);
        const safeResponse = (text ?? "").trim() || FALLBACK[activeLocale];
        const polished = await polishResponse(safeResponse, activeLocale);
        firebase_functions_1.logger.debug("GuardBot response generated", {
            locale: activeLocale,
            responseLength: polished.length,
        });
        const newContext = [
            ...recentHistory,
            { role: "user", content: trimmedMessage },
            { role: "assistant", content: polished },
        ].slice(-MAX_CONTEXT_MESSAGES);
        return {
            response: polished,
            context: newContext,
        };
    }
    catch (error) {
        firebase_functions_1.logger.error("GuardBot generation failed", { error });
        return {
            response: FALLBACK[activeLocale],
            context: recentHistory,
        };
    }
});
exports.chatFunction = (0, https_1.onCallGenkit)({
    secrets: [apiKey],
    authPolicy: (0, https_1.hasClaim)("email_verified"),
    enforceAppCheck: true,
}, chatFlow);
function sanitizeContext(history) {
    return history
        .map((entry) => ({
        role: entry.role,
        content: entry.content.trim().slice(0, 800),
    }))
        .filter((entry) => entry.content.length > 0);
}
function buildPrompt(message, history, locale) {
    const tone = locale === "es"
        ? "Responde en español neutro y mantén un tono profesional y directo."
        : "Respond in neutral English with a professional, direct tone.";
    const historyText = history
        .map((entry) => `${entry.role === "user" ? "User" : "GuardBot"}: ${entry.content}`)
        .join("\n");
    const conversationBlock = historyText ? `Conversation so far:\n${historyText}\n\n` : "";
    return `${SYSTEM_PROMPT}\n${tone}\n\n${conversationBlock}Latest user request: ${message}`;
}
async function polishResponse(base, locale) {
    if (!base.trim()) {
        return base;
    }
    const instruction = locale === "es"
        ? `Reescribe la respuesta del asistente con tono consultivo, empático y orientado a siguientes pasos. Mantén cada hecho literal, los porcentajes, correos, teléfonos y la línea que inicia con "Fuente:". Respeta el idioma español neutro, conserva bullets o numeraciones y termina con una llamada a la acción clara.`
        : `Rewrite the assistant reply in a consultative, warm tone focused on next steps. Keep every fact, percentage, email, phone number, and the line starting with "Source:" exactly intact. Use neutral English, preserve bullets or numbering, and end with a clear call to action.`;
    const polishPrompt = `${instruction}\n---\n${base}`;
    const requiresSource = base.includes("Source:") || base.includes("Fuente:");
    try {
        const { text } = await ai.generate(polishPrompt);
        const polished = (text ?? "").trim();
        if (!polished) {
            return base;
        }
        if (requiresSource) {
            const carriesSource = polished.includes("Source:") || polished.includes("Fuente:");
            if (!carriesSource) {
                return base;
            }
        }
        return polished;
    }
    catch (error) {
        firebase_functions_1.logger.warn("GuardBot polishing skipped due to error", { error });
        return base;
    }
}
