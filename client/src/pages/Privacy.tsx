import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Privacy() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
            <Navigation />

            <main className="flex-grow container py-32 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold mb-8">{t('legal.title')}</h1>

                <div className="prose prose-stone max-w-none space-y-8 text-muted-foreground">
                    <section>
                        <h2 className="text-2xl font-serif text-foreground mb-4">1. {t('legal.controller_title')}</h2>
                        <p>{t('legal.controller_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-foreground mb-4">2. {t('legal.data_title')}</h2>
                        <p>{t('legal.data_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-foreground mb-4">3. {t('legal.purpose_title')}</h2>
                        <p>{t('legal.purpose_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-foreground mb-4">4. {t('legal.rights_title')}</h2>
                        <p>{t('legal.rights_text')}</p>
                    </section>

                    <div className="border-t border-border pt-8 mt-12 text-sm">
                        <p>{t('legal.disclaimer')}</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
