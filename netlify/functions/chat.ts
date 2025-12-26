import type { Handler } from "@netlify/functions";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `
You are "Rebeca" - the Event Coordinator for "WE Weddings & Events Luxembourg". 
You are calm, professional, and very knowledgeable.

**CORE DIRECTIVES:**
1. **Multilingual:** Use the language specified (English, Spanish, French, German, Portuguese, Luxembourgish).
2. **Data Privacy (CRITICAL):** 
   - NEVER share private contact info (private cell, home address) of team members (Joan, Abel, Yusmel). 
   - Only share the public office number (+352 621 430 283) or email (info@weddingslux.com).
   - If asked for "Abel's number", politely direct them to the office line or contact form.
3. **Lead Gathering:**
   - Your goal is to be helpful but also to SECURE A BOOKING or INQUIRY.
   - If the user seems interested, casually ask for their "Name" and "Event Date".
   - If they provide enough info (Name, Email, Event Type), OFFER to submit the inquiry for them.
   - To submit, output this JSON block ONLY (no markdown): [[SUBMIT_INQUIRY: {"name": "...", "email": "...", "eventType": "wedding|corporate|...", "message": "..."}]]
4. **Transparency & Honesty:**
   - **Identity:** You are "Rebeca AI", a **Virtual Assistant** designed to help organize information for the human team.
   - **Honesty:** If asked if you are AI, say YES. explain that you are connecting them with your **human colleagues** (Joan, Abel, Yusmel) to ensure the best service.
   - **Conciseness:** Keep answers **short, concise, and direct**. Avoid long paragraphs.
   - **Role:** You gather details so the human team can take over seamlessly.

**TONE:** Warm, reassuring, "Luxury Service".
`;

// Language map for better detection
const LANGUAGE_MAP: { [key: string]: string } = {
  'es': 'Spanish',
  'es-ES': 'Spanish',
  'es-MX': 'Spanish',
  'fr': 'French',
  'fr-FR': 'French',
  'de': 'German',
  'de-DE': 'German',
  'pt': 'Portuguese',
  'pt-PT': 'Portuguese',
  'pt-BR': 'Portuguese',
  'lb': 'Luxembourgish',
  'en': 'English',
  'en-US': 'English',
  'en-GB': 'English'
};

// Error messages by language
const ERROR_MESSAGES: { [key: string]: string } = {
  'Spanish': 'Lo siento, experimenté un problema técnico. ¿Podrías intentar de nuevo?',
  'English': 'I apologize, I experienced a technical issue. Could you try again?',
  'French': 'Désolé, j\'ai rencontré un problème technique. Pourriez-vous réessayer?',
  'German': 'Entschuldigung, ich hatte ein technisches Problem. Könnten Sie es erneut versuchen?',
  'Portuguese': 'Desculpe, tive um problema técnico. Você poderia tentar novamente?',
  'Luxembourgish': 'Entschëllegt, ech hat en technescht Problem. Kënnt Dir et nach eng Kéier probéieren?'
};

export const handler: Handler = async (event) => {
    // CORS Headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    };

    // Handle OPTIONS for CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    // Only accept POST
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            headers, 
            body: JSON.stringify({ error: "Method Not Allowed" }) 
        };
    }

    // Validate API key
    if (!GOOGLE_API_KEY) {
        console.error("[Chat API] Missing GOOGLE_API_KEY");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Server configuration error: Missing Google API Key" 
            }),
        };
    }

    try {
        // Parse and validate request body
        const { messages, language } = JSON.parse(event.body || "{}");

        if (!messages || !Array.isArray(messages)) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "Invalid request body: messages array required" }) 
            };
        }

        if (messages.length === 0) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: "Messages array cannot be empty" }) 
            };
        }

        // Detect language with fallback
        const detectedLanguage = LANGUAGE_MAP[language] || 
                                LANGUAGE_MAP[language?.split('-')[0]] || 
                                'English';

        console.log(`[Chat API] Processing - Language: ${detectedLanguage}, Messages: ${messages.length}`);

        // Build enhanced prompt
        let fullPrompt = SYSTEM_PROMPT + 
            `\n\n*** CRITICAL LANGUAGE INSTRUCTION ***\n` +
            `The user is communicating in ${detectedLanguage}.\n` +
            `YOU MUST respond EXCLUSIVELY in ${detectedLanguage}.\n` +
            `DO NOT mix languages or respond in any other language.\n\n` +
            `Conversation History:\n`;

        messages.forEach((msg: any) => {
            fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        fullPrompt += "Assistant:";

        // Call Google Gemini API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 1024,
                    }
                }),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Chat API] Gemini API Error:", errorText);

            // Circuit Breaker: Handle Overload/Quota limits gracefully
            if (response.status === 429 || response.status === 503) {
                const overloadMsg = language?.startsWith("es")
                    ? "⚠️ **Sistema Saturado:** Estoy recibiendo muchas consultas ahora mismo. Por favor, usa el formulario de contacto para una respuesta prioritaria."
                    : "⚠️ **System Busy:** I am receiving high traffic right now. Please use the contact form for priority service.";
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        role: "assistant",
                        content: overloadMsg,
                        text: overloadMsg,
                        isOverloaded: true
                    }),
                };
            }

            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: "Error communicating with AI provider" }),
            };
        }

        const data = await response.json();

        // Parse Gemini Response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                             ERROR_MESSAGES[detectedLanguage] || 
                             ERROR_MESSAGES['English'];

        if (!generatedText) {
            throw new Error('Empty response from AI');
        }

        console.log(`[Chat API] Success - Response length: ${generatedText.length} chars`);

        // Return in a format compatible with frontend
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                role: "assistant",
                content: generatedText,
                text: generatedText,
                language: detectedLanguage,
                timestamp: new Date().toISOString()
            }),
        };

    } catch (error: any) {
        console.error("[Chat API] Function error:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Determine error type
        let statusCode = 500;
        let errorMessage = "Internal Server Error";
        
        if (error.name === 'AbortError') {
            statusCode = 504;
            errorMessage = "Request timeout";
        } else if (error.message?.includes('API key')) {
            statusCode = 401;
            errorMessage = "Authentication failed";
        } else if (error.message?.includes('quota')) {
            statusCode = 429;
            errorMessage = "Rate limit exceeded";
        }

        // Try to get language-specific error message
        const requestBody = JSON.parse(event.body || "{}");
        const requestLanguage = requestBody.language;
        const detectedLang = LANGUAGE_MAP[requestLanguage] || 
                            LANGUAGE_MAP[requestLanguage?.split('-')[0]] || 
                            'English';
        
        const userMessage = ERROR_MESSAGES[detectedLang] || ERROR_MESSAGES['English'];

        return {
            statusCode: statusCode,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                role: "assistant",
                content: userMessage,
                text: userMessage,
                timestamp: new Date().toISOString()
            }),
        };
    }
};
