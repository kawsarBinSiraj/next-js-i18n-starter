/**
 * components/locale-switcher.tsx
 *
 * Client component — toggles between English and Arabic locales.
 * Uses the locale-aware useRouter and usePathname from next-intl/navigation.
 */

"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function toggleLocale() {
        const nextLocale = locale === "en" ? "ar" : "en";
        router.replace(pathname, { locale: nextLocale });
    }

    return (
        <Button
            variant="outline"
            size="icon-sm"
            onClick={toggleLocale}
            className="rounded-full border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70 cursor-pointer"
            aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
            title={locale === "en" ? "عربي" : "English"}
        >
            <Languages className="size-4" />
        </Button>
    );
}
