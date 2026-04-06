/**
 * app/layout.tsx — Minimal root layout.
 *
 * The <html> / <body> and all providers are handled by
 * app/[locale]/layout.tsx so that locale and text direction
 * can be applied per-request.  This file is required by
 * Next.js but intentionally acts as a transparent wrapper.
 */

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
