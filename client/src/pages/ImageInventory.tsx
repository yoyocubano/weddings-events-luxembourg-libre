import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function ImageInventory() {
    const images = [
        { name: "City Engagement", path: "/city-engagement.png" },
        { name: "Couple Balcony Luxury", path: "/couple-balcony-luxury.png" },
        { name: "Hero Chateau Sunset", path: "/hero-chateau-sunset.png" },
        { name: "Table Details Gold", path: "/table-details-gold.png" },
        { name: "Testimonial Sophie & Marc", path: "/testimonial-sophie-marc.png" },
        { name: "Under Renovation Staff", path: "/under_renovation_staff.png" },
        { name: "Logo WEL", path: "/logo-wel.png" },
        { name: "Logo WEL (Variant)", path: "/logo-well.png" },
        { name: "Renovation Placeholder", path: "/renovation-placeholder.png" },
    ];

    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (path: string) => {
        navigator.clipboard.writeText(path);
        setCopied(path);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <section className="pt-32 pb-16 bg-background">
                <div className="container">
                    <h1 className="text-4xl font-serif font-bold mb-8 text-center">Image Inventory</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img) => (
                            <Card key={img.path} className="overflow-hidden bg-card border-border">
                                <div className="aspect-[16/9] bg-muted relative flex items-center justify-center p-4">
                                    <img
                                        src={img.path}
                                        alt={img.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-lg mb-2">{img.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-muted px-2 py-1 rounded text-sm flex-1 truncate">
                                            {img.path}
                                        </code>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(img.path)}
                                            title="Copy path"
                                        >
                                            {copied === img.path ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
