import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();

  const packages = [
    {
      id: 1,
      name: t("services_page.packages.essential.name"),
      description: t("services_page.packages.essential.desc"),
      price: 1800,
      priceLabel: t("services_page.packages.essential.price_label"),
      features: [
        t("services_page.packages.essential.features.0"),
        t("services_page.packages.essential.features.1"),
        t("services_page.packages.essential.features.2"),
        t("services_page.packages.essential.features.3"),
      ],
      popular: 0,
    },
    {
      id: 2,
      name: t("services_page.packages.premium.name"),
      description: t("services_page.packages.premium.desc"),
      price: 3200,
      priceLabel: t("services_page.packages.premium.price_label"),
      features: [
        t("services_page.packages.premium.features.0"),
        t("services_page.packages.premium.features.1"),
        t("services_page.packages.premium.features.2"),
        t("services_page.packages.premium.features.3"),
        t("services_page.packages.premium.features.4"),
      ],
      popular: 1,
    },
    {
      id: 3,
      name: t("services_page.packages.cinema.name"),
      description: t("services_page.packages.cinema.desc"),
      price: 2500,
      priceLabel: t("services_page.packages.cinema.price_label"),
      features: [
        t("services_page.packages.cinema.features.0"),
        t("services_page.packages.cinema.features.1"),
        t("services_page.packages.cinema.features.2"),
        t("services_page.packages.cinema.features.3"),
      ],
      popular: 0,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {t("services_page.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("services_page.subtitle")}
          </p>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const isPopular = pkg.popular === 1;

              return (
                <Card
                  key={pkg.id}
                  className={`relative border-border hover:shadow-xl transition-shadow ${isPopular ? "ring-2 ring-primary" : ""
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      {t("services_page.most_popular")}
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-serif">{pkg.name}</CardTitle>
                    <div className="mt-4">
                      {pkg.price ? (
                        <div>
                          <span className="text-4xl font-bold text-foreground">
                            €{Number(pkg.price).toLocaleString()}
                          </span>
                          {pkg.priceLabel && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {pkg.priceLabel}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-2xl font-semibold text-foreground">
                          {pkg.priceLabel || t("services_page.custom_quote")}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-center">
                      {pkg.description}
                    </p>
                    <ul className="space-y-3">
                      {pkg.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className={`w-full ${!isPopular ? "bg-transparent" : ""}`}
                      >
                        {t("services_page.get_started")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-16 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              {t("services_page.specialized_title", "Specialized Services")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("services_page.specialized_subtitle", "Tailored solutions for every unique occasion.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🐾</span>
                  {t("services.pets.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t("services.pets.desc")}</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">{t("services_page.get_started")}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🏢</span>
                  {t("services.corporate.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t("services.corporate.desc")}</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">{t("services_page.get_started")}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">💃</span>
                  {t("services.dance_schools.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t("services.dance_schools.desc")}</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">{t("services_page.get_started")}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  {t("services.private_events.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t("services.private_events.desc")}</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">{t("services_page.get_started")}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services (Included) */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              {t("services_page.included.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("services_page.included.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold mb-2">{t("services_page.included.equipment.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("services_page.included.equipment.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">{t("services_page.included.editing.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("services_page.included.editing.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="font-semibold mb-2">{t("services_page.included.delivery.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("services_page.included.delivery.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">{t("services_page.included.support.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("services_page.included.support.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t("services_page.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("services_page.cta.subtitle")}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="text-base">
              {t("services_page.cta.button")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
