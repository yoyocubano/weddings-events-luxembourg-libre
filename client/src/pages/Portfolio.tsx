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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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
      coverImageUrl: "/chateau-wedding.png",
      media: [
        { type: "image", url: "/chateau-wedding.png" },
        { type: "image", url: "/chateau-detail.png" },
        { type: "image", url: "/couple-balcony-luxury.png" },
      ],
      categoryId: 1,
    },
    {
      id: 2,
      title: t("portfolio.projects.city.title"),
      description: t("portfolio.projects.city.desc"),
      location: t("portfolio.projects.city.location"),
      coverImageUrl: "/city-engagement.png",
      media: [
        { type: "image", url: "/city-engagement.png" },
      ],
      categoryId: 2,
    },
    {
      id: 3,
      title: t("portfolio.projects.pets_park.title"),
      description: t("portfolio.projects.pets_park.desc"),
      location: t("portfolio.projects.pets_park.location"),
      coverImageUrl: "/pet-dog.png",
      media: [
        { type: "image", url: "/pet-dog.png" },
        { type: "image", url: "/pet-cat.png" },
        { type: "image", url: "/pet-walk.png" }
      ],
      categoryId: 4,
    },
    {
      id: 4,
      title: t("portfolio.projects.corporate_summit.title"),
      description: t("portfolio.projects.corporate_summit.desc"),
      location: t("portfolio.projects.corporate_summit.location"),
      coverImageUrl: "/corp-meeting.png",
      media: [
        { type: "image", url: "/corp-meeting.png" },
        { type: "image", url: "/corp-woman.png" },
        { type: "image", url: "/corp-presentation.png" }
      ],
      categoryId: 5,
    },
    {
      id: 5,
      title: t("portfolio.projects.dance_studio.title"),
      description: t("portfolio.projects.dance_studio.desc"),
      location: t("portfolio.projects.dance_studio.location"),
      coverImageUrl: "/dance-ballet.png",
      media: [
        { type: "image", url: "/dance-ballet.png" },
        { type: "image", url: "/dance-hiphop.png" },
        { type: "image", url: "/dance-duo.png" }
      ],
      categoryId: 6,
    },
    {
      id: 6,
      title: t("portfolio.projects.private_celebration.title"),
      description: t("portfolio.projects.private_celebration.desc"),
      location: t("portfolio.projects.private_celebration.location"),
      coverImageUrl: "/private-bday.png",
      media: [
        { type: "image", url: "/private-bday.png" },
        { type: "image", url: "/private-reveal.png" },
        { type: "image", url: "/private-dinner.png" }
      ],
      categoryId: 7,
    },
    {
      id: 7,
      title: t("portfolio.projects.sbk.title"),
      description: t("portfolio.projects.sbk.desc"),
      location: t("portfolio.projects.sbk.location"),
      coverImageUrl: "/sbk-dance-cover.png",
      media: [
        { type: "image", url: "/sbk-dance-cover.png" },
        { type: "image", url: "/sbk-caribbean-teachers.png" },
        { type: "image", url: "/sbk-diverse-crowd.png" },
        { type: "image", url: "/sbk-bachata-sensual.png" },
        { type: "image", url: "/sbk-detail-feet.png" },
        // EXAMPLE LOOPS: Replace 'url' with your Google Drive direct link (ending in .mp4 or use a proxy)
        // Note: Google Drive "view" links don't work in <video> tags. You need a direct download link.
        {
          type: "video",
          url: "https://www.w3schools.com/html/mov_bbb.mp4", // REPLACE THIS
          thumbnail: "/sbk-dance-cover.png"
        }
      ],
      categoryId: 6,
    },
    {
      id: 8,
      title: t("portfolio.projects.winter.title"),
      description: t("portfolio.projects.winter.desc"),
      location: t("portfolio.projects.winter.location"),
      coverImageUrl: "/winter-wedding-cover.png",
      media: [
        { type: "image", url: "/winter-wedding-cover.png" },
        { type: "image", url: "/winter-detail-decor.png" }
      ],
      categoryId: 1,
    },
  ];

  const projects = allProjects.filter(p => !selectedCategory || p.categoryId === selectedCategory);

  const openGallery = (project: any, index: number = 0) => {
    setSelectedProject(project);
    setCurrentMediaIndex(index);
  };

  const closeGallery = () => {
    setSelectedProject(null);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (selectedProject) {
      const mediaList = selectedProject.media;
      setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
    }
  };

  const prevMedia = () => {
    if (selectedProject) {
      const mediaList = selectedProject.media;
      setCurrentMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
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
              const mediaList = project.media;
              const imageCount = mediaList.filter((m: any) => m.type === 'image').length;
              const videoCount = mediaList.filter((m: any) => m.type === 'video').length;

              return (
                <Card
                  key={project.id}
                  className="group cursor-pointer overflow-hidden border-border hover:shadow-xl transition-shadow"
                  onClick={() => openGallery(project, 0)}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {videoCount > 0 && (
                      <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
                      </div>
                    )}
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
                    <div className="flex gap-2 text-sm text-primary mt-3 font-medium">
                      <span>{t("portfolio.view_photos", { count: imageCount + videoCount })}</span>
                      {videoCount > 0 && <span>• {videoCount} Videos</span>}
                      <span>→</span>
                    </div>
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
          <DialogContent className="max-w-6xl w-full p-0 bg-black/95 border-none h-[80vh] flex flex-col justify-center">
            <DialogTitle className="sr-only">{selectedProject.title}</DialogTitle>
            <div className="relative w-full h-full flex flex-col">
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                {Array.isArray(selectedProject.media) && selectedProject.media[currentMediaIndex] ? (
                  selectedProject.media[currentMediaIndex].type === 'video' ? (
                    <video
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-w-full max-h-full"
                      poster={selectedProject.media[currentMediaIndex].thumbnail}
                    >
                      <source src={selectedProject.media[currentMediaIndex].url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedProject.media[currentMediaIndex].url}
                      alt={`${selectedProject.title} - ${currentMediaIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  )
                ) : (
                  <div className="text-white/50">Media not available</div>
                )}

                {Array.isArray(selectedProject.media) && selectedProject.media.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Previous item"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label="Next item"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 text-white bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 w-full">
                <h3 className="text-2xl font-serif font-semibold mb-1">
                  {selectedProject.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  {selectedProject.location && (
                    <p>📍 {selectedProject.location}</p>
                  )}
                  <span className="opacity-50">|</span>
                  <p>
                    Item {currentMediaIndex + 1} of {selectedProject.media?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
