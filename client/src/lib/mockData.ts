export const MOCK_PROJECTS = [
    {
        id: 1,
        title: "Chateau Wedding",
        description: "A beautiful summer wedding at the Grand Chateau.",
        location: "Vianden, Luxembourg",
        coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        imageUrls: JSON.stringify([
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=600&fit=crop"
        ]),
        categoryId: 1
    },
    {
        id: 2,
        title: "City Engagement",
        description: "Romantic engagement shoot in Luxembourg City.",
        location: "Luxembourg City",
        coverImageUrl: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=600&fit=crop",
        imageUrls: JSON.stringify([
            "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=600&fit=crop"
        ]),
        categoryId: 2
    }
];

export const MOCK_CATEGORIES = [
    { id: 1, name: "Weddings" },
    { id: 2, name: "Engagements" },
    { id: 3, name: "Events" }
];

export const MOCK_PACKAGES = [
    {
        id: 1,
        name: "Essential Collection",
        description: "Perfect for intimate weddings and elopements",
        price: 1800,
        priceLabel: "Starting from",
        features: JSON.stringify([
            "6 Hours Coverage",
            "300+ Edited Photos",
            "Online Gallery",
            "USB Drive"
        ]),
        popular: 0
    },
    {
        id: 2,
        name: "Premium Collection",
        description: "Our most popular package for full day coverage",
        price: 3200,
        priceLabel: "Full Day",
        features: JSON.stringify([
            "10 Hours Coverage",
            "500+ Edited Photos",
            "Engagement Session",
            "Fine Art Album",
            "Second Photographer"
        ]),
        popular: 1
    },
    {
        id: 3,
        name: "Cinema Package",
        description: "Cinematic storytelling of your special day",
        price: 2500,
        priceLabel: "Video Only",
        features: JSON.stringify([
            "8 Hours Coverage",
            "4-5 Minute Highlight Film",
            "Drone Footage",
            "Full Ceremony Edit"
        ]),
        popular: 0
    }
];

export const MOCK_TEAM = [
    {
        id: 1,
        name: "Sarah Miller",
        role: "Lead Photographer",
        bio: "With 10 years of experience capturing love stories across Europe.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Marc Weber",
        role: "Cinematographer",
        bio: "Passionate about storytelling through movement and light.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Elena Costa",
        role: "Event Coordinator",
        bio: "Ensuring every moment runs smoothly so you can focus on enjoying it.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    }
];
