import type { Metadata } from "next";
import { Inter, Archivo_Black, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { MetaPixel } from "@/components/meta-pixel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "7 Pasos para Cambiar tu Vida | Tu programa de 180 días",
  description:
    "Transformá tu vida en 180 días con micro-decisiones. 7 pasos simples, miles de victorias. Todo cuenta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${archivoBlack.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased bg-cream-50`}
      >
        <MetaPixel />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
