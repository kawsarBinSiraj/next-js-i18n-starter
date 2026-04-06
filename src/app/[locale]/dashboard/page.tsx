import { getTranslations } from "next-intl/server";
import { DashboardContent } from "@/components/dashboard-content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.dashboard" });
    return { title: t("title") };
}

export default function DashboardPage() {
    return <DashboardContent />;
}
