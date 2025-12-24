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

  // Form Schema Definition
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.validation.name_required") }),
    email: z.string().email({ message: t("contact.form.validation.email_invalid") }),
    phone: z.string().optional(),
    eventType: z.string().min(1, { message: t("contact.form.validation.event_type_required") }),
    eventDate: z.string().optional(),
    location: z.string().optional(),
    budget: z.string().optional(),
    guestCount: z.string().optional(),
    serviceInterest: z.string().optional(),
    message: z.string().optional(),
    honeypot: z.string().optional() // Invisible field for spam protection
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
      location: "",
      budget: "",
      guestCount: "",
      serviceInterest: "",
      message: "",
      honeypot: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Spam Check: If honeypot is filled, silently reject (simulated success)
    if (data.honeypot) {
      console.log("Spam detected: Honeypot filled");
      toast.success(t("contact.form.success_title") || "Inquiry Sent!", {
        description: t("contact.form.success_desc") || "We have received your message and saved it to our database.",
      });
      return;
    }

    setIsSubmitting(true);

    // 1. Prepare Data Payload (Defined BEFORE usage)
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      event_type: data.eventType,
      event_date: data.eventDate || null,
      location: data.location || null,
      budget: data.budget || null,
      guest_count: data.guestCount ? parseInt(data.guestCount) : null,
      service_interest: data.serviceInterest || null,
      message: data.message || null
    };

    // Environment variables
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      // Create an array of promises
      const submissions = [];

      // 2. Client-Side Supabase Insert (Direct)
      // Replaces Netlify Function due to credit limits
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        // Initialize client dynamically to avoid global scope issues if vars are missing
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        submissions.push(
          supabase
            .from("inquiries")
            .insert([payload])
            .then(({ error }) => {
              if (error) throw error;
              return "Supabase Success";
            })
        );
      } else {
        console.warn("Supabase credentials missing (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)");
      }

      // 3. Secondary: Google Sheets (Optional/Backup)
      if (GOOGLE_SCRIPT_URL) {
        submissions.push(
          fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
        );
      }

      // Execute all submissions
      if (submissions.length === 0) {
        console.warn("No submission endpoints configured.");
      } else {
        await Promise.all(submissions);
      }

      toast.success(t("contact.form.success_title") || "Inquiry Sent!", {
        description: t("contact.form.success_desc") || "We have received your message.",
      });

      form.reset();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Error sending message", {
        description: "Please check your internet connection or try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

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
      <section className="py-16 bg-background">
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

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    {/* Honeypot Field - Hidden */}
                    <input
                      type="text"
                      {...form.register("honeypot")}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={form.formState.errors.name ? "text-destructive" : ""}>
                          {t("contact.form.name")}
                        </Label>
                        <Input
                          id="name"
                          {...form.register("name")}
                          placeholder="John Doe"
                          aria-invalid={!!form.formState.errors.name}
                          className={form.formState.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive" role="alert">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className={form.formState.errors.email ? "text-destructive" : ""}>
                          {t("contact.form.email")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="john@example.com"
                          aria-invalid={!!form.formState.errors.email}
                          className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive" role="alert">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register("phone")}
                          placeholder="+352 123 456 789"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="eventType" className={form.formState.errors.eventType ? "text-destructive" : ""}>
                          {t("contact.form.event_type")}
                        </Label>
                        <Select
                          onValueChange={(value) => form.setValue("eventType", value, { shouldValidate: true })}
                          defaultValue={form.getValues("eventType")}
                        >
                          <SelectTrigger id="eventType" className={form.formState.errors.eventType ? "border-destructive focus:ring-destructive" : ""}>
                            <SelectValue placeholder={t("contact.form.select_event")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wedding">{t("contact.form.event_types.wedding")}</SelectItem>
                            <SelectItem value="corporate">{t("contact.form.event_types.corporate")}</SelectItem>
                            <SelectItem value="celebration">{t("contact.form.event_types.celebration")}</SelectItem>
                            <SelectItem value="engagement">{t("contact.form.event_types.engagement")}</SelectItem>
                            <SelectItem value="other">{t("contact.form.event_types.other")}</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.eventType && (
                          <p className="text-sm text-destructive" role="alert">{form.formState.errors.eventType.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">{t("contact.form.date")}</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          {...form.register("eventDate")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">{t("contact.form.location")}</Label>
                        <Input
                          id="location"
                          {...form.register("location")}
                          placeholder="Luxembourg City"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">{t("contact.form.budget")}</Label>
                        <Select
                          onValueChange={(value) => form.setValue("budget", value)}
                          defaultValue={form.getValues("budget")}
                        >
                          <SelectTrigger id="budget">
                            <SelectValue placeholder={t("contact.form.select_budget")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-2000">{t("contact.form.budgets.under_2k")}</SelectItem>
                            <SelectItem value="2000-5000">{t("contact.form.budgets.2k_5k")}</SelectItem>
                            <SelectItem value="5000-10000">{t("contact.form.budgets.5k_10k")}</SelectItem>
                            <SelectItem value="over-10000">{t("contact.form.budgets.over_10k")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestCount">{t("contact.form.guests")}</Label>
                        <Input
                          id="guestCount"
                          type="number"
                          {...form.register("guestCount")}
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceInterest">{t("contact.form.service_interest")}</Label>
                      <Select
                        onValueChange={(value) => form.setValue("serviceInterest", value)}
                        defaultValue={form.getValues("serviceInterest")}
                      >
                        <SelectTrigger id="serviceInterest">
                          <SelectValue placeholder={t("contact.form.select_service")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photography">{t("contact.form.services.photo")}</SelectItem>
                          <SelectItem value="videography">{t("contact.form.services.video")}</SelectItem>
                          <SelectItem value="both">{t("contact.form.services.both")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.form.message")}</Label>
                      <Textarea
                        id="message"
                        {...form.register("message")}
                        placeholder={t("contact.form.placeholder_msg")}
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("contact.form.sending")}
                        </>
                      ) : (
                        t("contact.form.submit")
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                      <Lock className="w-4 h-4" />
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82574.15944827707!2d6.0296741!3d49.6116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954d69cf20a0e9%3A0x409ce34b3186e8d!2sLuxembourg!5e0!3m2!1sen!2s!4v1234567890"
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
