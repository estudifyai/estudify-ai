import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://estudify.ai"),
  title: {
    default: "Estudify.ai — Estudia menos. Aprende más.",
    template: "%s | Estudify.ai",
  },
  description:
    "La IA que convierte tus apuntes en resúmenes, flashcards y exámenes de práctica. Mide tu dominio real con Exam Readiness Score.",
  keywords: [
    "estudiar con IA",
    "flashcards automáticas",
    "resúmenes inteligentes",
    "exámenes de práctica",
    "tutor socrático",
    "exam readiness score",
    "estudify",
    "app para estudiar",
  ],
  authors: [{ name: "Estudify.ai" }],
  creator: "Estudify.ai",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://estudify.ai",
    siteName: "Estudify.ai",
    title: "Estudify.ai — Estudia menos. Aprende más.",
    description:
      "La IA que convierte tus apuntes en resúmenes, flashcards y exámenes de práctica.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Estudify.ai — Estudia menos. Aprende más.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estudify.ai — Estudia menos. Aprende más.",
    description:
      "La IA que convierte tus apuntes en resúmenes, flashcards y exámenes de práctica.",
    images: ["/og-image.png"],
    creator: "@estudifyai",
    site: "@estudifyai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://estudify.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
