import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Camera, Video, Heart, Award, Users, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const featuredProjects = [
    {
      id: 1,
      title: t("portfolio.projects.chateau.title"),
      description: t("portfolio.projects.chateau.desc"),
      location: t("portfolio.projects.chateau.location"),
      coverImageUrl: "/couple-balcony-luxury.png",
    },
    {
      id: 2,
      title: t("portfolio.projects.city.title"),
      description: t("portfolio.projects.city.desc"),
      location: t("portfolio.projects.city.location"),
      coverImageUrl: "/city-engagement.png",
    },
  ];

  const loadingProjects = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section id="main-content" className="relative pt-20 min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-chateau-sunset.png"
            alt="Luxury Event in Luxembourg Chateau"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight tracking-tight">
              {t('hero.title')}
              <span className="block text-3xl md:text-4xl lg:text-5xl font-sans font-light mt-4 tracking-widest uppercase text-primary-foreground/90">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
              {t('hero.description')}
            </p>

            <div className="pt-8">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 h-auto tracking-widest uppercase font-sans">
                  {t('hero.cta_primary')}
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-12 flex flex-col items-center space-y-2 opacity-80">
              <span className="text-xs tracking-[0.2em] uppercase font-sans">{t('hero.trust_badge')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.wedding.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.wedding.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.video.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.video.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.full.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.full.desc')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" className="bg-transparent">
                {t('services.view_all')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>

          {loadingProjects ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects?.slice(0, 6).map((project) => (
                <Link key={project.id} href="/portfolio">
                  <a className="group block">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button variant="default" size="lg">
                {t('featured.view_full')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('why_choose.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('why_choose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.team.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.team.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.service.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.service.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.local.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.local.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('cta.subtitle')}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="text-base">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
