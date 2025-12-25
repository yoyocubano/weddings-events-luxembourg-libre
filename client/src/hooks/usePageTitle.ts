import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export function usePageTitle() {
    const { t } = useTranslation();
    const [location] = useLocation();

    useEffect(() => {
        const baseTitle = "WE Weddings & Events Luxembourg";
        let pageTitle = "";

        switch (location) {
            case "/":
                pageTitle = t("nav.home");
                break;
            case "/portfolio":
                pageTitle = t("nav.portfolio");
                break;
            case "/services":
                pageTitle = t("nav.services");
                break;
            case "/about":
                pageTitle = t("nav.about");
                break;
            case "/protocol":
                pageTitle = t("nav.protocol");
                break;
            case "/contact":
                pageTitle = t("nav.contact");
                break;
            case "/privacy":
                pageTitle = t("footer.legal");
                break;
            default:
                pageTitle = "";
        }

        document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
    }, [location, t]);
}
