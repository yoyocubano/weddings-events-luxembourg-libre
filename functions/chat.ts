interface Env {
    DEEPSEEK_API_KEY: string;
    CLOUDFLARE_GATEWAY_URL?: string;
}

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
5. **SAFETY & ETHICS:**
   - **Reject Inappropriate Requests:** Immediately and politely decline any request that is illegal, unethical, sexually explicit, or could harm the "WE Weddings & Events" brand.
   - **Provide a Reason:** Do not lecture, but state clearly that you cannot assist with requests of that nature. For example: "Lo siento, no puedo asistir con esa solicitud..."
   - **Do NOT Proceed:** Do not ask for details or try to gather leads for any inappropriate request. Terminate that line of conversation.
`;

// Language map for better detection
const LANGUAGE_MAP: { [key: string]: string } = {
    'es': 'Spanish', 'es-ES': 'Spanish', 'es-MX': 'Spanish',
    'fr': 'French', 'fr-FR': 'French',
    'de': 'German', 'de-DE': 'German',
    'pt': 'Portuguese', 'pt-PT': 'Portuguese', 'pt-BR': 'Portuguese',
    'lb': 'Luxembourgish',
    'en': 'English', 'en-US': 'English', 'en-GB': 'English'
};

// Generic error messages by language
const ERROR_MESSAGES: { [key: string]: string } = {
    'Spanish': 'Lo siento, experimenté un problema técnico. ¿Podrías intentar de nuevo?',
    'English': 'I apologize, I experienced a technical issue. Could you try again?',
    'French': 'Désolé, j\'ai rencontré un problème technique. Pourriez-vous réessayer?',
    'German': 'Entschuldigung, ich hatte ein technisches Problem. Könnten Sie es erneut versuchen?',
    'Portuguese': 'Desculpe, tive um problema técnico. Você poderia tentar novamente?',
    'Luxembourgish': 'Entschëllegt, ech hat en technescht Problem. Kënnt Dir et nach eng Kéier probéieren?'
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers });
    }

    if (!env.DEEPSEEK_API_KEY) {
        return new Response(JSON.stringify({ error: "Server configuration error: Missing DEEPSEEK_API_KEY" }), {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }

    let detectedLanguage = 'English';

    try {
        const bodyText = await request.text();
        const { messages, language } = JSON.parse(bodyText || "{}");

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), {
                status: 400,
                headers: { ...headers, "Content-Type": "application/json" }
            });
        }

        detectedLanguage = LANGUAGE_MAP[language] || LANGUAGE_MAP[language?.split('-')[0]] || 'English';

        // Prepare messages for DeepSeek (System Prompt + History)
        const deepseekMessages = [
            { role: "system", content: SYSTEM_PROMPT + `\n\n*** CURRENT USER LANGUAGE: ${detectedLanguage} ***\nRespond ONLY in ${detectedLanguage}.` },
            ...messages.map((msg: any) => ({
                role: msg.role === 'client' ? 'user' : msg.role, // Normalize 'client' to 'user' just in case
                content: msg.content
            }))
        ];

        // Use AI Gateway if configured, otherwise direct API
        const apiUrl = env.CLOUDFLARE_GATEWAY_URL
            ? `${env.CLOUDFLARE_GATEWAY_URL}/chat/completions`
            : "https://api.deepseek.com/chat/completions";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // V3
                messages: deepseekMessages,
                temperature: 0.7,
                max_tokens: 1024,
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Chat API] DeepSeek Error:", response.status, errorText);
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data: any = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;

        if (!generatedText) {
            throw new Error('Empty response from DeepSeek AI');
        }

        return new Response(JSON.stringify({
            role: "assistant",
            content: generatedText,
            text: generatedText, // legacy support for frontend
        }), {
            status: 200,
            headers: { ...headers, "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("[Chat API] Function error:", { message: error.message });
        const userMessage = ERROR_MESSAGES[detectedLanguage] || ERROR_MESSAGES['English'];

        return new Response(JSON.stringify({
            error: "Internal Server Error",
            role: "assistant",
            content: userMessage,
            text: userMessage,
        }), {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }
};
