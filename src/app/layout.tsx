import type { Metadata, Viewport } from "next";
import {
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  Roboto_Condensed,
} from "next/font/google";
import "./globals.css";
import "../styles/rorelse.css";
import "../styles/upptackt.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const condensed = Roboto_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  display: "swap",
});

const editorialSerif = DM_Serif_Display({
  variable: "--font-editorial-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "STADEN — Göteborg i din ficka",
    template: "%s — STADEN",
  },
  description:
    "Få ett aktuellt, genomförbart och lite oväntat förslag på vad du kan uppleva i Göteborg.",
  applicationName: "STADEN",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "STADEN — Göteborg i din ficka",
    description:
      "Få ett aktuellt, genomförbart och lite oväntat förslag på vad du kan uppleva i Göteborg.",
    locale: "sv_SE",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#10100f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" data-theme="atelier" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${condensed.variable} ${editorialSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
