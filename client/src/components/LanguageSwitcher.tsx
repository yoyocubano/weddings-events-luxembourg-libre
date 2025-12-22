import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    // Get the base language code (e.g., 'en-US' -> 'en')
    const currentLanguage = i18n.language?.split('-')[0] || 'en';

    return (
        <Select value={currentLanguage} onValueChange={(value) => i18n.changeLanguage(value)}>
            <SelectTrigger className="w-[140px] bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <SelectValue placeholder="Language" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="lb">Lëtzebuergesch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
            </SelectContent>
        </Select>
    );
}
