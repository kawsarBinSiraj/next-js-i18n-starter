/**
 * src/proxy.ts — Next.js 16 proxy / middleware entry point.
 *
 * Combines next-intl locale routing with the JWT auth guard.
 *
 * Order of operations for every matched request:
 *  1. Strip the locale prefix from the pathname.
 *  2. Auth routes  (login, signup, …)
 *     - Valid token → redirect to /[locale]/dashboard.
 *     - No / invalid token → hand off to next-intl routing (pass through).
 *  3. Protected routes (/dashboard, …)
 *     - No token → redirect to /[locale]/login?callbackUrl=<path>.
 *     - Valid token → hand off to next-intl routing (pass through).
 *     - Expired/invalid token → clear cookie, redirect to /[locale]/login.
 *  4. Everything else → hand off to next-intl routing.
 */

import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { verifyToken } from "@/lib/jwt";
import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTES } from "@/utils/constants";

const handleI18nRouting = createMiddleware(routing);

/** Strip locale prefix: /en/dashboard → /dashboard, /ar → / */
function stripLocale(pathname: string): string {
    for (const locale of routing.locales) {
        if (pathname === `/${locale}`) return "/";
        if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
    }
    return pathname;
}

/** Detect the locale from the pathname, fallback to defaultLocale */
function getLocale(pathname: string): string {
    for (const locale of routing.locales) {
        if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
    }
    return routing.defaultLocale;
}

/**
 * Returns true when the given (locale-stripped) pathname matches a protected route.
 */
function isProtectedRoute(localPathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => localPathname === route || localPathname.startsWith(`${route}/`));
}

/**
 * Returns true when the given (locale-stripped) pathname matches an auth-only route.
 */
function isAuthRoute(localPathname: string): boolean {
    return AUTH_ROUTES.some((route) => localPathname === route || localPathname.startsWith(`${route}/`));
}

/**
 * Next.js 16 proxy — runs before every request matched by `config.matcher`.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    const localPathname = stripLocale(pathname);
    const locale = getLocale(pathname);
    const token = request.cookies.get("access_token")?.value;

    // ── Auth routes ────────────────────────────────────────────────────────────
    // If the user is authenticated and tries to visit an auth page → redirect to dashboard
    if (isAuthRoute(localPathname)) {
        if (token) {
            try {
                await verifyToken(token);
                return NextResponse.redirect(new URL(`/${locale}${ROUTES.DASHBOARD}`, request.url));
            } catch {
                // Token invalid — let them through to the auth page
            }
        }
        return handleI18nRouting(request);
    }

    // ── Public routes ──────────────────────────────────────────────────────────
    // Skip auth guard entirely for routes that are neither auth nor protected
    if (!isProtectedRoute(localPathname)) {
        return handleI18nRouting(request);
    }

    // ── Protected routes ───────────────────────────────────────────────────────
    // No token → redirect to login and remember where the user was headed
    if (!token) {
        const loginUrl = new URL(`/${locale}${ROUTES.LOGIN}`, request.url);
        loginUrl.searchParams.set("callbackUrl", localPathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify signature and expiry — throws on any failure
        await verifyToken(token);
        return handleI18nRouting(request);
    } catch {
        // Token is invalid or expired — clear it and send the user to login
        const loginUrl = new URL(`/${locale}${ROUTES.LOGIN}`, request.url);
        loginUrl.searchParams.set("callbackUrl", localPathname);

        const response = NextResponse.redirect(loginUrl);
        // Expire the cookie immediately so the browser discards it
        response.cookies.set("access_token", "", { maxAge: 0 });
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - public files (images, icons, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.*|apple-icon.*).*)",
    ],
};
