import { Link } from "wouter";
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <a className="block group">
                <div className="flex flex-col items-start justify-center">
                  <img
                    src="/logo-well-symbol.svg"
                    alt="WEL"
                    className="h-12 w-auto object-contain transition-all duration-300"
                  />
                  <span className="mt-1 font-sans text-[10px] text-[#9F8F6A] tracking-[0.2em] uppercase text-left group-hover:text-primary transition-colors">
                    {t('brand.tagline')}
                  </span>
                </div>
              </a>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.text")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.quick_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.portfolio")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.services")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.about")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.contact")}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>info@welweddingslux.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:weddingeventslux@gmail.com" className="hover:text-primary transition-colors">weddingeventslux@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>+352 621 430 283</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{t("contact.info.location_val") || "Luxembourg City, Luxembourg"}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.follow_us")}</h3>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://instagram.com/welweddingslux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/welweddingslux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@welweddingslux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com/@welweddingslux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9v12c0 1.1.9 2 2 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/welweddingslux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} {t("brand.name")}. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
