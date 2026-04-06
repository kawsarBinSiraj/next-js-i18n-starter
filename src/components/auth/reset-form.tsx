/**
 * components/auth/reset-form.tsx
 *
 * Client component — set new password form.
 *
 * Step 2 of the reset flow: the user arrives via the reset link in their
 * email and sets a new password. Validates that both fields match using
 * a yup cross-field rule.
 * Replace useNewPassword() body with a real API call when ready.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useNewPassword } from "@/hooks/auth/use-new-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ResetForm() {
    /** Track whether the password was successfully updated */
    const [updated, setUpdated] = useState(false);
    const t = useTranslations("auth");

    const resetSchema = yup.object({
        newPassword: yup.string().min(8, t("validation.passwordMin")).required(t("validation.passwordRequired")),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("newPassword")], t("validation.passwordsNotMatch"))
            .required(t("validation.confirmPasswordRequired")),
    });

    type ResetFields = yup.InferType<typeof resetSchema>;

    const { mutate: setNewPassword, isPending, error } = useNewPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFields>({ resolver: yupResolver(resetSchema) });

    function onSubmit(data: ResetFields) {
        // In a real app, read the reset token from the URL search params
        const token =
            typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("token") ?? "") : "";

        setNewPassword({ token, newPassword: data.newPassword }, { onSuccess: () => setUpdated(true) });
    }

    // ---- Success state -------------------------------------------------
    if (updated) {
        return (
            <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
                <CardHeader className="space-y-3">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <KeyRound className="size-3.5" />
                        {t("reset.success.badge")}
                    </div>
                    <CardTitle className="text-3xl tracking-tight">{t("reset.success.title")}</CardTitle>
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                        {t("reset.success.description")}
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
                        <Link href="/login">{t("reset.success.backToLogin")}</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // ---- Default state -------------------------------------------------
    return (
        <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
            {/* Header */}
            <CardHeader className="space-y-3 pb-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    <KeyRound className="size-3.5" />
                    {t("securityUpdate")}
                </div>
                <CardTitle className="text-3xl tracking-tight">{t("reset.title")}</CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                    {t("reset.description")}
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-5">
                    {/* Server error banner */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                        >
                            {error.message}
                        </div>
                    )}

                    {/* New password */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="newPassword"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("reset.newPassword")}
                        </Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder={t("reset.newPasswordPlaceholder")}
                            autoComplete="new-password"
                            className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
                    </div>

                    {/* Confirm password */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("reset.confirmPassword")}
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={t("reset.confirmPasswordPlaceholder")}
                            autoComplete="new-password"
                            className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                    <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={isPending}>
                        {isPending ? t("reset.submitting") : t("reset.submit")}
                    </Button>

                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300"
                    >
                        {t("reset.backToLogin")}
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
