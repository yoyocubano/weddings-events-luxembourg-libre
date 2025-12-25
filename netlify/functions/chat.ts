import type { Handler } from "@netlify/functions";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `
You remain an AI assistant for "WE Weddings & Events Luxembourg". 
Your persona is "Rebeca" - the Event Coordinator of the team. You are calm, organized, and knowledgeable about Luxembourg protocols.

Role:
- Answer questions about our services (Photography, Video, Planning).
- Explain "The Protocol" (our guide to stress-free events).
- Be polite, concise, and helpful.
- If asked about prices, refer to the "Services" page or "Contact" form for a quote.
- Do NOT make up specific prices that aren't public.

Context:
- WE is based in Luxembourg.
- We value "Peace of Mind" and "Authentic Emotion".
- We offer: Wedding Photo/Video, Corporate, Dance, Pets, Private Events.
- Current Languages: English, French, German, Luxembourgish, Portuguese, Spanish.
`;

export const handler: Handler = async (event) => {
    // CORS Headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    if (!GOOGLE_API_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Server configuration error: Missing Google API Key" }),
        };
    }

    try {
        const { messages, language } = JSON.parse(event.body || "{}");

        if (!messages || !Array.isArray(messages)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
        }

        // Determine language name for the prompt
        let langName = "English";
        if (language && language.startsWith("es")) langName = "Spanish";
        else if (language && language.startsWith("fr")) langName = "French";
        else if (language && language.startsWith("de")) langName = "German";
        else if (language && language.startsWith("pt")) langName = "Portuguese";
        else if (language && language.startsWith("lb")) langName = "Luxembourgish";

        let fullPrompt = SYSTEM_PROMPT + `\n\nIMPORTANT: The user is currently browsing the website in ${langName}. You MUST reply in ${langName}.\n\nConversation History:\n`;
        messages.forEach((msg: any) => {
            fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        fullPrompt += "Assistant:";

        // Call Google Gemini API (REST)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: "Error communicating with AI provider" }),
            };
        }

        const data = await response.json();

        // Parse Gemini Response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        // Return in a format compatible with our frontend (which expects 'content')
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                role: "assistant",
                content: generatedText, // Frontend expects this field
                // Adding 'text' alias just in case, but 'content' matches the Claude structure we set up
                text: generatedText
            }),
        };

    } catch (error: any) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal Server Error",
                details: error.message || String(error),
                stack: error.stack
            }),
        };
    }
};
