import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Kinetix — AI CSV Importer",
  description: "Upload any lead CSV — AI maps it to your CRM format automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="relative min-h-screen">
        <AuroraBackground />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}