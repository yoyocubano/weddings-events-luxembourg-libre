import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

interface Env {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers });
    }

    // 1. Validate Env Vars
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RESEND_API_KEY) {
        console.error("Missing Server Configuration");
        return new Response(JSON.stringify({ error: "Server configuration error" }), {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" },
        });
    }

    try {
        const data = await request.json<any>();
        const { name, email, message, phone, event_type, event_date, location, budget, guest_count, service_interest } = data;

        // 2. Initialize Clients
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        const resend = new Resend(env.RESEND_API_KEY);

        // 3. Insert into Supabase
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

        // 4. Send Email to Admin (Owner)
        await resend.emails.send({
            from: "Weddings Lux <onboarding@resend.dev>", // Or verified domain if available
            to: ["weddingeventslux@gmail.com"],
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

        // 5. Send Confirmation to Client
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

        return new Response(JSON.stringify({ message: "Success" }), {
            status: 200,
            headers: { ...headers, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Function Error:", error.message);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" },
        });
    }
};
