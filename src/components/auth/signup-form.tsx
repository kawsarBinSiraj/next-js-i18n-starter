/**
 * components/auth/signup-form.tsx
 *
 * Client component — registration form.
 *
 * Collects name, email, password, and confirmPassword.
 * Validates with yup (including password-match cross-field rule).
 * Calls useSignup() mutation on submit.
 */

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSignup } from "@/hooks/auth/use-signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ---- Component --------------------------------------------------------

export function SignupForm() {
    const t = useTranslations("auth");
    const { mutate: signup, isPending, error } = useSignup();

    const signupSchema = yup.object({
        name: yup.string().min(2, t("validation.nameMin")).required(t("validation.nameRequired")),
        email: yup.string().email(t("validation.emailInvalid")).required(t("validation.emailRequired")),
        password: yup.string().min(8, t("validation.passwordMin")).required(t("validation.passwordRequired")),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], t("validation.passwordsNotMatch"))
            .required(t("validation.confirmPasswordRequired")),
    });

    type SignupFields = yup.InferType<typeof signupSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFields>({ resolver: yupResolver(signupSchema) });

    function onSubmit(data: SignupFields) {
        signup({ name: data.name, email: data.email, password: data.password });
    }

    return (
        <Card className="mx-auto w-full max-w-md rounded-3xl border-white/50 bg-white/85 shadow-2xl shadow-amber-950/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/40">
            {/* Header */}
            <CardHeader className="space-y-3 pb-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    <Sparkles className="size-3.5" />
                    {t("newHere")}
                </div>
                <CardTitle className="text-3xl tracking-tight">{t("signup.title")}</CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                    {t("signup.description")}
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

                    {/* Full name */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="name"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("signup.name")}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder={t("signup.namePlaceholder")}
                            autoComplete="name"
                            className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("signup.email")}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t("signup.emailPlaceholder")}
                            autoComplete="email"
                            className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("signup.password")}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={t("signup.passwordPlaceholder")}
                            autoComplete="new-password"
                            className="h-11 rounded-xl bg-white/90 dark:bg-slate-900/80"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    {/* Confirm password */}
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                        >
                            {t("signup.confirmPassword")}
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={t("signup.confirmPasswordPlaceholder")}
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
                        {isPending ? t("signup.submitting") : t("signup.submit")}
                    </Button>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                        {t("signup.haveAccount")}{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
                        >
                            {t("signup.signIn")}
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
