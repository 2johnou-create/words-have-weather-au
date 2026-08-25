import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://words-have-weather-au.misty-jelly-1931.chatgpt.site";
const title = "Words Have Weather | Keep the boundary. Change the weather.";
const description = "Short illustrated Australian education stories that help parents, carers and educators keep a clear boundary and try one useful next sentence.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Words Have Weather" },
  description,
  applicationName: "Words Have Weather",
  authors: [{ name: "Words Have Weather" }],
  creator: "Words Have Weather",
  publisher: "Words Have Weather",
  keywords: ["parent communication", "Australian Curriculum", "EYLF", "educator resources", "social emotional learning", "classroom communication", "parent workbooks", "illustrated story ebooks", "iPad books for children"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: { title, description, type: "website", locale: "en_AU", siteName: "Words Have Weather", url: "/", images: [{ url: "/og-ebooks-v1.png", width: 1200, height: 630, alt: "Willo and the Words Have Weather cast sharing six illustrated Story eBooks as stormy word-weather opens into warm light" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-ebooks-v1.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "education",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6efe3", colorScheme: "light" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Words Have Weather", url: siteUrl, inLanguage: "en-AU", description },
            { "@type": "EducationalOrganization", "@id": `${siteUrl}/#organisation`, name: "Words Have Weather", url: siteUrl, description: "A commercially neutral illustrated communication-story library for Australian parents, carers and educators.", areaServed: "Australia" },
            { "@type": "CreativeWorkSeries", name: "Words Have Weather episodes", url: `${siteUrl}/episodes`, inLanguage: "en-AU", educationalUse: ["Family learning", "Teacher professional reflection", "Classroom discussion"], audience: [{ "@type": "EducationalAudience", educationalRole: "teacher" }, { "@type": "PeopleAudience", suggestedMinAge: 4, suggestedMaxAge: 12 }] },
            { "@type": "CreativeWorkSeries", name: "Words Have Weather Story eBooks", url: `${siteUrl}/ebooks`, inLanguage: "en-AU", educationalUse: ["Shared reading", "Family discussion", "Classroom learning"], audience: [{ "@type": "EducationalAudience", educationalRole: "teacher" }, { "@type": "PeopleAudience", suggestedMinAge: 4, suggestedMaxAge: 13 }] },
          ],
        }) }} />
      </body>
    </html>
  );
}
