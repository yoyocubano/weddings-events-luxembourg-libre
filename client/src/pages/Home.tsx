import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: t("portfolio.projects.city.title"),
      description: t("portfolio.projects.city.desc"),
      location: t("portfolio.projects.city.location"),
      coverImageUrl: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=600&fit=crop",
    },
  ];

  const loadingProjects = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 min-h-screen flex items-center bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
                {t('hero.title_start')}
                <span className="text-primary block">{t('hero.title_highlight')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link href="/contact">
                  <Button size="lg" className="text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t('hero.get_quote')}
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="outline" className="text-base bg-transparent border-foreground/20 hover:bg-background/50">
                    {t('hero.view_work')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop"
                  alt="Wedding photography"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('hero.award_winning')}</p>
                    <p className="text-sm text-muted-foreground">{t('hero.studio')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              {t('why_choose.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('why_choose.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-6 text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('why_choose.team.title')}</h3>
                <p className="text-muted-foreground">{t('why_choose.team.desc')}</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-6 text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('why_choose.service.title')}</h3>
                <p className="text-muted-foreground">{t('why_choose.service.desc')}</p>
              </CardContent>
            </Card>
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-6 text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('why_choose.local.title')}</h3>
                <p className="text-muted-foreground">{t('why_choose.local.desc')}</p>
              </CardContent>
            </Card>
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
                <h3 className="text-2xl font-serif font-semibold mb-3">{t('services.wedding.title')}</h3>
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
                <h3 className="text-2xl font-serif font-semibold mb-3">{t('services.video.title')}</h3>
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
                <h3 className="text-2xl font-serif font-semibold mb-3">{t('services.full.title')}</h3>
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
