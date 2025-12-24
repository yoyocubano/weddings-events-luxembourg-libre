import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

export const handler: Handler = async (event) => {
    // CORS Headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "ok" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    if (!supabaseUrl || !supabaseKey || !resendApiKey) {
        console.error("Missing Server Configuration: URL, Key, or Resend Key");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Missing server configuration" }),
        };
    }

    try {
        const data = JSON.parse(event.body || "{}");
        const { name, email, message, phone, event_type, event_date, location, budget, guest_count, service_interest } = data;

        // 1. Initialize Clients
        const supabase = createClient(supabaseUrl, supabaseKey);
        const resend = new Resend(resendApiKey);

        // 2. Insert into Supabase
        const { error: dbError } = await supabase
            .from("inquiries")
            .insert([
                {
                    name,
                    email,
                    phone,
                    event_type,
                    event_date,
                    location,
                    budget,
                    guest_count,
                    service_interest,
                    message,
                },
            ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            throw new Error("Database insertion failed");
        }

        // 3. Send Email to Admin
        await resend.emails.send({
            from: "Weddings Lux <onboarding@resend.dev>", // Default Resend test domain
            to: ["weddingeventslux@gmail.com"], // Site Owner
            subject: `New Inquiry: ${name} - ${event_type}`,
            html: `
        <h1>New Web Inquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Event Type:</strong> ${event_type}</p>
        <p><strong>Date:</strong> ${event_date || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message"}</p>
      `,
        });

        // 4. Send Confirmation to Client
        await resend.emails.send({
            from: "Weddings Lux <onboarding@resend.dev>",
            to: [email],
            subject: "We received your inquiry - Weddings & Events Luxembourg",
            html: `
        <h1>Thank you, ${name}!</h1>
        <p>We have received your inquiry regarding <strong>${event_type}</strong> photography/videography.</p>
        <p>Our team will review your details and get back to you shortly.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The Weddings & Events Luxembourg Team</strong></p>
      `,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Success" }),
        };
    } catch (error: any) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || "Internal Server Error" }),
        };
    }
};
