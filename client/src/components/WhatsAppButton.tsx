import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function WhatsAppButton() {
    const { t } = useTranslation();
    const phoneNumber = "352621430283";
    const message = encodeURIComponent("Hello! I would like to inquire about your wedding services.");

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1db954] transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
            aria-label="Contact on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="font-semibold">{t("common.whatsapp")}</span>
        </a>
    );
}
