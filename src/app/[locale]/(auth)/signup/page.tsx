import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/components/auth";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.signup" });
    return { title: t("title") };
}

export default function SignupPage() {
    return <SignupForm />;
}
