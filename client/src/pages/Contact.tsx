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
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
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
  });

  const createInquiry = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your inquiry!", {
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
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
      });
    },
    onError: (error) => {
      toast.error("Failed to submit inquiry", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createInquiry.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      eventType: formData.eventType,
      eventDate: formData.eventDate ? new Date(formData.eventDate) : undefined,
      location: formData.location || undefined,
      budget: formData.budget || undefined,
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
      serviceInterest: formData.serviceInterest || undefined,
      message: formData.message || undefined,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              <Card className="border-border">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                    {t("contact.form.title")}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("contact.form.name")}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t("contact.form.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+352 123 456 789"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="eventType">{t("contact.form.event_type")}</Label>
                        <Select
                          value={formData.eventType}
                          onValueChange={(value) => handleInputChange("eventType", value)}
                          required
                        >
                          <SelectTrigger id="eventType">
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
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">{t("contact.form.date")}</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => handleInputChange("eventDate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">{t("contact.form.location")}</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Luxembourg City"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">{t("contact.form.budget")}</Label>
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => handleInputChange("budget", value)}
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
                          value={formData.guestCount}
                          onChange={(e) => handleInputChange("guestCount", e.target.value)}
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceInterest">{t("contact.form.service_interest")}</Label>
                      <Select
                        value={formData.serviceInterest}
                        onValueChange={(value) => handleInputChange("serviceInterest", value)}
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
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder={t("contact.form.placeholder_msg")}
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={createInquiry.isPending}
                    >
                      {createInquiry.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("contact.form.sending")}
                        </>
                      ) : (
                        t("contact.form.submit")
                      )}
                    </Button>
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
