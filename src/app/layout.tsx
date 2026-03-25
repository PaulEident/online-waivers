import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Volunteer Management Software for Nonprofits & Events | Volntir",
    template: "%s | Volntir",
  },
  description: "Volntir is free volunteer management software for nonprofits and events. Shift signups, digital waivers, check-ins, and hour tracking — all in one place. No credit card. No trial period. Always free.",
  keywords: ["volunteer management software", "free volunteer management", "nonprofit volunteer software", "volunteer shift signup", "digital waiver software", "volunteer hour tracking", "free SignUpGenius alternative", "event volunteer management", "volunteer check in app", "nonprofit event management"],
  authors: [{ name: "Volntir" }],
  creator: "Volntir",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://volntir.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Volntir",
    title: "Free Volunteer Management Software for Nonprofits & Events | Volntir",
    description: "Free volunteer management software for nonprofits and events — shift signups, digital waivers, check-ins, and hour tracking. No credit card required.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Free Volunteer Management Software for Nonprofits & Events | Volntir" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Volunteer Management Software for Nonprofits | Volntir",
    description: "Free volunteer management for nonprofits — shift signups, digital waivers, check-ins, and hour tracking. No credit card.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  themeColor: "#FF5A1F",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Volntir",
  },
  icons: {
    icon: [
      { url: "/volntir-icon.png", type: "image/png" },
    ],
    apple: "/volntir-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5WJFWLHLYC"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5WJFWLHLYC');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NavBar />
          {children}
          <Footer />
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
