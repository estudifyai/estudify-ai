import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://estudify.ai"),
  title: "estudify.ai — Estudia menos. Aprende más.",
  description:
    "La plataforma de estudio con IA que convierte tus apuntes en material accionable. Mide tu dominio real con Exam Readiness Score. No hace tu tarea, te entrena para dominar el examen.",
  openGraph: {
    title: "estudify.ai",
    description: "Estudia menos. Aprende más.",
    url: "https://estudify.ai",
    siteName: "estudify.ai",
    locale: "es_MX",
    type: "website",
  },
  icons: {
    icon: "/brand/logo-mark.png",
    apple: "/brand/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* PP Editorial New clone vía Fontshare — serif premium editorial */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=editorial-new@400,500,700,400i,500i,700i&f[]=general-sans@500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
