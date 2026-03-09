import type { Metadata } from "next";
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
    default: "Volntir - Free Digital Waiver Management for Events",
    template: "%s | Volntir",
  },
  description: "Free digital waiver platform for events and organizations. Collect electronic signatures, manage check-ins, and organize unlimited events — no credit card required.",
  keywords: ["digital waivers", "electronic signatures", "event management", "liability waivers", "waiver signing", "event check-in", "free waiver platform", "volunteer management"],
  authors: [{ name: "Volntir" }],
  creator: "Volntir",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://volntir.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Volntir",
    title: "Volntir - Free Digital Waiver Management for Events",
    description: "Collect digital liability waivers, manage event check-ins, and organize unlimited events — completely free.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Volntir - Free Digital Waiver Management for Events" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Volntir - Free Digital Waiver Management",
    description: "Collect digital liability waivers, manage event check-ins, and organize unlimited events — completely free.",
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
