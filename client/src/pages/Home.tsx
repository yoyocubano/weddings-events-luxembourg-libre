import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Camera, Video, Heart, Award, Users, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: featuredProjects, isLoading: loadingProjects } = trpc.portfolio.getFeatured.useQuery({ limit: 6 });
  const { data: services, isLoading: loadingServices } = trpc.services.getAll.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 min-h-screen flex items-center bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
                Capturing Your
                <span className="text-primary block">Perfect Moments</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Professional photography and videography services for weddings and events throughout Luxembourg. 
                We transform your special day into timeless memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/portfolio">
                  <Button size="lg" variant="default" className="text-base">
                    View Our Work
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-base bg-transparent">
                    Get a Quote
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
                    <p className="font-semibold text-foreground">Award Winning</p>
                    <p className="text-sm text-muted-foreground">Photography Studio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive photography and videography solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3">Wedding Photography</h3>
                <p className="text-muted-foreground">
                  Capture every precious moment of your special day with our expert wedding photography services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3">Event Videography</h3>
                <p className="text-muted-foreground">
                  Professional video production that tells your story in a cinematic and engaging way.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3">Full Event Coverage</h3>
                <p className="text-muted-foreground">
                  Complete coverage combining photography and videography for a comprehensive memory collection.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" className="bg-transparent">
                View All Services
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
              Featured Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into our portfolio of beautiful weddings and events
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
                View Full Portfolio
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
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience, quality, and dedication to capturing your perfect moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Award-Winning Team</h3>
              <p className="text-muted-foreground">
                Recognized professionals with years of experience in luxury event photography
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
              <p className="text-muted-foreground">
                Tailored packages and dedicated attention to every detail of your event
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxembourg Experts</h3>
              <p className="text-muted-foreground">
                Deep knowledge of the best venues and locations throughout Luxembourg
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Ready to Capture Your Story?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss your upcoming event and create something beautiful together
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="text-base">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
