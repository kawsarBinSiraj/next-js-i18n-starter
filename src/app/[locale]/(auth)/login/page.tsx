import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.login" });
    return { title: t("title") };
}

export default function LoginPage() {
    return <LoginForm />;
}
