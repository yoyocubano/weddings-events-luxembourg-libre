import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2, Lock } from "lucide-react";

export default function Live() {
    const { t } = useTranslation();

    // Environment Variable for Stream ID (Set in Cloudflare/Vercel)
    const STREAM_PLAYBACK_ID = import.meta.env.VITE_STREAM_PLAYBACK_ID;

    useEffect(() => {
        // Dynamically load the Cloudflare Stream script
        const script = document.createElement("script");
        script.src = "https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js";
        script.defer = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />

            {/* Header Section */}
            <section className="pt-32 pb-12 bg-secondary/20">
                <div className="container text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-600/10 text-red-600 text-xs font-bold tracking-wider mb-4 animate-pulse">
                        LIVE BROADCAST
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        Weddings & Events Live
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Exclusive real-time access to our premier events.
                    </p>
                </div>
            </section>

            {/* Player Section */}
            <section className="py-12 flex-grow">
                <div className="container max-w-5xl">
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50">
                        {STREAM_PLAYBACK_ID ? (
                            <iframe
                                src={`https://customer-m033z5x00ks6qn9k.cloudflarestream.com/${STREAM_PLAYBACK_ID}/iframe?muted=false&preload=true&loop=false&autoplay=false&poster=https%3A%2F%2Fcustomer-m033z5x00ks6qn9k.cloudflarestream.com%2F${STREAM_PLAYBACK_ID}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`}
                                className="w-full h-full"
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen={true}
                                title="Live Stream"
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <Lock className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-xl font-semibold text-muted-foreground mb-2">Private Access</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    No active stream configured. Please contact the event organizer for access.
                                </p>
                                <div className="mt-6 p-4 bg-muted/30 rounded-lg text-xs font-mono text-muted-foreground">
                                    System Status: Standby
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="font-semibold text-lg">{t("footer.brand")} Live</h3>
                            <p className="text-sm text-muted-foreground">High-definition secure broadcast.</p>
                        </div>
                        <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
                            <Loader2 className="w-4 h-4" /> Refresh Status
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
