import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MOCK_PROJECTS, MOCK_CATEGORIES } from "@/lib/mockData";

export default function Portfolio() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: categoriesData } = trpc.portfolio.getCategories.useQuery();
  const { data: projectsData, isLoading: isLoadingProjects } = trpc.portfolio.getProjects.useQuery({
    categoryId: selectedCategory,
  });

  const categories = categoriesData || MOCK_CATEGORIES;
  const projects = projectsData || MOCK_PROJECTS.filter(p => !selectedCategory || p.categoryId === selectedCategory);
  const isLoading = false; // Force loading off since we have mock data

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
      const images = JSON.parse(selectedProject.imageUrls);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const images = JSON.parse(selectedProject.imageUrls);
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
            {categories?.map((category) => (
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
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const images = JSON.parse(project.imageUrls);
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
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                {t("portfolio.no_projects")}
              </p>
            </div>
          )}
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
                <img
                  src={JSON.parse(selectedProject.imageUrls)[currentImageIndex]}
                  alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {JSON.parse(selectedProject.imageUrls).length > 1 && (
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
                  Image {currentImageIndex + 1} of {JSON.parse(selectedProject.imageUrls).length}
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
