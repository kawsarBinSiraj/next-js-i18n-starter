/**
 * app/page.tsx — Root redirect.
 *
 * All real pages live under app/[locale]/.
 * The proxy (middleware) handles locale detection, but this fallback
 * ensures a clean permanent redirect if the page is ever pre-rendered directly.
 */

import { permanentRedirect } from "next/navigation";

export default function RootPage() {
    permanentRedirect("/en");
}
