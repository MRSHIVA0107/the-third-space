import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "The Third Space — UTSAAH 3.0",
    template: "%s | The Third Space",
  },
  description:
    "The Third Space at MLRIT — a student-led space for conversations, mental health, creative expression, art and community. Join us for UTSAAH 3.0 on 19 September 2026.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "The Third Space",
    title: "The Third Space — UTSAAH 3.0",
    description:
      "A student-led community space at MLRIT for conversations, mental health, art and connection. UTSAAH 3.0 — 19 September 2026.",
    images: [
      {
        url: "/event/utsaah-banner.png",
        width: 1200,
        height: 630,
        alt: "The Third Space × Psychologs — UTSAAH 3.0",
      },
    ],
  },
  icons: {
    icon: "/brand/logo.jpeg",
    shortcut: "/brand/logo.jpeg",
    apple: "/brand/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="bg-cream text-ink min-h-screen flex flex-col antialiased selection:bg-lime/30 selection:text-forest">
        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
