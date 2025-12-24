import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, Users, CloudRain, MapPin, Heart, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Protocol() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
            <Navigation />

            {/* Editorial Hero */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="container max-w-4xl mx-auto text-center">
                    <span className="block font-sans text-xs tracking-[0.3em] uppercase text-primary mb-6">
                        {t('protocol_page.hero.eyebrow')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
                        {t('protocol_page.hero.title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto italic">
                        {t('protocol_page.hero.subtitle')}
                    </p>
                    <div className="mt-12 w-24 h-1 bg-primary mx-auto opacity-50"></div>
                </div>
            </section>

            {/* Intro */}
            <section className="py-16 px-6">
                <div className="container max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-foreground">
                        {t('protocol_page.intro.p1').replace(/\{\{strong\}\}/g, '').replace(/\{\{\/strong\}\}/g, '')}
                    </p>
                    <p>
                        {t('protocol_page.intro.p2').replace(/\{\{em\}\}/g, '').replace(/\{\{\/em\}\}/g, '')}
                    </p>
                </div>
            </section>

            {/* Section 1: Timeline */}
            <section className="py-20 bg-card border-y border-border">
                <div className="container max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
                        {t('protocol_page.timeline.title')} <span className="block text-lg font-sans text-muted-foreground mt-2 tracking-wide uppercase">{t('protocol_page.timeline.subtitle')}</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif mb-2">{t('protocol_page.timeline.foundation.title')}</h3>
                                    <p className="text-muted-foreground">{t('protocol_page.timeline.foundation.desc')}</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif mb-2">{t('protocol_page.timeline.guests.title')}</h3>
                                    <p className="text-muted-foreground">{t('protocol_page.timeline.guests.desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background p-8 rounded-xl shadow-sm border border-border">
                            <h3 className="text-xl font-bold font-serif mb-6 text-center">The Vendor Priority Triad</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold">1</div>
                                    <span className="text-lg">{t('protocol_page.timeline.triad.1')}</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold">2</div>
                                    <span className="text-lg">{t('protocol_page.timeline.triad.2')}</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold">3</div>
                                    <span className="text-lg">{t('protocol_page.timeline.triad.3')}</span>
                                </li>
                            </ul>
                            <p className="mt-8 text-sm italic text-muted-foreground text-center">
                                {t('protocol_page.timeline.triad.insight')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Caregiver Checklist */}
            <section className="py-20 bg-[#F5F2EA]">
                <div className="container max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
                        2. The Caregiver Checklists <span className="block text-lg font-sans text-muted-foreground mt-2 tracking-wide uppercase">What Others Forget</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-card border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 text-center pt-10">
                                <CloudRain className="w-10 h-10 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-semibold mb-4">The Rain Plan</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Luxembourg Reality: Never assume sun. We design for rain so that if it happens, it feels intentional (e.g., clear marquees, cozy indoor lighting).
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 text-center pt-10">
                                <MapPin className="w-10 h-10 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-semibold mb-4">Kirchberg-Moselle Gap</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    If your ceremony is in the city and reception in the country, provide shuttles. It allows guests to indulge and ensures everyone arrives on <em>your</em> timeline.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8 text-center pt-10">
                                <Heart className="w-10 h-10 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-semibold mb-4">Dietary Dignity</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Vegetarian/Vegan options should be as visually stunning as the main menu. A guest treated with care is a guest who raves about your event.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Section 3: Budgeting */}
            <section className="py-20 bg-background">
                <div className="container max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
                        3. Budgeting for Peace of Mind
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 md:p-6 font-serif text-lg">Investment</th>
                                    <th className="p-4 md:p-6 font-serif text-lg">Impact</th>
                                    <th className="p-4 md:p-6 font-serif text-lg">WE Insight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr className="bg-card/50">
                                    <td className="p-4 md:p-6 font-semibold">Coordination</td>
                                    <td className="p-4 md:p-6 text-primary font-bold">High</td>
                                    <td className="p-4 md:p-6 text-muted-foreground">Buying a coordinator is buying your own presence. Be a guest at your own event.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 md:p-6 font-semibold">Lighting</td>
                                    <td className="p-4 md:p-6 text-primary font-bold">High</td>
                                    <td className="p-4 md:p-6 text-muted-foreground">Lighting transforms a room more effectively than flowers, for half the cost.</td>
                                </tr>
                                <tr className="bg-card/50">
                                    <td className="p-4 md:p-6 font-semibold">Favors</td>
                                    <td className="p-4 md:p-6 text-muted-foreground font-medium">Low</td>
                                    <td className="p-4 md:p-6 text-muted-foreground">Guests forget "stuff". They remember how they <em>felt</em> (Music, Food, Flow).</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary text-primary-foreground text-center px-6">
                <div className="container max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold">{t('protocol_page.cta.title')}</h2>
                    <p className="text-lg md:text-xl opacity-90 font-light">
                        {t('protocol_page.cta.text')}
                    </p>
                    <div className="pt-4">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                                {t('protocol_page.cta.button')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
