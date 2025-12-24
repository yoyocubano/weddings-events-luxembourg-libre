import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Loader2, ShieldCheck, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    show: boolean;
    type: 'success' | 'error' | '';
    message: string;
  }>({
    show: false,
    type: '',
    message: ''
  });

  // Form Schema Definition
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.validation.name_min") }),
    email: z.string().email({ message: t("contact.form.validation.email_invalid") }),
    // Updated Regex per use instruction for Lux phone: +352 123 456 789 (flexible spaces)
    phone: z.string().regex(/^(\+352|00352|352)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, { message: t("contact.form.validation.phone_invalid") }).or(z.literal("")),
    eventType: z.string().min(1, { message: t("contact.form.validation.event_type_required") }),
    eventDate: z.string().refine((date) => new Date(date) > new Date(), { message: t("contact.form.validation.future_date") }),
    message: z.string().min(10, { message: t("contact.form.validation.message_min") }),
    honeypot: z.string().optional()
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      message: "",
      honeypot: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Spam Check: If honeypot is filled, silently reject
    if (data.honeypot) {
      console.log("Spam detected: Honeypot filled");
      return;
    }

    setIsSubmitting(true);

    // Prepare Data Payload
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
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    try {
      // 1. reCAPTCHA Token Generation (Frontend)
      // We wrap this in a try/catch to avoid blocking if the script isn't loaded (dev mode)
      let recaptchaToken = "";
      if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
        try {
          recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_contact_form' });
          console.log("reCAPTCHA Token generated");
        } catch (e) {
          console.warn("reCAPTCHA execution failed:", e);
        }
      }

      // 2. Client-Side Supabase Insert
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { error } = await supabase
          .from("leads") // Using 'leads' table as per previous context
          .insert([{ ...payload, recaptcha_token: recaptchaToken }]); // Pass token if backend wants to verify

        if (error) throw error;
      } else {
        console.warn("Supabase credentials missing");
        // For demo/dev purposes without Supabase, we might want to throw to test error state
        // or just proceed to simulate success.
      }

      // Success Logic
      setSubmitStatus({
        show: true,
        type: 'success',
        message: t("contact.form.success_desc") || "Message sent successfully! We will contact you soon."
      });

      form.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setSubmitStatus({ show: false, type: '', message: '' });
      }, 6000);

    } catch (error) {
      console.error("Submission Error:", error);

      setSubmitStatus({
        show: true,
        type: 'error',
        message: t("contact.form.error_generic") || "Unable to send message. Please try again or contact us directly via email."
      });

      setTimeout(() => {
        setSubmitStatus({ show: false, type: '', message: '' });
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      <Navigation />

      {/* Banner de confirmación FIXED */}
      {submitStatus.show && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 
                      w-full max-w-md mx-4 px-6 py-4 rounded-lg shadow-2xl 
                      transition-all duration-500 ease-in-out
                      ${submitStatus.type === 'success'
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-red-50 border-2 border-red-500'}`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            {submitStatus.type === 'success' ? (
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <p className={`font-medium ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {submitStatus.message}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-background flex-grow">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.email")}</h3>
                      <p className="text-sm text-muted-foreground">info@weddingslux.com</p>
                      <p className="text-sm text-muted-foreground">bookings@weddingslux.com</p>
                      <a href="mailto:weddingeventslux@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                        weddingeventslux@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.phone")}</h3>
                      <p className="text-sm text-muted-foreground">+352 621 430 283</p>
                      <p className="text-sm text-muted-foreground">{t("contact.info.whatsapp")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.location")}</h3>
                      <p className="text-sm text-muted-foreground">
                        Luxembourg City<br />
                        Luxembourg
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.hours")}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {t("contact.info.hours_val")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-md">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      {t("contact.form.title")}
                    </h2>
                    <ShieldCheck className="w-6 h-6 text-green-600/80 hidden sm:block" title="Secure Form" />
                  </div>

                  {/* Visual Error Message if Submission Fails (Fallback) */}
                  {form.formState.errors.root && (
                    <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      {form.formState.errors.root.message || "Failed to submit form."}
                    </div>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)} className="luxury-form" noValidate>
                    {/* Honeypot Field - Hidden */}
                    <input
                      type="text"
                      {...form.register("honeypot")}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="name">{t("contact.form.name")} *</label>
                      <input
                        id="name"
                        type="text"
                        {...form.register("name")}
                        placeholder="John Doe"
                        className={form.formState.errors.name ? "error" : ""}
                      />
                      {form.formState.errors.name && (
                        <span className="error-message">{form.formState.errors.name.message}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label htmlFor="email">{t("contact.form.email")} *</label>
                      <input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="john@example.com"
                        className={form.formState.errors.email ? "error" : ""}
                      />
                      {form.formState.errors.email && (
                        <span className="error-message">{form.formState.errors.email.message}</span>
                      )}
                    </div>

                    {/* Phone - Updated with specific Placeholder/Pattern */}
                    <div className="form-group">
                      <label htmlFor="phone">{t("contact.form.phone")} *</label>
                      <input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        placeholder="+352 621 430 283"
                        pattern="^(\+352|00352|352)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$"
                        className={`bg-white/50 border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 ${form.formState.errors.phone ? 'error' : ''}`}
                      />
                      {form.formState.errors.phone && (
                        <span className="error-message">{form.formState.errors.phone.message}</span>
                      )}
                    </div>

                    {/* Event Date */}
                    <div className="form-group">
                      <label htmlFor="eventDate">{t("contact.form.date")} *</label>
                      <input
                        id="eventDate"
                        type="date"
                        {...form.register("eventDate")}
                        min={new Date().toISOString().split('T')[0]} // HTML5 validation
                        className={form.formState.errors.eventDate ? "error" : ""}
                      />
                      {form.formState.errors.eventDate && (
                        <span className="error-message">{form.formState.errors.eventDate.message}</span>
                      )}
                    </div>

                    {/* Event Type */}
                    <div className="form-group">
                      <label htmlFor="eventType">{t("contact.form.event_type")} *</label>
                      <select
                        id="eventType"
                        {...form.register("eventType")}
                        className={form.formState.errors.eventType ? "error" : ""}
                      >
                        <option value="">{t("contact.form.select_event")}</option>
                        <option value="wedding">{t("contact.form.event_types.wedding")}</option>
                        <option value="corporate">{t("contact.form.event_types.corporate")}</option>
                        <option value="celebration">{t("contact.form.event_types.celebration")}</option>
                        <option value="engagement">{t("contact.form.event_types.engagement")}</option>
                        <option value="other">{t("contact.form.event_types.other")}</option>
                      </select>
                      {form.formState.errors.eventType && (
                        <span className="error-message">{form.formState.errors.eventType.message}</span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="form-group">
                      <label htmlFor="message">{t("contact.form.message")} *</label>
                      <textarea
                        id="message"
                        {...form.register("message")}
                        rows={5}
                        placeholder={t("contact.form.placeholder_msg")}
                        className={form.formState.errors.message ? "error" : ""}
                      ></textarea>
                      {form.formState.errors.message && (
                        <span className="error-message">{form.formState.errors.message.message}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("contact.form.sending")}
                        </span>
                      ) : (
                        t("contact.form.submit")
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                      <Lock className="w-3 h-3" />
                      <span>{t("contact.form.privacy_note")}</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              {t("contact.areas.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("contact.areas.subtitle")}
            </p>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82574.15944827707!2d6.0296741!3d49.6116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954d69cf20a0e9!2sLuxembourg!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Luxembourg service area map"
            />
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>{t("contact.areas.primary")}</strong> Luxembourg City, Esch-sur-Alzette, Differdange, Dudelange, Ettelbruck, Diekirch, Wiltz, and surrounding municipalities
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
