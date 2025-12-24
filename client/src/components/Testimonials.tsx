import { Star, Quote, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
    const { t } = useTranslation();

    // Datos dinámicos desde i18n
    const testimonials = [
        {
            id: 1,
            name: t("testimonials.1.author"),
            role: t("testimonials.1.role"),
            content: t("testimonials.1.text"),
            rating: 5,
            image: "/testimonial-sophie-marc.png"
        },
        {
            id: 2,
            name: t("testimonials.2.author"),
            role: t("testimonials.2.role"),
            content: t("testimonials.2.text"),
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
        },
        {
            id: 3,
            name: t("testimonials.3.author"),
            role: t("testimonials.3.role"),
            content: t("testimonials.3.text"),
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
        }
    ];

    const stats = [
        { label: t("testimonials.stats.weddings"), value: "150+" },
        { label: t("testimonials.stats.clients"), value: "98%" },
        { label: t("testimonials.stats.rating"), value: "5.0 ★" }
    ];

    return (
        <section className="py-24 bg-stone-50" id="testimonials">
            <div className="container mx-auto px-4">
                {/* Header de la sección */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                        <Star className="w-4 h-4 fill-primary" />
                        <span className="tracking-wide uppercase">{t("testimonials.badge")}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                        {t("testimonials.title")}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t("testimonials.subtitle")}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-y border-stone-200 py-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2 font-serif">{stat.value}</div>
                            <div className="text-gray-600 uppercase tracking-wider text-sm font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden">
                            <CardContent className="p-8 relative">
                                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-gray-700 italic mb-8 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust Badges / Client Logos (Visual Placeholder) */}
                {/* Trust Badges / Client Logos */}
                <div className="text-center mb-16">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">{t("testimonials.badge")}</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-xl font-serif font-bold text-gray-400">VOGUE</div>
                        <div className="text-xl font-serif font-bold text-gray-400">BRIDES</div>
                        <div className="text-xl font-serif font-bold text-gray-400">MyWed</div>
                        <div className="text-xl font-serif font-bold text-gray-400">Fearless</div>
                    </div>
                </div>

                {/* External Reviews Call to Action */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                        {t("testimonials.leave_review_title", "Votre avis compte pour nous")}
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t("testimonials.leave_review_desc", "Aidez les futurs couples à nous trouver en partageant votre expérience.")}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://www.trustpilot.com/review/weddingseventslux.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00b67a] text-white rounded-lg font-medium hover:bg-[#009c69] transition-colors"
                        >
                            <Star className="w-5 h-5 fill-current" />
                            Review on TrustPilot
                        </a>
                        <a
                            href="https://g.page/r/weddingseventslux/review"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4285F4] text-white rounded-lg font-medium hover:bg-[#3367D6] transition-colors"
                        >
                            <Star className="w-5 h-5 fill-current" />
                            Review on Google
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
