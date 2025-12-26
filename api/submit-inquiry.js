
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_API_KEY) {
        console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or RESEND_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing Database/Email Keys" });
    }

    try {
        const data = req.body || {};
        const { name, email, message, phone, event_type, event_date, location, budget, guest_count, service_interest } = data;

        // 1. Initialize Clients
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const resend = new Resend(RESEND_API_KEY);

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
        // Note: 'from' and 'to' must be verified domains in Resend unless in testing mode.
        // Assuming user has correct keys or stays in testing.
        await resend.emails.send({
            from: "Weddings Lux <onboarding@resend.dev>",
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

        // 4. Send Confirmation to Client
        if (email) {
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
        }

        return res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error("Submit Inquiry Error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
