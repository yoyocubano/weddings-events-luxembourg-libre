import { drizzle } from "drizzle-orm/mysql2";
import { portfolioCategories, portfolioProjects, servicePackages, teamMembers } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  // Portfolio Categories
  const categories = await db.insert(portfolioCategories).values([
    {
      name: "Weddings",
      slug: "weddings",
      description: "Beautiful wedding photography and videography",
      displayOrder: 1,
    },
    {
      name: "Corporate Events",
      slug: "corporate-events",
      description: "Professional corporate event coverage",
      displayOrder: 2,
    },
    {
      name: "Celebrations",
      slug: "celebrations",
      description: "Special celebrations and milestone events",
      displayOrder: 3,
    },
  ]);
  console.log("✅ Categories seeded");

  // Portfolio Projects
  await db.insert(portfolioProjects).values([
    {
      categoryId: 1,
      title: "Elegant Garden Wedding",
      description: "A stunning outdoor ceremony in Luxembourg's beautiful gardens",
      location: "Luxembourg City",
      eventDate: new Date("2024-06-15"),
      coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
      ]),
      featured: 1,
      displayOrder: 1,
    },
    {
      categoryId: 1,
      title: "Romantic Castle Wedding",
      description: "Fairytale wedding at a historic Luxembourg castle",
      location: "Vianden Castle",
      eventDate: new Date("2024-08-20"),
      coverImageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop",
      ]),
      featured: 1,
      displayOrder: 2,
    },
    {
      categoryId: 2,
      title: "Corporate Gala Evening",
      description: "Annual corporate gala with 300+ attendees",
      location: "European Convention Center",
      eventDate: new Date("2024-09-10"),
      coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop",
      ]),
      featured: 1,
      displayOrder: 3,
    },
    {
      categoryId: 3,
      title: "50th Anniversary Celebration",
      description: "Golden anniversary celebration with family and friends",
      location: "Luxembourg City",
      eventDate: new Date("2024-07-05"),
      coverImageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop",
      ]),
      featured: 1,
      displayOrder: 4,
    },
  ]);
  console.log("✅ Portfolio projects seeded");

  // Service Packages
  await db.insert(servicePackages).values([
    {
      name: "Photography Essentials",
      slug: "photography-essentials",
      description: "Perfect for intimate events and smaller celebrations",
      features: JSON.stringify([
        "4 hours of coverage",
        "1 professional photographer",
        "200+ edited high-resolution photos",
        "Online gallery for 1 year",
        "Print release included",
      ]),
      price: "1500.00",
      priceLabel: "Starting from",
      popular: 0,
      displayOrder: 1,
    },
    {
      name: "Complete Wedding Package",
      slug: "complete-wedding-package",
      description: "Our most popular package for full wedding day coverage",
      features: JSON.stringify([
        "8 hours of coverage",
        "2 professional photographers",
        "500+ edited high-resolution photos",
        "Engagement session included",
        "Online gallery for 2 years",
        "Premium photo album (30 pages)",
        "Print release included",
      ]),
      price: "3500.00",
      priceLabel: "Starting from",
      popular: 1,
      displayOrder: 2,
    },
    {
      name: "Premium Video & Photo",
      slug: "premium-video-photo",
      description: "Complete coverage with both photography and videography",
      features: JSON.stringify([
        "Full day coverage (10+ hours)",
        "2 photographers + 2 videographers",
        "800+ edited high-resolution photos",
        "Cinematic highlight video (5-8 min)",
        "Full ceremony and speeches video",
        "Drone footage included",
        "Premium photo album (50 pages)",
        "Online gallery for 3 years",
        "Print and digital release",
      ]),
      price: "6500.00",
      priceLabel: "Starting from",
      popular: 0,
      displayOrder: 3,
    },
  ]);
  console.log("✅ Service packages seeded");

  // Team Members
  await db.insert(teamMembers).values([
    {
      name: "Sophie Laurent",
      role: "Lead Photographer & Founder",
      bio: "With over 12 years of experience, Sophie brings artistic vision and technical excellence to every shoot.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      displayOrder: 1,
    },
    {
      name: "Marc Dubois",
      role: "Senior Videographer",
      bio: "Marc specializes in cinematic storytelling, creating emotional and beautiful wedding films.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      displayOrder: 2,
    },
    {
      name: "Emma Weber",
      role: "Event Photographer",
      bio: "Emma's keen eye for detail ensures every special moment is captured perfectly.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      displayOrder: 3,
    },
  ]);
  console.log("✅ Team members seeded");

  console.log("🎉 Database seeding completed!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
