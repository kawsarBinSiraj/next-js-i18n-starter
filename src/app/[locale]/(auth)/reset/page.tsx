import { getTranslations } from "next-intl/server";
import { ResetForm } from "@/components/auth";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.reset" });
    return { title: t("title") };
}

export default function ResetPage() {
    return <ResetForm />;
}
