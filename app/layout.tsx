import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteName = "Therapissed";
const siteDescription =
  "Blunt, practical tools to decode arguments, understand relationship patterns, reality-check your reactions, and figure out what to say next.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.therapissed.xyz"),
  applicationName: siteName,
  title: {
    default: "Therapissed | Relationship & Emotional Reflection Tools",
    template: "%s | Therapissed",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Tori" }],
  creator: "Tori",
  publisher: "Therapissed",
  category: "Relationship and emotional reflection tools",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: "Therapissed | Relationship & Emotional Reflection Tools",
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: "Therapissed | Relationship & Emotional Reflection Tools",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0f",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Therapissed",
  url: "https://www.therapissed.xyz/",
  description: siteDescription,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  creator: {
    "@type": "Person",
    name: "Tori",
  },
  featureList: [
    "Solo emotional reflection sessions",
    "Couples communication and conflict reflection",
    "Family pattern reflection",
    "Reaction reality checks",
    "Argument and fight decoding",
    "Message and conversation wording help",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
