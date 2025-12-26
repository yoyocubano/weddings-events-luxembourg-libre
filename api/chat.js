
// DEEPSEEK CONFIG
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!DEEPSEEK_API_KEY) {
        console.error("Missing DEEPSEEK_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing DeepSeek API Key" });
    }

    try {
        const { messages, language } = req.body || {};

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        let langName = "English";
        if (language && language.startsWith("es")) langName = "Spanish";
        else if (language && language.startsWith("fr")) langName = "French";
        else if (language && language.startsWith("de")) langName = "German";
        else if (language && language.startsWith("pt")) langName = "Portuguese";
        else if (language && language.startsWith("lb")) langName = "Luxembourgish";

        // Enhanced System Instruction
        const systemMessage = {
            role: "system",
            content: SYSTEM_PROMPT + `\n\n*** CRITICAL INSTRUCTION ***\nThe user is speaking in ${langName} (Browsing Language: ${language}).\nYOU MUST REPLY IN ${langName} ONLY.\nDo not switch languages unless explicitly asked.`
        };

        // Construct DeepSeek/OpenAI compatible history
        // DeepSeek expects "system", "user", "assistant" roles. 
        // Our incoming "messages" are usually { role: "user" | "assistant", content: "..." }
        const conversationHistory = [systemMessage, ...messages];

        console.log(`[Rebeca AI] Calling DeepSeek. Language: ${langName}`);

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DeepSeek API Error: ${response.status} - ${errorText}`);
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;

        if (!generatedText) {
            throw new Error("No content returned from DeepSeek");
        }

        return res.status(200).json({
            role: "assistant",
            content: generatedText,
            text: generatedText
        });

    } catch (error) {
        console.error("🔥 FATAL SERVER ERROR:", error);

        // Return a polite fallback message if DeepSeek fails
        return res.status(200).json({
            role: "assistant",
            content: language?.startsWith("es")
                ? "⚠️ **Sistema Saturado:** Mis servidores neuronales están al máximo de capacidad. Por favor intenta de nuevo en 30 segundos."
                : "⚠️ **System Overload:** All my AI models are currently busy. Please try again in 30 seconds.",
            isOverloaded: true
        });
    }
}
