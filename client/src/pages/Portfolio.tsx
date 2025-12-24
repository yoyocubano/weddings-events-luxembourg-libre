import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Portfolio() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { id: 1, name: t("portfolio.categories.weddings") },
    { id: 2, name: t("portfolio.categories.engagements") },
    { id: 3, name: t("portfolio.categories.events") },
    { id: 4, name: t("portfolio.categories.pets") },
    { id: 5, name: t("portfolio.categories.corporate") },
    { id: 6, name: t("portfolio.categories.dance") },
    { id: 7, name: t("portfolio.categories.private") },
  ];

  const allProjects = [
    {
      id: 1,
      title: t("portfolio.projects.chateau.title"),
      description: t("portfolio.projects.chateau.desc"),
      location: t("portfolio.projects.chateau.location"),
      coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      imageUrls: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=600&fit=crop",
      ],
      categoryId: 1,
    },
    {
      id: 2,
      title: t("portfolio.projects.city.title"),
      description: t("portfolio.projects.city.desc"),
      location: t("portfolio.projects.city.location"),
      coverImageUrl: "/city-engagement.png",
      imageUrls: [
        "/city-engagement.png",
      ],
      categoryId: 2,
    },
    {
      id: 3,
      title: t("portfolio.projects.pets_park.title"),
      description: t("portfolio.projects.pets_park.desc"),
      location: t("portfolio.projects.pets_park.location"),
      coverImageUrl: "/pet-dog.png",
      imageUrls: [
        "/pet-dog.png",
        "/pet-cat.png",
        "/pet-walk.png"
      ],
      categoryId: 4,
    },
    {
      id: 4,
      title: t("portfolio.projects.corporate_summit.title"),
      description: t("portfolio.projects.corporate_summit.desc"),
      location: t("portfolio.projects.corporate_summit.location"),
      coverImageUrl: "/corp-meeting.png",
      imageUrls: [
        "/corp-meeting.png",
        "/corp-woman.png",
        "/corp-presentation.png"
      ],
      categoryId: 5,
    },
    {
      id: 5,
      title: t("portfolio.projects.dance_studio.title"),
      description: t("portfolio.projects.dance_studio.desc"),
      location: t("portfolio.projects.dance_studio.location"),
      coverImageUrl: "/dance-ballet.png",
      imageUrls: [
        "/dance-ballet.png",
        "/dance-hiphop.png",
        "/dance-duo.png"
      ],
      categoryId: 6,
    },
    {
      id: 6,
      title: t("portfolio.projects.private_celebration.title"),
      description: t("portfolio.projects.private_celebration.desc"),
      location: t("portfolio.projects.private_celebration.location"),
      coverImageUrl: "/private-bday.png",
      imageUrls: [
        "/private-bday.png",
        "/private-reveal.png",
        "/private-dinner.png"
      ],
      categoryId: 7,
    },
  ];

  const projects = allProjects.filter(p => !selectedCategory || p.categoryId === selectedCategory);

  const openGallery = (project: any, imageIndex: number = 0) => {
    setSelectedProject(project);
    setCurrentImageIndex(imageIndex);
  };

  const closeGallery = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      const images = selectedProject.imageUrls;
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const images = selectedProject.imageUrls;
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {t("portfolio.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-card border-b border-border sticky top-20 z-40">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
              className={selectedCategory === undefined ? "" : "bg-transparent"}
            >
              {t("portfolio.all_projects")}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "" : "bg-transparent"}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const images = project.imageUrls;
              return (
                <Card
                  key={project.id}
                  className="group cursor-pointer overflow-hidden border-border hover:shadow-xl transition-shadow"
                  onClick={() => openGallery(project, 0)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {project.location}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <p className="text-sm text-primary mt-3 font-medium">
                      {t("portfolio.view_photos", { count: images.length })} →
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Gallery Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={closeGallery}>
          <DialogContent className="max-w-6xl w-full p-0 bg-black/95">
            <DialogTitle className="sr-only">{selectedProject.title}</DialogTitle>
            <div className="relative">
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-video">
                {Array.isArray(selectedProject.imageUrls) && selectedProject.imageUrls[currentImageIndex] ? (
                  <img
                    src={selectedProject.imageUrls[currentImageIndex]}
                    alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    Image not available
                  </div>
                )}

                {Array.isArray(selectedProject.imageUrls) && selectedProject.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 text-white">
                <h3 className="text-2xl font-serif font-semibold mb-2">
                  {selectedProject.title}
                </h3>
                {selectedProject.location && (
                  <p className="text-white/70 mb-2">📍 {selectedProject.location}</p>
                )}
                {selectedProject.description && (
                  <p className="text-white/80">{selectedProject.description}</p>
                )}
                <p className="text-white/60 text-sm mt-4">
                  Image {currentImageIndex + 1} of {Array.isArray(selectedProject.imageUrls) ? selectedProject.imageUrls.length : 0}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
