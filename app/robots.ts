import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

/** Lo público se indexa; el panel, la API y la autenticación no. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/client-dashboard", "/checkout", "/login", "/auth/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
