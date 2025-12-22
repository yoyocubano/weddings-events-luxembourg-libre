import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Award, Heart, Camera, Users } from "lucide-react";

export default function About() {
  const { data: team, isLoading } = trpc.team.getAll.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                About Us
              </h1>
              <p className="text-lg text-muted-foreground">
                We are a passionate team of photographers and videographers dedicated to capturing 
                the most precious moments of your life. Based in Luxembourg, we specialize in weddings 
                and special events, bringing years of experience and artistic vision to every project.
              </p>
              <p className="text-lg text-muted-foreground">
                Our approach combines technical excellence with genuine emotion, ensuring that every 
                photograph and video tells your unique story in the most beautiful way possible.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"
                alt="Our team at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What drives us to create exceptional work for every client
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-muted-foreground">
                We love what we do and it shows in every frame we capture
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                Committed to delivering the highest quality in every project
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Creativity</h3>
              <p className="text-muted-foreground">
                Bringing artistic vision and innovation to every shoot
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connection</h3>
              <p className="text-muted-foreground">
                Building relationships and understanding your unique story
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The talented professionals behind every beautiful moment
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : team && team.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <Card key={member.id} className="border-border hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={member.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Team information coming soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Our Experience */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Our Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Years of expertise serving clients throughout Luxembourg
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">10+</div>
              <p className="text-lg text-foreground font-medium">Years Experience</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">500+</div>
              <p className="text-lg text-foreground font-medium">Events Covered</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">100%</div>
              <p className="text-lg text-foreground font-medium">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Let's Create Something Beautiful
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            We'd love to hear about your upcoming event and discuss how we can help
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
