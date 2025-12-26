
import { createClient } from "@supabase/supabase-js";

export type ContactFormData = {
    name: string;
    email: string;
    phone?: string;
    eventType: string;
    eventDate?: string;
    message?: string;
    honeypot?: string;
};

export type SubmitResult = {
    success: boolean;
    message?: string;
};

export async function submitInquiry(data: ContactFormData): Promise<SubmitResult> {
    // Spam Check
    if (data.honeypot) {
        console.log("Spam detected: Honeypot filled");
        return { success: false, message: "Spam detected" };
    }

    const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        event_type: data.eventType,
        event_date: data.eventDate || null,
        message: data.message || null,
        location: null, // Add fields if needed
        budget: null,
        guest_count: null,
        service_interest: null
    };

    try {
        const res = await fetch("/api/submit-inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Server submission failed");
        }

        return { success: true };
    } catch (e) {
        console.warn("API Submission Error:", e);
        return { success: false, message: "Submission failed. Please try again." };
    }
}
