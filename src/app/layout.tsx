import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import SessionProvider from "@/components/SessionProvider";
import NavBar from "@/components/NavBar";
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
  title: "Volntir - Digital Waiver Management",
  description: "Collect digital liability waivers for your events. Multi-tenant, role-based, with check-in.",
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
        </SessionProvider>
        {/* Service Worker disabled - enable after fixing SSL certificate trust */}
        {/* <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
              }
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
