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
4. **Knowledge Base:**
   - **Services:** Photo (1800€ start), Video (2500€ start), Premium Combo (3200€).
   - **Protocol:** We plan 12-18 months ahead. "Peace of Mind" is our motto.
   - **Team:** Joan (Photographer), Abel (Cinematographer), Yusmel (Marketing), Rebeca (You - Coordinator).

**TONE:** Warm, reassuring, "Luxury Service".
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
