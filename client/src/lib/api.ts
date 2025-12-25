
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
        status: 'new'
    };

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    let supabaseSuccess = false;
    let supabaseError = null;

    // 1. Supabase Insert
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { error } = await supabase
                .from("leads")
                .insert([payload]);

            if (!error) supabaseSuccess = true;
            else {
                console.warn("Supabase insert failed:", error);
                supabaseError = error;
            }
        } catch (e) {
            console.warn("Supabase client error:", e);
        }
    }

    // 2. Netlify Forms Submission (Fallback)
    const encode = (data: any) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    try {
        const res = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({
                "form-name": "contact",
                ...payload,
            })
        });
        if (!res.ok) throw new Error("Netlify form failed");
        console.log("Netlify Form submitted successfully");
        return { success: true };
    } catch (netlifyError) {
        console.warn("Netlify Form submission failed:", netlifyError);
        // Return success if at least Supabase worked
        if (supabaseSuccess) return { success: true };
        return { success: false, message: "Submission failed. Please try again or email us directly." };
    }
}
